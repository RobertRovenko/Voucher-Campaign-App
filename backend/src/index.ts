import express from "express";
import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv"; // for CSV download
import cors from "cors"; // <-- import CORS

const app = express();
const prisma = new PrismaClient();

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
}));
app.use(express.json());


// Health check
app.get("/", (req, res) => res.send("Voucher API running 🚀"));

// ========================
// Create a campaign
// ========================
app.post("/campaigns", async (req, res) => {
  try {
    const { prefix, amount, currency, validFrom, validTo } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        prefix,
        amount,
        currency,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// ========================
// Generate vouchers for a campaign
// ========================

app.post("/campaigns/:id/vouchers", async (req, res) => {
  try {
    const campaignId = req.params.id;
    let { count } = req.body;

    if (!count || count <= 0) {
      return res.status(400).json({ error: "Invalid count" });
    }

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const BATCH_SIZE = 1000; // insert 1000 at a time
    let createdCount = 0;

    while (count > 0) {
      const currentBatch = Math.min(count, BATCH_SIZE);
      const vouchersData = Array.from({ length: currentBatch }, () => ({
        code: `${campaign.prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        campaignId,
      }));

      const result = await prisma.voucher.createMany({
        data: vouchersData,
        skipDuplicates: true,
      });

      createdCount += result.count;
      count -= currentBatch;
    }

    res.status(201).json({ created: createdCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create vouchers" });
  }
});


// ========================
// List all campaigns
// ========================
app.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// ========================
// List vouchers in a campaign
// ========================
app.get("/campaigns/:id/vouchers", async (req, res) => {
  try {
    const campaignId = req.params.id;
    const vouchers = await prisma.voucher.findMany({ where: { campaignId } });
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vouchers" });
  }
});

// ========================
// Delete a campaign
// ========================
app.delete("/campaigns/:id", async (req, res) => {
  try {
    const campaignId = req.params.id;

    // Delete vouchers first to avoid foreign key errors
    await prisma.voucher.deleteMany({ where: { campaignId } });
    await prisma.campaign.delete({ where: { id: campaignId } });

    res.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
});

// ========================
// Download vouchers as CSV
// ========================
app.get("/campaigns/:id/vouchers/csv", async (req, res) => {
  try {
    const campaignId = req.params.id;
    const vouchers = await prisma.voucher.findMany({ where: { campaignId } });

    if (vouchers.length === 0) return res.status(404).json({ error: "No vouchers found" });

    const parser = new Parser({ fields: ["id", "code", "campaignId"] });
    const csv = parser.parse(vouchers);

    res.header("Content-Type", "text/csv");
    res.attachment(`vouchers_${campaignId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download CSV" });
  }
});

// backend/index.ts
app.get("/campaigns/:id/vouchers/stream", async (req, res) => {
  const campaignId = req.params.id;
  let count = parseInt(req.query.count as string);
  let batchSize = parseInt(req.query.batchSize as string) || 100;

  if (!count || count <= 0) return res.status(400).json({ error: "Invalid count" });

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return res.status(404).json({ error: "Campaign not found" });

  let createdTotal = 0;

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  while (count > 0) {
    const currentBatch = Math.min(count, batchSize);
    const data = Array.from({ length: currentBatch }, () => ({
      code: `${campaign.prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      campaignId,
    }));

    const result = await prisma.voucher.createMany({ data, skipDuplicates: true });
    createdTotal += result.count;
    count -= currentBatch;

    res.write(`data: ${JSON.stringify({ batchCreated: result.count, totalCreated: createdTotal })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({ done: true, totalCreated: createdTotal })}\n\n`);
  res.end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedVouchers() {
  console.log("🚀 Starting voucher seed...");

  const startTime = Date.now(); 

  // find or create a campaign to attach vouchers to
  let campaign = await prisma.campaign.findFirst({
    where: { prefix: "SEED-MASSIVE" },
  });

  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        prefix: "SEED-MASSIVE",
        amount: 20,
        currency: "USD",
        validFrom: new Date(),
        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      },
    });
    console.log("Created campaign:", campaign.id);
  } else {
    console.log("Using existing campaign:", campaign.id);
  }

  const total = 100_000;
  const batchSize = 1_000;

  for (let i = 0; i < total; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, total - i);
    const batch = Array.from({ length: currentBatchSize }, (_, j) => ({
      code: `VOUCHER-${String(i + j + 1).padStart(6, "0")}`,
      campaignId: campaign!.id,
    }));

    await prisma.voucher.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(`Inserted ${Math.min(i + batchSize, total)}/${total}`);
  }

  const endTime = Date.now();
  console.log(`Voucher seeding complete! Total time: ${(endTime - startTime).toLocaleString()} ms`);
  await prisma.$disconnect();
}

seedVouchers().catch((e) => {
  console.error(e);
  process.exit(1);
});

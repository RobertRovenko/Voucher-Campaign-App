// src/app/campaigns/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVouchers, downloadVouchersCSV } from "../../../services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Type for progress updates from SSE
interface VoucherProgress {
  batchCreated: number;
  totalCreated: number;
  done?: boolean;
}

// SSE voucher creation function
function createVouchersStream(
  campaignId: string,
  count: number,
  batchSize: number,
  onUpdate: (progress: VoucherProgress) => void,
  onDone?: () => void
) {
  const url = `${API_URL}/campaigns/${campaignId}/vouchers/stream?count=${count}&batchSize=${batchSize}`;
  const evtSource = new EventSource(url);

  evtSource.onmessage = (event) => {
    const data: VoucherProgress = JSON.parse(event.data);
    if (data.done) {
      evtSource.close();
      onDone?.();
    } else {
      onUpdate(data);
    }
  };

  evtSource.onerror = () => {
    console.error("Stream error");
    evtSource.close();
  };

  return evtSource;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = typeof params.id === "string" ? params.id : null;

  const [vouchersPreview, setVouchersPreview] = useState<any[]>([]);
  const [batchCount, setBatchCount] = useState<number>(1000); // user input
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<VoucherProgress>({
    batchCreated: 0,
    totalCreated: 0,
  });

  // Fetch only first 20 vouchers for preview
  const fetchVouchersPreview = async () => {
    if (!campaignId) return;
    const data = await getVouchers(campaignId, 20);
    setVouchersPreview(data);
  };

  useEffect(() => {
    fetchVouchersPreview();
  }, [campaignId]);

  const handleGenerateStream = () => {
    if (!campaignId) return;
    setLoading(true);
    setProgress({ batchCreated: 0, totalCreated: 0 });

    createVouchersStream(
      campaignId,
      batchCount,
      100, // batch size
      (update) => setProgress(update),
      () => {
        setLoading(false);
        fetchVouchersPreview(); // refresh preview after done
      }
    );
  };

  const handleDownload = async () => {
    if (!campaignId) return;
    await downloadVouchersCSV(campaignId);
  };

  if (!campaignId) return <p className="text-red-600">Invalid campaign ID</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold">Vouchers</h1>

      <div className="flex space-x-2">
        <input
          type="number"
          className="border p-2 rounded w-32"
          value={batchCount}
          onChange={(e) => setBatchCount(Number(e.target.value))}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleGenerateStream}
          disabled={loading}
        >
          {loading
            ? `Generating... (${progress.totalCreated})`
            : "Generate Vouchers"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleDownload}
        >
          Download CSV
        </button>
      </div>

      {loading && (
        <p className="text-gray-600">
          Created {progress.totalCreated} vouchers so far...
        </p>
      )}

      <div>
        <h2 className="text-lg font-semibold mt-4">
          Preview (first 20 vouchers)
        </h2>
        {vouchersPreview.length === 0 ? (
          <p>No vouchers yet.</p>
        ) : (
          <ul className="space-y-1">
            {vouchersPreview.map((v) => (
              <li key={v.id} className="font-mono">
                {v.code}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

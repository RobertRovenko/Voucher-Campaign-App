"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getVouchers,
  downloadVouchersCSV,
  deleteVoucher,
} from "../../../services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CONFIRM_TIMEOUT = 3000; // 3 seconds

interface Voucher {
  id: string;
  code: string;
}

interface VoucherProgress {
  batchCreated: number;
  totalCreated: number;
  done?: boolean;
}

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
  const router = useRouter();
  const campaignId = typeof params.id === "string" ? params.id : null;

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [batchCount, setBatchCount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<VoucherProgress>({
    batchCreated: 0,
    totalCreated: 0,
  });
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<Set<string>>(
    new Set()
  );

  // pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [total, setTotal] = useState(0);

  const fetchVouchers = async () => {
    if (!campaignId) return;
    try {
      const res = await getVouchers(campaignId, page, limit);
      setVouchers(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      alert("Failed to load vouchers");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [campaignId, page]);

  const handleGenerateStream = () => {
    if (!campaignId) return;
    const count = Number(batchCount);
    if (isNaN(count) || count <= 0) return;

    setLoading(true);
    setProgress({ batchCreated: 0, totalCreated: 0 });

    createVouchersStream(
      campaignId,
      count,
      100,
      (update) => setProgress(update),
      () => {
        setLoading(false);
        fetchVouchers();
      }
    );
  };

  const handleDownload = async () => {
    if (!campaignId) return;
    await downloadVouchersCSV(campaignId);
  };

  const toggleConfirmDelete = (id: string) => {
    setConfirmDeleteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDeleteClick = async (voucherId: string) => {
    if (!confirmDeleteIds.has(voucherId)) {
      toggleConfirmDelete(voucherId);

      setTimeout(() => {
        setConfirmDeleteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(voucherId);
          return newSet;
        });
      }, CONFIRM_TIMEOUT);
    } else {
      try {
        await deleteVoucher(voucherId);
        toggleConfirmDelete(voucherId);
        fetchVouchers();
      } catch (err) {
        console.error(err);
        alert("Failed to delete voucher");
      }
    }
  };

  if (!campaignId) return <p className="text-red-600">Invalid campaign ID</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-4"
      >
        ← Go Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={batchCount}
            onChange={(e) => {
              const val = e.target.value.replace(/^0+/, "");
              setBatchCount(val);
            }}
            min={1}
            placeholder="0"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleGenerateStream}
            disabled={loading || Number(batchCount) <= 0}
          >
            {loading
              ? `Generating... (${progress.totalCreated})`
              : "Generate Vouchers"}
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            onClick={handleDownload}
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Progress */}
      {loading && (
        <div className="text-gray-700">
          Creating vouchers…{" "}
          <span className="font-medium">{progress.totalCreated}</span> so far
        </div>
      )}

      {/* Voucher Table */}
      <div>
        {vouchers.length === 0 ? (
          <p className="text-gray-500">No vouchers yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Code
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {vouchers.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-2 text-gray-500">{v.id}</td>
                    <td className="px-4 py-2 font-mono text-gray-900">
                      {v.code}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`w-28 text-center px-3 py-1 rounded transition ${
                          confirmDeleteIds.has(v.id)
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                        onClick={() => handleDeleteClick(v.id)}
                      >
                        {confirmDeleteIds.has(v.id) ? "Sure?" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / limit)} ({total} total)
          </p>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))
              }
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

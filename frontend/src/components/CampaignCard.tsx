"use client";

import Link from "next/link";
import { useState } from "react";

interface Campaign {
  id: string;
  prefix: string;
  amount: number;
  currency: string;
  validFrom: string;
  validTo: string;
}

export default function CampaignCard({
  campaign,
  onDelete,
}: {
  campaign: Campaign;
  onDelete?: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // reset after 3s
    } else {
      onDelete?.();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between min-w-0">
      {/* Header: Date always above title */}
      <div className="flex flex-col mb-3 gap-1">
        {/* Date */}
        <span className="text-sm text-gray-500">
          {new Date(campaign.validFrom).toLocaleDateString()} -{" "}
          {new Date(campaign.validTo).toLocaleDateString()}
        </span>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {campaign.prefix} Campaign
        </h2>
      </div>

      {/* Campaign Amount */}
      <p className="text-gray-700 mb-4 truncate">
        Amount:{" "}
        <span className="font-medium">
          {campaign.amount} {campaign.currency}
        </span>
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-auto">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded hover:bg-blue-100 transition"
        >
          View Vouchers
        </Link>

        {onDelete && (
          <button
            onClick={handleDelete}
            className={`px-4 py-2 font-medium rounded transition ${
              confirmDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            {confirmDelete ? "Are you sure?" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}

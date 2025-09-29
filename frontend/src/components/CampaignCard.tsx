import Link from "next/link";

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
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="font-bold text-lg">{campaign.prefix} Campaign</h2>
      <p>
        Amount: {campaign.amount} {campaign.currency}
      </p>
      <p>
        Valid: {new Date(campaign.validFrom).toLocaleDateString()} -{" "}
        {new Date(campaign.validTo).toLocaleDateString()}
      </p>
      <div className="mt-2 space-x-2">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-blue-600 hover:underline"
        >
          View Vouchers
        </Link>
        {onDelete && (
          <button className="text-red-600 hover:underline" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

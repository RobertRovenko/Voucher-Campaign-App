"use client";

import { useEffect, useState } from "react";
import { getCampaigns, deleteCampaign } from "../services/api";
import CampaignCard from "../components/CampaignCard";

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchCampaigns = async () => {
    const data = await getCampaigns();
    setCampaigns(data);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCampaign(id);
    fetchCampaigns();
  };

  return (
    <div className="space-y-4">
      {campaigns.map((c) => (
        <CampaignCard
          key={c.id}
          campaign={c}
          onDelete={() => handleDelete(c.id)}
        />
      ))}
      {campaigns.length === 0 && <p>No campaigns yet.</p>}
    </div>
  );
}

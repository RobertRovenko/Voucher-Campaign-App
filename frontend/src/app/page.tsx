"use client";

import { useEffect, useState } from "react";
import { getCampaigns, deleteCampaign } from "../services/api";
import CampaignCard from "../components/CampaignCard";

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [filterCurrency, setFilterCurrency] = useState("all");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCampaign(id);
    fetchCampaigns();
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (sort === "newest")
      return new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime();
    if (sort === "oldest")
      return new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime();
    if (sort === "a-z") return a.prefix.localeCompare(b.prefix);
    if (sort === "z-a") return b.prefix.localeCompare(a.prefix);
    return 0;
  });

  const displayedCampaigns =
    filterCurrency === "all"
      ? sortedCampaigns
      : sortedCampaigns.filter((c) => c.currency === filterCurrency);

  const currencies = Array.from(new Set(campaigns.map((c) => c.currency)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Page Header */}
      {(loading || campaigns.length > 0) && (
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Campaigns</h1>
      )}

      {/* Filter & Sort */}
      {!loading && campaigns.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-gray-700 font-medium">
              Filter by currency:
            </label>
            <select
              id="filter"
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="all">All</option>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-700 font-medium">
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-gray-100 rounded-lg h-40 w-full animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Campaigns Grid */}
      {!loading && displayedCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedCampaigns.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg font-medium">No campaigns yet.</p>
          <p className="mt-2">Start by creating a new campaign.</p>
        </div>
      )}
    </div>
  );
}

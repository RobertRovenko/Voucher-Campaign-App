"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "../../../services/api";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [prefix, setPrefix] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCampaign({ prefix, amount, currency, validFrom, validTo });
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create Campaign</h1>
      <input
        className="border p-2 rounded w-full"
        placeholder="Prefix"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 rounded w-full"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <input
        className="border p-2 rounded w-full"
        placeholder="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <label>
        Valid From:
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={validFrom}
          onChange={(e) => setValidFrom(e.target.value)}
        />
      </label>
      <label>
        Valid To:
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={validTo}
          onChange={(e) => setValidTo(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}

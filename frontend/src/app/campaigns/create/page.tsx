"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "../../../services/api";

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD"];

export default function CreateCampaignPage() {
  const router = useRouter();

  const [prefix, setPrefix] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!prefix.trim()) newErrors.prefix = "Prefix is required";
    if (!amount || Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!currency) newErrors.currency = "Currency is required";
    if (!validFrom) newErrors.validFrom = "Start date is required";
    if (!validTo) newErrors.validTo = "End date is required";
    else if (validFrom && new Date(validTo) < new Date(validFrom))
      newErrors.validTo = "End date cannot be before start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await createCampaign({
      prefix,
      amount: Number(amount),
      currency,
      validFrom,
      validTo,
    });
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Create Campaign
        </h1>

        {/* Prefix */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Prefix</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Enter prefix"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.prefix ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.prefix && (
            <p className="text-red-500 text-sm mt-1">{errors.prefix}</p>
          )}
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min={0}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.currency ? "border-red-500" : "border-gray-300"
              }`}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
            )}
          </div>
        </div>

        {/* Validity Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Valid From</label>
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.validFrom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.validFrom && (
              <p className="text-red-500 text-sm mt-1">{errors.validFrom}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Valid To</label>
            <input
              type="date"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.validTo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.validTo && (
              <p className="text-red-500 text-sm mt-1">{errors.validTo}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
}

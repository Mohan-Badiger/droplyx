"use client";

import { useState } from "react";
import { LinkIcon, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddProductForm({ onProductAdded }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setSuccess(data.message || "Product added successfully!");
      setUrl("");
      
      if (onProductAdded) {
        onProductAdded(data.product);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Track a New Product</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Amazon, Flipkart, Meesho, or Ajio URL here..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-hidden transition-all bg-gray-50 focus:bg-white"
            required
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium h-auto flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Tracking...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Track Price
            </>
          )}
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}
      {success && <p className="mt-3 text-sm text-green-500 font-medium">{success}</p>}
    </div>
  );
}

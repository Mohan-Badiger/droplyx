"use client";

import { useState } from "react";
import { LinkIcon, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddProductForm({ onProductAdded, redirectOnSuccess }) {
  const router = useRouter();
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

      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-none p-8 shadow-sm border border-gray-100 w-full mb-10 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-none mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Track a new product</h2>
          <p className="text-gray-500 mt-1">Paste a product link from Amazon, Flipkart, Meesho or Ajio to start monitoring.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.in/dp/..."
              className="block w-full pl-14 pr-4 py-4 text-gray-900 placeholder-gray-400 bg-gray-50/50 border border-gray-200 rounded-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-hidden transition-all duration-300 font-medium"
              required
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !url}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-none font-medium h-auto flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Tracking...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Track Price</span>
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-none text-sm font-medium border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-none text-sm font-medium border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl border border-white/60 w-full mb-10 relative overflow-hidden transition-all">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-rose-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

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
              className="block w-full pl-14 pr-4 py-4 text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-orange-200 outline-none transition-all duration-300 font-medium"
              required
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !url}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium h-auto flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
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
          <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-6 p-4 bg-green-50/80 backdrop-blur-sm text-green-700 rounded-xl text-sm font-semibold border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceChart from "@/components/PriceChart";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ExternalLink, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Smart Stats
  const [lowestPrice, setLowestPrice] = useState(null);
  const [highestPrice, setHighestPrice] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [trackingCount, setTrackingCount] = useState(1);

  // Alert State
  const [targetPrice, setTargetPrice] = useState("");
  const [savingAlert, setSavingAlert] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.product);
        setHistory(data.history || []);
        setLowestPrice(data.lowestPrice);
        setHighestPrice(data.highestPrice);
        setRecommendation(data.recommendation);
        setTrackingCount(data.trackingCount || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProductDetails();
    }
  }, [id, user]);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!targetPrice) return;
    
    setSavingAlert(true);
    try {
      const res = await fetch("/api/alert/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, targetPrice: Number(targetPrice) })
      });
      if (res.ok) {
        alert("Alert saved successfully!");
        setTargetPrice("");
      } else {
        alert("Failed to save alert.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAlert(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            
            {/* Product Image */}
            <div className="flex items-center justify-center bg-slate-50/50 rounded-2xl p-8 aspect-square relative border border-slate-100/50">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="text-slate-400 font-medium">No Image Available</div>
              )}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-slate-800 shadow-sm border border-slate-200/60">
                {product.platform}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm ${trackingCount > 50 ? 'bg-orange-50 text-orange-600 border-orange-200/60' : 'bg-slate-50 text-slate-600 border-slate-200/60'}`}>
                  🔥 {trackingCount} users tracking this {trackingCount > 100 && "(Trending)"}
                </span>

                {recommendation && (
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm flex items-center gap-1 ${
                    recommendation === "BUY_NOW" ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    {recommendation === "BUY_NOW" ? "🟢 BUY NOW" : "🟡 WAIT"}
                  </span>
                )}
              </div>
              
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-orange-500 tracking-tight">
                  {formatCurrency(product.currentPrice)}
                </span>
                {product.currentPrice === lowestPrice && (
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-none">🔥 Best price ever! Buy now</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50/50 border border-slate-100/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">📉 Lowest Price</p>
                  <p className="font-bold text-xl text-slate-900">{formatCurrency(lowestPrice)}</p>
                  {product.currentPrice > lowestPrice && (
                    <p className="text-[10px] text-rose-500 mt-1 uppercase font-bold tracking-wider">
                      +{Math.round(((product.currentPrice - lowestPrice) / lowestPrice) * 100)}% above min
                    </p>
                  )}
                </div>
                <div className="bg-slate-50/50 border border-slate-100/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">📈 Highest Price</p>
                  <p className="font-bold text-xl text-slate-900">{formatCurrency(highestPrice)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                >
                  View on {product.platform}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Set alert section */}
              <div className="bg-gradient-to-br from-orange-50/80 to-rose-50/80 rounded-2xl p-6 md:p-8 border border-orange-100/50 shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600 shadow-sm border border-orange-200/50">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Price Drop Alert</h3>
                </div>
                <p className="text-sm text-slate-600 mb-5 font-medium leading-relaxed">
                  Get notified instantly when the price drops below your target. Let us watch it for you.
                </p>
                <form onSubmit={handleCreateAlert} className="flex gap-3 relative">
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Enter target price"
                    className="flex-1 rounded-xl border-white shadow-sm px-5 py-3 outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={savingAlert}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md hover:shadow-orange-500/25 px-6 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {savingAlert ? "Saving..." : "Set Alert"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100/60 p-8 md:p-12 bg-slate-50/30">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Price History Analytics</h2>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <PriceChart history={history} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

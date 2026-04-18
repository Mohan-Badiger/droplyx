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
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-none p-8 aspect-square relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-gray-400">No Image Available</div>
              )}
              <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm border border-gray-200">
                {product.platform}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-orange-500 tracking-tight">
                  {formatCurrency(product.currentPrice)}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-none font-medium transition-colors"
                >
                  View on {product.platform}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Set alert section */}
              <div className="bg-orange-50 rounded-none p-6 border border-orange-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-100 p-2 rounded-none text-orange-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">Price Drop Alert</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Get notified when the price drops below your target.
                </p>
                <form onSubmit={handleCreateAlert} className="flex gap-2">
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Enter target price"
                    className="flex-1 rounded-none border-gray-200 shadow-sm px-4 py-2 border focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-hidden"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={savingAlert}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-none"
                  >
                    {savingAlert ? "Saving..." : "Set Alert"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-8 md:p-12 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Price History</h2>
            <div className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
              <PriceChart history={history} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

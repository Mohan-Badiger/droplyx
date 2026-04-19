"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import { Loader2, Package, TrendingDown, BellRing } from "lucide-react";
import { useRouter } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [prodRes, alertRes] = await Promise.all([
          fetch("/api/product/user-products"),
          fetch("/api/alert/user"),
        ]);
        const prodData = await prodRes.json();
        const alertData = await alertRes.json();
        setProducts(prodData.products || []);
        setAlerts(alertData.alerts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleUntrack = async (productId) => {
    // Optimistic UI update
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    
    try {
      const res = await fetch("/api/product/untrack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        // Re-fetch or handle error if needed
        console.error("Failed to untrack product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const droppedPrices = products.filter(
    (p) => p.originalPrice > p.currentPrice
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.email}</h1>
          <p className="text-slate-500 mt-2 font-medium">Here is the latest on your tracked items.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Package size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Tracked Products</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{products.length}</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <TrendingDown size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Price Drops</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{droppedPrices}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center text-orange-600 border border-orange-100/50">
              <BellRing size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Alerts</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{alerts.length}</p>
            </div>
          </div>
        </div>

        {/* Add Product Section */}
        <AddProductForm onProductAdded={(newProduct) => {
          setProducts((prev) => [newProduct, ...prev]);
        }} />

        {/* Recently Tracked */}
        <div className="mb-6 flex justify-between items-end px-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Recently Tracked Items</h2>
          <a href="/wishlist" className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors">
            View all &rarr;
          </a>
        </div>

        {products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
              <Package size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No products tracked yet</h3>
            <p className="text-slate-500 font-medium">Use the form above to paste a product URL and start tracking!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} onUntrack={handleUntrack} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

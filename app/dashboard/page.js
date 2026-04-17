"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import { Loader2, Package, TrendingDown, BellRing } from "lucide-react";
import { useRouter } from "next/navigation";

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const droppedPrices = products.filter(
    (p) => p.originalPrice > p.currentPrice
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email}</h1>
          <p className="text-gray-600 mt-1">Here is the latest on your tracked items.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tracked Products</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Price Drops</p>
              <p className="text-3xl font-bold text-gray-900">{droppedPrices}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <BellRing size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        {/* Recently Tracked */}
        <div className="mb-8 flex justify-between items-end">
          <h2 className="text-xl font-bold text-gray-800">Recently Tracked Items</h2>
          <a href="/wishlist" className="text-orange-500 text-sm font-medium hover:underline">
            View all
          </a>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No products tracked yet</h3>
            <p className="text-gray-500">Go to the homepage and paste a URL to start tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

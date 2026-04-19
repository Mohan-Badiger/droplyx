"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/product/user-products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Your wishlist is empty</h3>
            <p className="text-slate-500 font-medium">Track prices from Amazon, Flipkart, Meesho, and Ajio to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onUntrack={handleUntrack} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

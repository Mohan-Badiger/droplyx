"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import AlertCard from "@/components/AlertCard";
import { Loader2, BellRing, BellOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/alert/user");
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [user]);

  const handleDelete = async (alertId) => {
    // Optimistic UI update
    setAlerts((prev) => prev.filter((a) => a._id !== alertId));

    try {
      const res = await fetch("/api/alert/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      });
      if (!res.ok) {
        console.error("Failed to delete alert");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (alertId, productId, newTargetPrice) => {
    try {
      const res = await fetch("/api/alert/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, targetPrice: Number(newTargetPrice) }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update the alert locally
        setAlerts((prev) => 
          prev.map((a) => (a._id === alertId ? { ...a, targetPrice: Number(newTargetPrice), status: data.alert.status } : a))
        );
      } else {
        alert("Failed to update alert");
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
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200/50">
            <BellRing size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Alerts</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your target prices and notifications.</p>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
              <BellOff size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No active alerts</h3>
            <p className="text-slate-500 font-medium">Go to a product from your dashboard to set a target price!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alerts.map((alert) => (
              <AlertCard 
                key={alert._id} 
                alert={alert} 
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Rabbit, Shield, ArrowRight, Sparkles } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const products = [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Droplyx extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Ambient background meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-tr from-orange-400 via-rose-300 to-indigo-400 blur-3xl rounded-full mix-blend-multiply animate-in fade-in duration-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-md shadow-sm border border-orange-100/50 text-orange-600 px-6 py-2.5 rounded-full text-sm font-bold mb-8 animate-in slide-in-from-bottom-2 duration-700 select-none">
            <span>Made with 🩷 by Mohan</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-100 leading-[1.1]">
            Never Miss A <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">Price Drop</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-semibold leading-relaxed animate-in slide-in-from-bottom-5 duration-700 delay-200">
            Track prices globally from any e-commerce site. Get instant smart alerts when prices drop. Save money effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-in slide-in-from-bottom-5 duration-700 delay-300">
            <button
              onClick={() => {
                if (user) {
                  router.push("/dashboard");
                } else {
                  openLoginModal("Please sign in to access your dashboard and track products!");
                }
              }}
              className="group relative px-8 py-4 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>Start Tracking Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  router.push("/alerts");
                } else {
                  openLoginModal("Please sign in to view and manage your price alerts!");
                }
              }}
              className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              View My Alerts
            </button>
          </div>

          {/* Supported Platforms */}
          <div className="max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-5 duration-700 delay-320">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-5">
              Supported Platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3.5 md:gap-5">
              <div className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-orange-500/30 hover:shadow-sm hover:scale-[1.02] transition-all duration-300 select-none cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse"></span>
                <span className="font-extrabold text-sm text-slate-800">Amazon.in</span>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-blue-500/30 hover:shadow-sm hover:scale-[1.02] transition-all duration-300 select-none cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#2874F0] animate-pulse"></span>
                <span className="font-extrabold text-sm text-slate-800">Flipkart</span>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-pink-500/30 hover:shadow-sm hover:scale-[1.02] transition-all duration-300 select-none cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#F43397] animate-pulse"></span>
                <span className="font-extrabold text-sm text-slate-800">Meesho</span>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-700/30 hover:shadow-sm hover:scale-[1.02] transition-all duration-300 select-none cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#2C4152] animate-pulse"></span>
                <span className="font-extrabold text-sm text-slate-800">Ajio</span>
              </div>
            </div>
          </div>

          {/* Search form */}
          <div className="max-w-2xl mx-auto mb-20 text-left animate-in slide-in-from-bottom-6 duration-700 delay-350">
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-wider px-1">
              <div className="h-px w-8 bg-slate-200"></div>
              <span>Quick track</span>
            </div>
            <AddProductForm redirectOnSuccess="/dashboard" />
          </div>

          {/* Features */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-linear-to-br from-orange-50 to-rose-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100/50 shadow-sm">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed font-semibold text-sm">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

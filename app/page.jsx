"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, ArrowRight, Sparkles, Cpu, Layers, Zap, Activity } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

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
      <section className="relative z-10 pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-md shadow-sm border border-orange-100/50 text-orange-600 px-6 py-2.5 rounded-full text-sm font-bold mb-8 animate-in slide-in-from-bottom-2 duration-700 select-none">
            <span>Made with 🩷 by Mohan</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Never Miss A <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">Price Drop</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-semibold leading-relaxed animate-in slide-in-from-bottom-5 duration-700 delay-200">
            Track prices globally from any e-commerce site. Get instant smart alerts when prices drop. Save money effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 px-4 sm:px-0 animate-in slide-in-from-bottom-5 duration-700 delay-300">
            <button
              onClick={() => {
                if (user) {
                  router.push("/dashboard");
                } else {
                  openLoginModal();
                }
              }}
              className="group relative w-full sm:w-auto justify-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>Start Tracking Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  router.push("/alerts");
                } else {
                  openLoginModal();
                }
              }}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
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
          <div className="max-w-2xl mx-auto mb-28 text-left animate-in slide-in-from-bottom-6 duration-700 delay-350">
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-wider px-1">
              <div className="h-px w-8 bg-slate-200"></div>
              <span>Quick track</span>
            </div>
            <AddProductForm redirectOnSuccess="/dashboard" />
          </div>

          {/* Mock Dashboard Preview */}
          <div className="max-w-4xl mx-auto mb-28 p-4 sm:p-6 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-12 duration-1000 delay-400 text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 via-rose-500 to-indigo-500"></div>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4 text-left w-full md:w-auto">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0">
                  <span className="text-2xl font-bold">🎧</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-[#FF9900]">Amazon</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">🟢 BUY NOW</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-base sm:text-lg mt-1 line-clamp-1">Sony WH-1000XM5 Premium Wireless Noise Cancelling Headphones</h4>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto justify-start md:justify-end text-left shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Price</p>
                  <p className="text-2xl font-extrabold text-slate-950">₹24,990</p>
                </div>
                <div className="h-10 w-px bg-slate-100 self-center"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lowest Monitored</p>
                  <p className="text-2xl font-extrabold text-green-600">₹23,490</p>
                </div>
              </div>
            </div>
            <div className="py-6 flex flex-col lg:flex-row gap-6 items-center">
              <div className="w-full lg:w-3/5 text-left bg-slate-50/50 border border-slate-100 rounded-2xl p-4 sm:p-5">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Price Fluctuation (30D)
                  </h5>
                  <span className="text-[10px] font-bold text-slate-400">Live Scraped Data</span>
                </div>
                {/* Mock Graph Visual */}
                <div className="h-32 flex items-end justify-between gap-1 pt-4 px-2">
                  <div className="w-full bg-slate-200/60 rounded-t-sm h-[80%] hover:bg-orange-400 transition-all duration-300 relative group cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹29,990</span></div>
                  <div className="w-full bg-slate-200/60 rounded-t-sm h-[75%] hover:bg-orange-400 transition-all duration-300 relative group cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹28,500</span></div>
                  <div className="w-full bg-slate-200/60 rounded-t-sm h-[90%] hover:bg-orange-400 transition-all duration-300 relative group cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹30,990</span></div>
                  <div className="w-full bg-slate-200/60 rounded-t-sm h-[60%] hover:bg-orange-400 transition-all duration-300 relative group cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹26,490</span></div>
                  <div className="w-full bg-slate-200/60 rounded-t-sm h-[65%] hover:bg-orange-400 transition-all duration-300 relative group cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹27,000</span></div>
                  <div className="w-full bg-orange-500 rounded-t-sm h-[40%] animate-pulse relative cursor-pointer"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-orange-600 text-white px-1.5 py-0.5 rounded">₹24,990</span></div>
                </div>
              </div>
              <div className="w-full lg:w-2/5 flex flex-col gap-4 text-left">
                <div className="bg-linear-to-br from-orange-50/50 to-rose-50/50 border border-orange-100/50 rounded-2xl p-5">
                  <h5 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-orange-500 animate-bounce" /> Target Alert Set
                  </h5>
                  <p className="text-xs text-slate-500 mb-3.5">Get dispatched via email immediately if price falls below:</p>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-extrabold text-slate-800 shadow-inner">
                      ₹24,000
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-100 border border-emerald-200/50 font-bold px-3 py-2 rounded-xl">Active Alert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern AI Scraper Feature Stack */}
          <div className="max-w-6xl mx-auto mb-32 text-left">
            <div className="text-center mb-16">
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Intelligence Stack</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smarter Scraping. Real-Time Insights.
              </h2>
              <p className="text-slate-500 font-semibold text-sm max-w-lg mx-auto mt-2">
                An enterprise-grade orchestration pipeline built to capture e-commerce analytics instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Scrape Pipeline */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-linear-to-br from-orange-100/80 to-rose-100/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100">
                  <Cpu className="w-5 h-5 text-orange-650 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">Anti-Bot Scrape Pipeline</h4>
                <p className="text-slate-500 leading-relaxed font-semibold text-xs">
                  Bypasses Cloudflare, custom anti-bot scripts, and cookies in real-time. Features headless browser rotation for 99.9% uptime.
                </p>
              </div>

              {/* Feature 2: Recommendation Analytics */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-linear-to-br from-blue-100/80 to-indigo-100/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                  <Layers className="w-5 h-5 text-indigo-605 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">Predictive Recommendation</h4>
                <p className="text-slate-500 leading-relaxed font-semibold text-xs">
                  Understands price trends. Dynamically flags options like wait or buy-now based on lowest historical minimum levels.
                </p>
              </div>

              {/* Feature 3: Notifications */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-linear-to-br from-emerald-100/80 to-teal-100/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                  <Zap className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">Real-Time Event Dispatch</h4>
                <p className="text-slate-500 leading-relaxed font-semibold text-xs">
                  Dispatches alerts immediately to emails, webhooks, or push notifications the second a product hits the targeted price.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow steps */}
          <div className="bg-linear-to-br from-slate-900/5 via-slate-900/2 to-transparent border-y border-slate-200/50 py-24 mb-28 text-left">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Orchestration</h3>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  How DropLyx Orchestrates Pricing
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Decorative Connecting line (desktop only) */}
                <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-orange-200 via-indigo-100 to-emerald-200 pointer-events-none -z-10"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center font-bold text-lg text-orange-600 shadow-md select-none">
                    1
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Submit Link</h4>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-65">
                    Paste any product link from Amazon, Flipkart, Meesho, or Ajio.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center font-bold text-lg text-indigo-600 shadow-md select-none">
                    2
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Automated Scrape</h4>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-65">
                    Droplyx extracts title, pricing statistics, images, and brand data.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center font-bold text-lg text-emerald-600 shadow-md select-none">
                    3
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Active Monitor</h4>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-65">
                    Set a target price and get notified instantly when the limit is breached.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Stats Counter Banner */}
          <div className="max-w-5xl mx-auto mb-20 px-4 text-left">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              {/* Aesthetic gradient glow inside stats banner */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-rose-500/10 to-indigo-500/10 pointer-events-none"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">₹42M+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Total Value Tracked</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">99.9%</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Scrape Success Rate</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">150K+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Active Smart Alerts</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">&lt; 3.2s</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Average Scrape speed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


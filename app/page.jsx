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
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid grid-fade-mask pointer-events-none z-0"></div>

      {/* Ambient background meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 opacity-30 pointer-events-none z-0">
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

          {/* Mock Dashboard Preview — Terminal-style card */}
          <div className="max-w-4xl mx-auto mb-32 bg-white border border-slate-200 rounded-lg shadow-xl relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-12 duration-1000 delay-400 text-left">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">droplyx://tracker/live</span>
              <div className="w-16"></div>
            </div>

            {/* Product header */}
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">🎧</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-[#FF9900]">Amazon</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">● BUY NOW</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">Sony WH-1000XM5 Wireless Noise Cancelling Headphones</h4>
                </div>
              </div>
              <div className="flex gap-6 w-full md:w-auto shrink-0">
                <div>
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-0.5">Current</p>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">₹24,990</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch"></div>
                <div>
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-0.5">Lowest</p>
                  <p className="text-2xl font-extrabold text-green-600 tabular-nums">₹23,490</p>
                </div>
              </div>
            </div>

            {/* Chart + Alert */}
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5">
                <div className="flex justify-between items-center mb-5">
                  <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-orange-500 animate-pulse" /> Price · 30D
                  </h5>
                  <span className="text-[9px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">LIVE</span>
                </div>
                <div className="h-28 flex items-end justify-between gap-1.5">
                  {[80, 75, 90, 60, 65, 40].map((h, i) => (
                    <div key={i} className={`w-full rounded-sm transition-all duration-300 relative group cursor-pointer ${i === 5 ? 'bg-orange-500' : 'bg-slate-200 hover:bg-slate-300'}`} style={{ height: `${h}%` }}>
                      <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${i === 5 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                        {['₹29,990', '₹28,500', '₹30,990', '₹26,490', '₹27,000', '₹24,990'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-64 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-orange-500" /> Alert Active
                  </h5>
                  <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">Email dispatch when price falls below target.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-sm font-mono font-extrabold text-slate-800">₹24,000</div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold font-mono px-2.5 py-2 rounded">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Stack */}
          <div className="max-w-6xl mx-auto mb-32 text-left px-4">
            <div className="text-center mb-14">
              <p className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-[0.2em] mb-3">// Intelligence Stack</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smarter Scraping. Real-Time Insights.
              </h2>
              <p className="text-slate-500 font-medium text-sm max-w-md mx-auto mt-3">
                An enterprise-grade orchestration pipeline built to capture e-commerce analytics instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              {/* Feature 1 */}
              <div className="bg-white p-8 hover:bg-slate-50/50 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center mb-5">
                  <Cpu className="w-4.5 h-4.5 text-orange-600" />
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">Anti-Bot Scrape Pipeline</h4>
                <p className="text-slate-500 leading-relaxed text-xs">
                  Bypasses Cloudflare, anti-bot scripts, and rotating cookies. Headless browser orchestration with 99.9% uptime guarantee.
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span>puppeteer · stealth · rotation</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 hover:bg-slate-50/50 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center mb-5">
                  <Layers className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">Predictive Recommendation</h4>
                <p className="text-slate-500 leading-relaxed text-xs">
                  Analyzes price trends over time. Dynamically flags BUY NOW or WAIT signals based on historical minimum levels.
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span>trend-analysis · signals · min-max</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 hover:bg-slate-50/50 transition-colors duration-200 group">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center mb-5">
                  <Zap className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-2">Real-Time Event Dispatch</h4>
                <p className="text-slate-500 leading-relaxed text-xs">
                  Dispatches email alerts the second a product hits the targeted price. Zero-latency notification pipeline.
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span>nodemailer · webhooks · instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orchestration Workflow */}
          <div className="border-y border-slate-200 py-24 mb-32 text-left bg-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-dense pointer-events-none"></div>
            <div className="max-w-5xl mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <p className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-[0.2em] mb-3">// Orchestration</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  How DropLyx Works
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-slate-200 pointer-events-none z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center px-6 relative z-10">
                  <div className="w-16 h-16 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-lg text-slate-900 shadow-sm">
                    01
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mt-5 mb-1.5">Submit Link</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-52">
                    Paste any product URL from Amazon, Flipkart, Meesho, or Ajio.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center px-6 relative z-10 mt-8 md:mt-0">
                  <div className="w-16 h-16 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-lg text-slate-900 shadow-sm">
                    02
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mt-5 mb-1.5">Automated Scrape</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-52">
                    DropLyx extracts title, pricing, images, and metadata automatically.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center px-6 relative z-10 mt-8 md:mt-0">
                  <div className="w-16 h-16 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-lg text-slate-900 shadow-sm">
                    03
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mt-5 mb-1.5">Active Monitor</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-52">
                    Set a target price. Get notified instantly when the price drops.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="max-w-5xl mx-auto mb-24 px-4">
            <div className="bg-slate-950 text-white rounded-lg p-8 sm:p-10 relative overflow-hidden border border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.08),transparent_50%)] pointer-events-none"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums mb-1">₹42M+</p>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Value Tracked</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums mb-1">99.9%</p>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Scrape Uptime</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums mb-1">150K+</p>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Alerts</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums mb-1">&lt;3.2s</p>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Avg Scrape</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-grid pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-linear-to-r from-transparent via-orange-400/40 to-transparent"></div>
            <div className="relative z-10 py-12 text-center">
              <p className="text-xs font-mono text-slate-400 mb-2">© 2025 DropLyx · Built by Mohan</p>
              <p className="text-[10px] font-mono text-slate-300 tracking-wider">Automated price intelligence for Indian e-commerce</p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

import AuthButton from "@/components/AuthButton";
import { Bell, Rabbit, Shield } from "lucide-react";
import Image from "next/image";
import AddProductForm from "@/components/AddProductForm";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function Home() {
  const products = null ? await getProducts() : [];

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-tr from-orange-400 via-rose-300 to-indigo-400 blur-3xl rounded-full mix-blend-multiply animate-in fade-in duration-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-sm border border-orange-100/50 text-orange-600 px-6 py-2 rounded-full text-sm font-semibold mb-8 animate-in slide-in-from-bottom-2 duration-700">
            Made with 🩷 by Mohan
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Never Miss A <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">Price Drop</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium animate-in slide-in-from-bottom-5 duration-700 delay-200">
            Track prices globally from any e-commerce site. Get instant smart alerts when prices drop. Save money effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in slide-in-from-bottom-5 duration-700 delay-300">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Sparkles className="w-5 h-5" />
              Start Tracking Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/alerts"
              className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              View My Alerts
            </Link>
          </div>

          <div className="max-w-2xl mx-auto mb-20 text-left animate-in slide-in-from-bottom-6 duration-700 delay-350">
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-semibold text-sm uppercase tracking-wider px-1">
              <div className="h-1px w-8 bg-slate-200"></div>
              Quick track
            </div>
            <AddProductForm redirectOnSuccess="/dashboard" />
          </div>

          {/* Features */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-linear-to-br from-orange-50 to-rose-50 rounded-xl flex items-center justify-center mb-6 border border-orange-100/50 shadow-sm">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

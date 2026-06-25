"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Mail, Key, Sparkles, AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function AuthModal({ isOpen, onClose, message }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      login(data.user);
      onClose();
      // Reset state for future opens
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setOtp("");
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden p-0 gap-0">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-orange-300/20 to-rose-300/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-indigo-300/10 to-orange-300/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <DialogHeader className="mb-6">
            <div className="w-14 h-14 bg-linear-to-tr from-orange-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 border border-orange-100/50 shadow-lg shadow-orange-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              {step === 1 ? "Welcome to DropLyx" : "Verify Your Email"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm font-medium">
              {step === 1
                ? "Enter your email to receive a secure login code."
                : `We've sent a 6-digit OTP code to ${email}`}
            </DialogDescription>
          </DialogHeader>

          {message && (
            <div className="mb-6 p-3.5 bg-orange-500/10 text-orange-700 border border-orange-200/50 rounded-xl text-xs font-semibold leading-relaxed flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold leading-relaxed flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12.5 pr-4 py-3.5 text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-orange-200 outline-none transition-all duration-300 font-medium text-sm"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold py-4 h-auto shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-12.5 pr-4 py-3.5 text-center text-lg tracking-widest font-bold text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-orange-200 outline-none transition-all duration-300"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold py-4 h-auto shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-900 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to email</span>
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
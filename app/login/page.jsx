"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Mail, Key, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
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
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50/50 px-4">
      <div className="bg-white border border-slate-200 shadow-xl rounded-sm w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <ShieldCheck className="w-6 h-6 text-slate-700" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {step === 1 ? "Sign in to DropLyx" : "Verify Your Email"}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {step === 1
              ? "Enter your email to receive a secure login code."
              : `We've sent a 6-digit OTP code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-55/10 text-red-700 border border-red-200/50 rounded-sm text-xs font-medium leading-relaxed flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-slate-650 transition-colors" />
              </div>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800 hover:border-slate-300 outline-none transition-all duration-150 text-sm"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-medium py-2.5 h-10 shadow-xs flex items-center justify-center gap-2 transition-colors duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-slate-400 group-focus-within:text-slate-650 transition-colors" />
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 text-center text-md tracking-wider font-semibold text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800 hover:border-slate-300 outline-none transition-all duration-150"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-medium py-2.5 h-10 shadow-xs flex items-center justify-center gap-2 transition-colors duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Login</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-slate-900 rounded-sm py-2 h-9 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100/60 transition-colors mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to email</span>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

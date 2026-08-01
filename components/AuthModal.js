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
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);
    setOtp(newOtp.join(""));

    if (value && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const prevInput = document.getElementById(`modal-otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newOtp = [...otpValues];
          newOtp[index - 1] = "";
          setOtpValues(newOtp);
          setOtp(newOtp.join(""));
        }
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpValues(digits);
      setOtp(pastedData);
      const lastInput = document.getElementById("modal-otp-5");
      if (lastInput) lastInput.focus();
    }
  };

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
        setOtpValues(["", "", "", "", "", ""]);
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden p-0 gap-0">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="absolute top-4 left-4 z-50 text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="Back to email input"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Form */}
          <div className="p-8 flex flex-col justify-center min-h-105 relative">
            <div className="mb-6 flex flex-col items-start">
              <img
                src="/Droplyx_logo.png"
                alt="DropLyx Logo"
                className="h-8 w-auto mb-6 object-contain"
              />
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                {step === 1 ? "Sign in to DropLyx" : "Verify Your Email"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm font-medium mt-1">
                {step === 1
                  ? "Verify your email to access your account."
                  : `We've sent a 6-digit OTP code to ${email}`}
              </DialogDescription>
            </div>

            {message && (
              <div className="mb-6 p-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-sm text-xs font-medium leading-relaxed flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 bg-red-55/10 text-red-700 border border-red-200/50 rounded-sm text-xs font-medium leading-relaxed flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp} className="w-full animate-in fade-in duration-300">
                <div className="relative flex items-center border border-slate-200 rounded-sm bg-white focus-within:ring-2 focus-within:ring-slate-950/10 focus-within:border-slate-800 transition-all duration-150 p-1 pl-3">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-2.5 pr-2 py-1.5 text-slate-900 placeholder-slate-400 bg-transparent outline-none text-sm"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-sm text-xs font-medium px-4 py-2 h-8 shrink-0 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer shadow-none border border-slate-900 hover:border-slate-800"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Send OTP</span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`modal-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx, otpValues)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-10 h-12 text-center text-lg font-bold border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800 outline-none transition-all duration-150 bg-slate-50/50"
                      disabled={loading}
                    />
                  ))}
                </div>
                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-medium py-2.5 h-10 shadow-xs flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
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
              </form>
            )}
          </div>

          {/* Right Column: Hero Image */}
          <div className="hidden md:block relative bg-slate-50 border-l border-slate-100 min-h-105">
            <img
              src="/droplyx_login_hero.png"
              alt="DropLyx Smart Tracking Illustration"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
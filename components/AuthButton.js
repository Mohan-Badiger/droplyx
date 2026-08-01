"use client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AuthButton() {
  const { user, loading, logout, openLoginModal } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors hidden md:block">
          Dashboard
        </Link>
        <Link href="/wishlist" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors hidden md:block">
          Wishlist
        </Link>
        <Link href="/alerts" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors hidden md:block">
          Alerts
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2 font-medium text-slate-650 hover:text-red-650 hover:bg-slate-100/60 rounded-sm px-3.5 py-1.5 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => openLoginModal()}
      variant="default"
      size="sm"
      className="bg-slate-900 hover:bg-slate-800 text-white rounded-sm px-4 py-1.5 font-medium text-sm border border-slate-900 shadow-xs transition-colors duration-150 gap-2"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </Button>
  );
}

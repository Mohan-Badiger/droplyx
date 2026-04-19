"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AuthButton() {
  const { user, loading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors hidden md:block">
          Dashboard
        </Link>
        <Link href="/wishlist" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors hidden md:block">
          Wishlist
        </Link>
        <Link href="/alerts" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors hidden md:block">
          Alerts
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="default"
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

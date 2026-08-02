"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, loading, logout, openLoginModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-250/60 shadow-xs sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
            <Image
              src="/droplyxlogo.png"
              alt="DropLyx Logo"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/wishlist" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">
              Wishlist
            </Link>
            <Link href="/alerts" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">
              Alerts
            </Link>
          </div>
        )}

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <Button variant="ghost" size="sm" disabled className="gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span>Loading...</span>
            </Button>
          ) : user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 font-medium text-slate-650 hover:text-red-650 hover:bg-slate-100/60 rounded-sm px-3.5 py-1.5 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Button
              onClick={() => openLoginModal()}
              variant="default"
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-sm px-4 py-1.5 font-medium text-sm border border-slate-900 shadow-xs transition-colors duration-150 gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>

        {/* Mobile Burger Icon */}
        <div className="flex md:hidden items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-slate-600 hover:text-orange-500 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100/55 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-250 absolute top-full left-0 w-full shadow-lg z-50">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-orange-500 transition-colors py-2.5 px-3.5 hover:bg-slate-100/40 rounded-xl"
              >
                Dashboard
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-orange-500 transition-colors py-2.5 px-3.5 hover:bg-slate-100/40 rounded-xl"
              >
                Wishlist
              </Link>
              <Link
                href="/alerts"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-orange-500 transition-colors py-2.5 px-3.5 hover:bg-slate-100/40 rounded-xl"
              >
                Alerts
              </Link>
              <hr className="border-slate-100 my-1" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 text-base font-semibold text-red-600 hover:bg-red-50/60 transition-colors py-3 px-3.5 rounded-xl w-full text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
              className="flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-4 font-bold text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-5 h-5 shrink-0" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}


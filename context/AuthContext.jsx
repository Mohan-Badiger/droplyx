"use client";

import { createContext, useContext, useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const openLoginModal = (message = "") => {
    setLoginModalMessage(message);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setLoginModalMessage("");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, openLoginModal, closeLoginModal }}>
      {children}
      <AuthModal
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
        message={loginModalMessage}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

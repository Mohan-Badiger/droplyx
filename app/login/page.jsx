"use client";
// import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Droplyx</h1>
        <p className="mb-6 text-gray-500">Track prices & get alerts</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-2 hover:bg-gray-100"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6 bg-white rounded-2xl border border-[#E8E2DC] shadow-lg max-w-md w-full">
        <p className="text-sm text-[#B83232] font-semibold mb-3">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-[#C2446E] text-xs underline font-semibold">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#E8E2DC] shadow-lg">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#C2446E] flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
            Pinorpinor
          </span>
        </Link>
        <h1 className="text-xl font-semibold text-[#1A1714]">Reset Your Password</h1>
        <p className="text-xs text-[#9C948C] mt-1">Enter your new password below</p>
      </div>

      {success ? (
        <div className="p-4 rounded-xl bg-[#D4EDDA] border border-[#A8D5B8] text-xs text-[#2D7A4F] text-center space-y-2">
          <CheckCircle className="w-6 h-6 mx-auto text-[#2D7A4F]" />
          <p className="font-semibold">Password Reset Successful!</p>
          <p>Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FFE8E8] border border-[#F8BFC0] text-xs text-[#B83232]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] focus:border-[#C2446E] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] focus:border-[#C2446E] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
            ) : (
              <>Reset Password <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-[#9C948C] text-xs">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

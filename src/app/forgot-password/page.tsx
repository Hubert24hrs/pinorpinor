"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
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
          <h1 className="text-xl font-semibold text-[#1A1714]">Forgot Password</h1>
          <p className="text-xs text-[#9C948C] mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-[#D4EDDA] border border-[#A8D5B8] text-xs text-[#2D7A4F] text-center space-y-2">
            <CheckCircle className="w-6 h-6 mx-auto text-[#2D7A4F]" />
            <p className="font-semibold">Reset Link Sent!</p>
            <p>If an account exists with {email}, you will receive a reset link shortly.</p>
            <div className="pt-2">
              <Link href="/login" className="text-[#C2446E] font-semibold hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FFE8E8] border border-[#F8BFC0] text-xs text-[#B83232]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending link...</>
              ) : (
                <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Mail, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams?.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#E8E2DC] shadow-lg">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#C2446E] flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
            Pinorpinor
          </span>
        </Link>
        <h1 className="text-xl font-semibold text-[#1A1714]">Welcome back</h1>
        <p className="text-xs text-[#9C948C] mt-1">Sign in to your account</p>
      </div>

      {justRegistered && (
        <div className="mb-5 p-3 rounded-xl bg-[#D4EDDA] border border-[#A8D5B8] text-xs text-[#2D7A4F] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Account created! Sign in to continue.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[#FFE8E8] border border-[#F8BFC0] text-xs text-[#B83232]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#5C5450] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5C5450] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-[#9C948C] cursor-pointer">
            <input type="checkbox" className="rounded accent-[#C2446E]" />
            Remember me
          </label>
          <Link href="#" className="text-[#C2446E] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#9C948C] mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#C2446E] font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-[#9C948C] text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

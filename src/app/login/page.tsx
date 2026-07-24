"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Flame, Mail, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
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

      router.push("/discover");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">

      {/* Header Badge */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] flex items-center justify-center text-white shadow-lg shadow-[#FF4458]/30">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-white tracking-tight">
            pinor<span className="text-[#FF4458]">pinor</span>
          </span>
        </Link>
        <p className="text-xs text-[#A1A1AA]">Welcome back! Sign in to view your matches</p>
      </div>

      {/* Card */}
      <div className="p-6 rounded-3xl bg-[#141419] border border-white/10 shadow-2xl space-y-5">

        {justRegistered && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Account created! Please sign in with your credentials.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A1A1AA]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#A1A1AA]">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-[#FF4458] hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-3 text-xs font-bold flex items-center justify-center gap-2 pt-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-[#A1A1AA]">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#FF4458] hover:text-[#FF6B4A]">
              Join Free (18+)
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-[#A1A1AA] py-12">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Poppins',sans-serif] font-bold text-2xl text-white">
              Pinor<span className="gradient-text">pinor</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="text-xs text-[#a1a1aa] mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#16131f] border-white/10 text-white"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#16131f] border-white/10 text-white"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#a1a1aa] cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#e91e8c]" />
              Remember me
            </label>
            <Link href="#" className="text-[#e91e8c] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#a1a1aa] mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#e91e8c] font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

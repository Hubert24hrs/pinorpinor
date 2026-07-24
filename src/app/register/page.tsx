"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, MapPin, Heart, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"LADY" | "GUY">("LADY");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl relative">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Poppins',sans-serif] font-bold text-2xl text-white">
              Pinor<span className="gradient-text">pinor</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Join Pinorpinor</h1>
          <p className="text-xs text-[#a1a1aa] mt-1">Select your account type to get started</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("LADY")}
            className={`p-3 rounded-2xl border text-center transition-all ${
              role === "LADY"
                ? "border-[#e91e8c] bg-[#e91e8c]/10 text-white font-semibold shadow-lg shadow-pink-500/10"
                : "border-white/10 bg-[#16131f] text-[#a1a1aa] hover:border-white/20"
            }`}
          >
            <span className="text-lg block mb-1">💃</span>
            <span className="text-xs block">I'm a Lady</span>
            <span className="text-[10px] text-[#71717a] block">Showcase myself</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("GUY")}
            className={`p-3 rounded-2xl border text-center transition-all ${
              role === "GUY"
                ? "border-[#7c3aed] bg-[#7c3aed]/10 text-white font-semibold shadow-lg shadow-purple-500/10"
                : "border-white/10 bg-[#16131f] text-[#a1a1aa] hover:border-white/20"
            }`}
          >
            <span className="text-lg block mb-1">🕺</span>
            <span className="text-xs block">I'm a Guy</span>
            <span className="text-[10px] text-[#71717a] block">Looking for dates</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name / Display Name"
            type="text"
            placeholder={role === "LADY" ? "e.g. Baby-Gold" : "e.g. Alex"}
            leftIcon={<User className="w-4 h-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-[#16131f] border-white/10 text-white"
          />

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

          <button type="submit" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#a1a1aa] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#e91e8c] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

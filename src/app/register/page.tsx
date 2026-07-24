"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, Mail, Lock, User, ArrowRight, Loader2, Calendar, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"MAN" | "WOMAN">("WOMAN");
  const [interestedIn, setInterestedIn] = useState<"MAN" | "WOMAN">("MAN");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side 18+ check
  const validateAge = (dobString: string): boolean => {
    if (!dobString) return false;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAge(birthDate)) {
      setError("You must be at least 18 years old to join Pinorpinor.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email,
          password,
          gender,
          interestedIn,
          birthDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Redirect to login or profile onboarding
      router.push("/login?registered=true");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">

      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#FF4458]/30">
          <Flame className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Your Account</h1>
        <p className="text-xs text-[#A1A1AA]">Join thousands of verified singles today</p>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-3xl bg-[#141419] border border-white/10 shadow-2xl space-y-5">

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* I am a ... */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">I am a:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender("WOMAN")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  gender === "WOMAN"
                    ? "bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] text-white border-transparent shadow-md"
                    : "bg-[#0C0C0F] text-[#A1A1AA] border-white/10 hover:text-white"
                }`}
              >
                Woman
              </button>
              <button
                type="button"
                onClick={() => setGender("MAN")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  gender === "MAN"
                    ? "bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] text-white border-transparent shadow-md"
                    : "bg-[#0C0C0F] text-[#A1A1AA] border-white/10 hover:text-white"
                }`}
              >
                Man
              </button>
            </div>
          </div>

          {/* Looking to meet ... */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">Looking to meet:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInterestedIn("MAN")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  interestedIn === "MAN"
                    ? "bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] text-white border-transparent shadow-md"
                    : "bg-[#0C0C0F] text-[#A1A1AA] border-white/10 hover:text-white"
                }`}
              >
                Men
              </button>
              <button
                type="button"
                onClick={() => setInterestedIn("WOMAN")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  interestedIn === "WOMAN"
                    ? "bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] text-white border-transparent shadow-md"
                    : "bg-[#0C0C0F] text-[#A1A1AA] border-white/10 hover:text-white"
                }`}
              >
                Women
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A1A1AA]">First Name / Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Sophia"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A1A1AA]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="sophia@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Date of Birth (18+ Gated) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#A1A1AA]">Date of Birth</label>
              <span className="text-[10px] font-bold text-emerald-400">Must be 18+</span>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A1A1AA]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0C0C0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#71717A] focus:border-[#FF4458] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Terms callout */}
          <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>By signing up, you confirm you are at least 18 years of age.</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-3 text-xs font-bold flex items-center justify-center gap-2 pt-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-[#A1A1AA]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#FF4458] hover:text-[#FF6B4A]">
              Sign In
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

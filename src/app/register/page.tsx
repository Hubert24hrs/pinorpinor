"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame, Mail, Lock, User, ArrowRight, Loader2,
  Calendar, ShieldCheck, Eye, EyeOff, MapPin
} from "lucide-react";

const NIGERIAN_CITIES = [
  "Lagos (Victoria Island)", "Lagos (Lekki Phase 1)", "Lagos (Ikeja)", "Abuja (Maitama)",
  "Abuja (Asokoro)", "Port Harcourt (GRA)", "Ibadan", "Enugu", "Benin City",
];

export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"MAN" | "WOMAN">("WOMAN");
  const [interestedIn, setInterestedIn] = useState<"MAN" | "WOMAN">("MAN");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAge = (dobString: string): boolean => {
    if (!dobString) return false;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
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
        body: JSON.stringify({ displayName, email, password, gender, interestedIn, birthDate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      router.push("/login?registered=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/30 group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-gray-900 tracking-tight">
              pinor<span className="text-[#2563EB]">pinor</span>
            </span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Your Free Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join thousands of verified Nigerian singles</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm space-y-5">

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Gender Row */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">I am a:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["WOMAN", "MAN"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      gender === g
                        ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border-transparent shadow-md shadow-[#2563EB]/20"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {g === "WOMAN" ? "👩 Woman" : "👨 Man"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interested In Row */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Looking to meet:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["MAN", "WOMAN"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setInterestedIn(g)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      interestedIn === g
                        ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border-transparent shadow-md shadow-[#2563EB]/20"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {g === "MAN" ? "👨 Men" : "👩 Women"}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">First Name / Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab, Tunde, Chioma"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* City Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Your Nigerian City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select your city...</option>
                  {NIGERIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Date of Birth</label>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Must be 18+
                </span>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <span>
                By creating an account, you confirm you are at least 18 years old and agree to our{" "}
                <Link href="/terms" className="text-[#2563EB] font-semibold hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#2563EB] font-semibold hover:underline">Privacy Policy</Link>.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Create My Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-semibold">
          <span>🔒 Secure & Private</span>
          <span>•</span>
          <span>✅ 18+ Age Gated</span>
          <span>•</span>
          <span>🇳🇬 Nigerian Verified</span>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, User, ArrowRight, Loader2, Calendar } from "lucide-react";

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
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#C2446E] flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
              Pinorpinor
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-[#1A1714]">Create Your Account</h1>
          <p className="text-xs text-[#9C948C] mt-1">Join to discover matches and arrange dates</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFE8E8] border border-[#F8BFC0] text-xs text-[#B83232]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGender("WOMAN");
                  setInterestedIn("MAN");
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gender === "WOMAN"
                    ? "border-[#C2446E] bg-[#FFF0F4] text-[#C2446E]"
                    : "border-[#E8E2DC] bg-[#FAF8F5] text-[#5C5450] hover:border-[#D4CCC4]"
                }`}
              >
                <span>💃 Woman</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender("MAN");
                  setInterestedIn("WOMAN");
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gender === "MAN"
                    ? "border-[#C2446E] bg-[#FFF0F4] text-[#C2446E]"
                    : "border-[#E8E2DC] bg-[#FAF8F5] text-[#5C5450] hover:border-[#D4CCC4]"
                }`}
              >
                <span>🕺 Man</span>
              </button>
            </div>
          </div>

          {/* Interested In Selector */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Looking to meet</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInterestedIn("MAN")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                  interestedIn === "MAN"
                    ? "border-[#C2446E] bg-[#FFF0F4] text-[#C2446E]"
                    : "border-[#E8E2DC] bg-[#FAF8F5] text-[#5C5450]"
                }`}
              >
                Men
              </button>
              <button
                type="button"
                onClick={() => setInterestedIn("WOMAN")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                  interestedIn === "WOMAN"
                    ? "border-[#C2446E] bg-[#FFF0F4] text-[#C2446E]"
                    : "border-[#E8E2DC] bg-[#FAF8F5] text-[#5C5450]"
                }`}
              >
                Women
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="text"
                placeholder="e.g. Sarah"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                minLength={2}
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Date of Birth (Age Gate) */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">
              Date of Birth <span className="text-[#9C948C] font-normal">(Must be 18+)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              <>Create Free Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#9C948C] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C2446E] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

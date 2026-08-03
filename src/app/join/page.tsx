"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame, ShieldCheck, Mail, Lock, User, Calendar, MapPin,
  ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Sparkles
} from "lucide-react";

export default function JoinPage() {
  const router = useRouter();

  // Multi-step state (1..6)
  const [step, setStep] = useState(1);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender] = useState<"WOMAN">("WOMAN");
  const [city, setCity] = useState("Lagos");
  const [country, setCountry] = useState("Nigeria");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [selectedDateTypes, setSelectedDateTypes] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mediaOwnershipConfirmed, setMediaOwnershipConfirmed] = useState(false);

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

  const DATE_TYPE_OPTIONS = [
    "Dinner Dates",
    "VIP Events",
    "Weekend Getaways",
    "Live Jazz & Music",
    "Coffee & Walk",
    "Art Galleries",
    "Rooftop Cocktails",
    "Travel Companion",
  ];

  const toggleDateType = (type: string) => {
    setSelectedDateTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!termsAccepted) {
        setError("You must accept the Terms of Service to proceed.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateAge(birthDate)) {
        setError("You must be at least 18 years old to join Pinorpinor.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!displayName || !username) {
        setError("Display name and username are required.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      if (!mediaOwnershipConfirmed) {
        setError("You must confirm media ownership and community guidelines.");
        return;
      }
      setStep(6);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/member/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName,
          username,
          birthDate,
          gender: "WOMAN",
          city,
          country,
          tagline,
          bio,
          dateTypes: selectedDateTypes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit profile for moderation");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] flex items-center justify-center text-white shadow-md">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif-display font-bold text-2xl text-stone-900">
            pinor<span className="text-[#C2446E]">pinor</span>
          </span>
        </Link>
        <h1 className="font-serif-display text-2xl font-bold text-stone-900">
          Join as a Woman Member
        </h1>
        <p className="text-xs text-stone-500">
          Step {step} of 6 — {["Account", "Eligibility", "Profile Details", "Media Instructions", "Verification", "Review & Submit"][step - 1]}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-[#C2446E] to-[#7C1D38] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] bg-white shadow-sm space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: Account Credentials ──────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Create Account Credentials</h2>
              <p className="text-xs text-stone-500">Enter your email and a secure password.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-stone-600">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-[#C2446E] cursor-pointer"
              />
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the <Link href="/terms" className="text-[#C2446E] font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-[#C2446E] font-bold">Privacy Policy</Link>.
              </label>
            </div>

            <button type="submit" className="gradient-btn w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-4">
              <span>Continue to Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── STEP 2: Adult Eligibility & DOB ───────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Age &amp; Eligibility Verification</h2>
              <p className="text-xs text-stone-500">Only adult women aged 18 or older may join Pinorpinor.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FDF2F5] border border-[#FBCFE8] flex items-center gap-2 text-xs text-[#9B2646] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#C2446E]" />
              <span>Gender Eligibility: Woman</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Date of Birth (18+ Required)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
              <p className="text-[11px] text-stone-400">Your full birth date is never displayed publicly.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-3 py-3 text-xs text-stone-900 outline-none"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Ibadan">Ibadan</option>
                  <option value="Enugu">Enugu</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-3 py-3 text-xs text-stone-900 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button type="submit" className="gradient-btn flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <span>Continue to Profile Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Profile Information ──────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Profile Information</h2>
              <p className="text-xs text-stone-500">Tell potential meetup matches about yourself.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Display Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Zainab, Chioma"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Unique Username</label>
              <input
                type="text"
                required
                placeholder="e.g. zainab_lagos"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Tagline / Headline</label>
              <input
                type="text"
                placeholder="e.g. Fashion lead in VI • Live jazz & rooftop cocktails"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Bio / About Me</label>
              <textarea
                rows={3}
                placeholder="Share your interests, career, and favorite date spots."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-[#C2446E] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">Preferred Date Activities</label>
              <div className="flex flex-wrap gap-2">
                {DATE_TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleDateType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      selectedDateTypes.includes(t)
                        ? "bg-[#C2446E] text-white border-[#C2446E]"
                        : "bg-[#FAF8F5] text-stone-700 border-[#E7E3DC]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button type="submit" className="gradient-btn flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <span>Next: Media Guidelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 4: Media Instructions ────────────────────────────── */}
        {step === 4 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Media Upload Guidelines</h2>
              <p className="text-xs text-stone-500">You can manage and upload your profile photos &amp; videos in your member dashboard after creating your account.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
              <h4 className="font-bold text-stone-900">Media Guidelines:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>All photos and videos must belong to you or have documented permission.</li>
                <li>Photos must be high quality and clearly feature your face.</li>
                <li>Explicit, non-consensual, or illegal content is strictly banned.</li>
                <li>Every photo and video is independently reviewed by human moderation before going public.</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-3 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button type="submit" className="gradient-btn flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <span>Next: Verification Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 5: Verification Consent ──────────────────────────── */}
        {step === 5 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Safety &amp; Community Rules</h2>
              <p className="text-xs text-stone-500">Confirm community commitments before final profile submission.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] text-xs text-stone-700">
                <input
                  type="checkbox"
                  id="mediaConsent"
                  checked={mediaOwnershipConfirmed}
                  onChange={(e) => setMediaOwnershipConfirmed(e.target.checked)}
                  className="mt-0.5 accent-[#C2446E] cursor-pointer"
                />
                <label htmlFor="mediaConsent" className="cursor-pointer font-medium leading-relaxed">
                  I confirm that I am an adult woman (18+), that all information provided is accurate, and that I own all content uploaded to my profile.
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-3 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button type="submit" className="gradient-btn flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <span>Preview &amp; Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 6: Final Review & Submit ─────────────────────────── */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="font-serif-display text-lg font-bold text-stone-900">Review &amp; Submit Profile</h2>
              <p className="text-xs text-stone-500">Review your profile details before submitting for moderation.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] space-y-2 text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-500">Name / Username:</span>
                <span className="font-bold text-stone-900">{displayName} (@{username})</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-500">Location:</span>
                <span className="font-bold text-stone-900">{city}, {country}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Status:</span>
                <span className="font-bold text-[#C2446E]">PENDING MODERATION REVIEW</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-4 py-3 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="gradient-btn flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Profile for Moderation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

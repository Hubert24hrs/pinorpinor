import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, AlertTriangle, UserCheck, Heart, FileText, CheckCircle2 } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4E7B3]">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Trust &amp; Safety Guidelines</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-white">
          Pinorpinor Safety Centre
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
          Your security, dignity, and privacy are our top priorities. Learn about our profile moderation policies, age restrictions, and safe meetup best practices.
        </p>
      </div>

      {/* 4 Pillars of Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E7E3DC] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-serif-display font-bold text-lg text-stone-900">18+ Server Age Enforcement</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All profile submissions require verified date-of-birth validation. Minors are strictly prohibited from creating or appearing in profiles on Pinorpinor.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E3DC] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#C2446E] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-serif-display font-bold text-lg text-stone-900">Human Profile Moderation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every submitted photo, video, and profile bio is independently reviewed by human moderators before publication. Unapproved media is never displayed.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E3DC] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-serif-display font-bold text-lg text-stone-900">Location Privacy Protection</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Public profiles display general city or regional location only. Precise home addresses, real-time GPS tracking, and phone numbers are never published.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E3DC] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="font-serif-display font-bold text-lg text-stone-900">Zero Commercial Exploitation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pinorpinor is a social discovery platform. Prostitution, commercial sexual services, coercion, human trafficking, and illegal services are strictly forbidden.
          </p>
        </div>
      </div>

      {/* Safe First-Meeting Guidance */}
      <div className="p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-6">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Safe First-Meeting Guidance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900">Meet in Public Venues</strong>
              <span>Always schedule first meetups at busy, well-lit public places like restaurants, cafes, or public lounge venues.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900">Inform a Trusted Person</strong>
              <span>Share your date details, location, and expected return time with a friend or family member before heading out.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900">Arrange Independent Transit</strong>
              <span>Drive yourself or use reputable ride-hailing services. Never rely solely on a first-time meetup partner for transportation.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900">Never Send Financial Credentials</strong>
              <span>Do not send money, banking details, or financial wire transfers to anyone you meet online.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Section */}
      <div id="report" className="p-8 rounded-3xl bg-[#141216] text-white space-y-4 border border-stone-800">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Report Abuse or Safety Violations</span>
        </div>
        <h2 className="font-serif-display text-2xl font-bold text-white">
          Reporting &amp; Emergency Assistance
        </h2>
        <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
          If you encounter fake profiles, stolen media, underage concerns, harassment, or non-consensual behavior, please report the account immediately.
          For immediate physical danger, contact local law enforcement services in your jurisdiction.
        </p>
        <Link href="/contact">
          <button className="gold-btn px-6 py-3 text-xs font-bold cursor-pointer">
            Submit a Safety Report
          </button>
        </Link>
      </div>
    </div>
  );
}

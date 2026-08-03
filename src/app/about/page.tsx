import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, MapPin, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4E7B3]">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>About Pinorpinor</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-white">
          Our Vision &amp; Platform Mission
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
          Pinorpinor is an original, premium social discovery and meetup platform created to celebrate authentic profile presentation and high-quality local connections.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Redefining Social Discovery
        </h2>
        <p>
          Unlike generic swipe applications that lock all content behind sign-in walls, Pinorpinor offers open public profile discovery for approved adult women.
          Visitors can browse public profile photos, short profile videos, interests, and preferred date activities before choosing to connect.
        </p>

        <h3 className="font-serif-display text-lg font-bold text-stone-900 pt-2">
          Key Platform Pillars
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-stone-600">
          <li><strong>Women-Focused Profile Submission:</strong> Adult women (18+) create and manage public profiles on their own terms.</li>
          <li><strong>Human Content Moderation:</strong> All uploaded photos and videos are independently verified for quality and compliance.</li>
          <li><strong>Privacy First:</strong> Location tracking is restricted to general cities. Contact information remains platform-controlled.</li>
          <li><strong>Strict 18+ Verification:</strong> Mandatory server-side date of birth validation to keep minors safe.</li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="p-12 text-center rounded-3xl bg-white border border-[#E7E3DC] shadow-sm max-w-xl mx-auto space-y-5 my-12">
      <div className="w-16 h-16 rounded-2xl bg-[#FDF2F5] border border-[#FBCFE8] flex items-center justify-center text-[#C2446E] mx-auto shadow-xs">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif-display text-2xl font-bold text-stone-900">404 — Page Not Found</h1>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          The page or profile you requested could not be found or is no longer active.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/discover">
          <button className="gradient-btn px-6 py-2.5 text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discovery Deck</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

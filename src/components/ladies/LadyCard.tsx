"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, CheckCircle } from "lucide-react";

export interface Lady {
  id: string;
  name: string;
  username: string;
  image: string;
  location: string;
  city: string;
  country: string;
  tagline: string;
  isRedHot?: boolean;
  isAvailableToday?: boolean;
  isVerified?: boolean;
  isLiveNow?: boolean;
}

export function LadyCard({ lady }: { lady: Lady }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden relative group flex flex-col border border-white/7 hover:border-[#e91e8c]/40 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/60">
        <Image
          src={lady.image}
          alt={lady.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Red Hot Badge */}
        {lady.isRedHot && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="badge-hot shadow-lg shadow-red-500/30">
              Red 🔥 Hot
            </span>
          </div>
        )}

        {/* Available Today Badge */}
        {lady.isAvailableToday && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="badge-available shadow-md">
              Available Today
            </span>
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#16131f]">
        <div>
          {/* Name & Verification Checkmark */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <Link
              href={`/${lady.username}`}
              className="font-['Poppins',sans-serif] font-bold text-sm text-white hover:text-[#e91e8c] transition-colors truncate"
            >
              {lady.name}
            </Link>
            {lady.isVerified && (
              <span title="Verified Lady Profile">
                <CheckCircle className="w-4 h-4 text-[#22c55e] fill-[#22c55e]/20 flex-shrink-0" />
              </span>
            )}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="text-[#71717a] hover:text-[#e91e8c] transition-colors ml-auto p-1"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#e91e8c] text-[#e91e8c]" : ""}`} />
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-[#a1a1aa] mb-1.5 font-medium">
            <MapPin className="w-3 h-3 text-[#e91e8c] flex-shrink-0" />
            <span className="truncate">{lady.location}</span>
          </div>

          {/* Tagline / Bio snippet */}
          <p className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">
            {lady.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, MapPin, CheckCircle, Sparkles, Flame, Filter } from "lucide-react";
import { LadyCard, Lady } from "@/components/ladies/LadyCard";
import { LiveStreamersStrip } from "@/components/ladies/LiveStreamersStrip";

// ── Demo Lady Profiles ─────────────────────────────────────────
const DEMO_LADIES: Lady[] = [
  {
    id: "1",
    name: "Baby-Gold",
    username: "babygold",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    location: "Ikeja, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    tagline: "Beauty may catch your eye, but personality keeps you here. ✨",
    isRedHot: true,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "2",
    name: "Maniya",
    username: "maniya",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    location: "Asokoro, Abuja, Nigeria",
    city: "Abuja",
    country: "Nigeria",
    tagline: "Classy & adventurous. Ready for dinner dates and weekend getaways.",
    isRedHot: true,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "3",
    name: "Hotie",
    username: "hotie",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    location: "Mainland, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    tagline: "Looking for a gentleman for fine dining and romantic dates.",
    isRedHot: true,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "4",
    name: "Sweet Sensation",
    username: "sweetsensation",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop",
    location: "Lekki, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    tagline: "Charming companion. Enough strength to leave you breathless.",
    isRedHot: true,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "5",
    name: "Dollminaj",
    username: "dollminaj",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
    location: "Lekki, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    tagline: "Looking for a Peng, Naughty, extra-curvy, Real life Doll! 💅",
    isRedHot: true,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "6",
    name: "Queen Bella",
    username: "queenbella",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop",
    location: "Victoria Island, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    tagline: "Classy, elegant, and ready for spontaneous luxury dates.",
    isRedHot: false,
    isAvailableToday: true,
    isVerified: true,
  },
  {
    id: "7",
    name: "Princess Chi",
    username: "princesschi",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    location: "Port Harcourt, Rivers, Nigeria",
    city: "Port Harcourt",
    country: "Nigeria",
    tagline: "Life is short, let's make unforgettable memories together.",
    isRedHot: true,
    isAvailableToday: false,
    isVerified: true,
  },
  {
    id: "8",
    name: "Amara Vibe",
    username: "amaravibe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    location: "Maitama, Abuja, Nigeria",
    city: "Abuja",
    country: "Nigeria",
    tagline: "Charming companion for business dinners and VIP events.",
    isRedHot: false,
    isAvailableToday: true,
    isVerified: true,
  },
];

const LIVE_STREAMERS = [
  { id: "1", name: "Baby-Gold", username: "babygold", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop" },
  { id: "2", name: "Maniya", username: "maniya", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
  { id: "3", name: "Hotie", username: "hotie", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
  { id: "4", name: "Sweet Sensation", username: "sweetsensation", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop" },
  { id: "5", name: "Dollminaj", username: "dollminaj", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop" },
];

const LOCATIONS = ["All Locations", "Lagos", "Abuja", "Port Harcourt", "Ibiza", "Dubai"];

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredLadies = DEMO_LADIES.filter(
    (lady) => selectedLocation === "All Locations" || lady.city === selectedLocation
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden glass border border-white/10 p-6 sm:p-8 hero-gradient">
        <div className="max-w-xl">
          <span className="badge-hot mb-3 inline-flex items-center gap-1">
            🔥 #1 Dating & Companionship Platform
          </span>
          <h1 className="font-['Poppins',sans-serif] font-extrabold text-2xl sm:text-4xl text-white mb-3 leading-tight">
            Meet Verified Ladies for <span className="gradient-text">Dates & Events</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#a1a1aa] mb-6 leading-relaxed">
            Browse verified profiles of ladies available in your city. Connect for dinner dates, VIP events, travel companions, and private meetups.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/register">
              <button className="btn-primary text-xs py-2.5 px-5">
                Showcase Yourself (For Ladies)
              </button>
            </Link>
            <Link href="/browse">
              <button className="btn-outline text-xs py-2.5 px-5">
                Browse All Ladies
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Streamers Strip */}
      <LiveStreamersStrip streamers={LIVE_STREAMERS} />

      {/* Client Safety Notice Bar */}
      <div className="p-3.5 rounded-xl bg-[#16131f] border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Client Safety Notice:</span>
          <span className="text-[#a1a1aa] font-normal hidden sm:inline">
            To protect all users and ensure trusted experiences, always verify profiles before booking dates.
          </span>
        </div>
        <Link href="#" className="text-[#e91e8c] font-semibold hover:underline flex-shrink-0">
          Learn More
        </Link>
      </div>

      {/* Location Filter Bar */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-white/7">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLocation === loc
                  ? "bg-gradient-to-r from-[#e91e8c] to-[#7c3aed] text-white shadow-md shadow-pink-500/20"
                  : "bg-[#16131f] text-[#a1a1aa] hover:text-white border border-white/7"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#71717a] hidden sm:block whitespace-nowrap">
          Showing <strong className="text-white">{filteredLadies.length}</strong> available ladies
        </span>
      </div>

      {/* Featured / Hot Lady Grid (4-column grid matching codedruns.com) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLadies.map((lady) => (
          <LadyCard key={lady.id} lady={lady} />
        ))}
      </div>
    </div>
  );
}

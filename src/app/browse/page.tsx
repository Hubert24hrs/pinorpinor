"use client";

import React, { useState } from "react";
import { Search, Filter, MapPin, Sparkles } from "lucide-react";
import { LadyCard, Lady } from "@/components/ladies/LadyCard";

const ALL_LADIES: Lady[] = [
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
];

export default function BrowsePage() {
  const [search, setSearch] = useState("");

  const filtered = ALL_LADIES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Poppins',sans-serif] font-bold text-2xl text-white mb-1">
          Browse <span className="gradient-text">Ladies</span>
        </h1>
        <p className="text-xs text-[#a1a1aa]">
          Find verified ladies near you for dating and companionship.
        </p>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search by name, city, area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#16131f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:border-[#e91e8c] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((lady) => (
          <LadyCard key={lady.id} lady={lady} />
        ))}
      </div>
    </div>
  );
}

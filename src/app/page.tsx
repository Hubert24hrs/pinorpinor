"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame, Sparkles, MapPin, Heart, ShieldCheck,
  ChevronRight, Filter, Search, UserCheck, MessageSquare, Lock
} from "lucide-react";

interface ProfileFromAPI {
  id: string;
  username: string;
  displayName: string;
  gender: string;
  datingProfile: {
    tagline: string | null;
    city: string | null;
    country: string | null;
    location: string | null;
    isAvailableToday: boolean;
    dateTypes: string[];
  } | null;
  media: { storageUrl: string }[];
}

const FEATURED_PROFILES: ProfileFromAPI[] = [
  {
    id: "1",
    username: "sophia_m",
    displayName: "Sophia, 24",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Love wine tasting & rooftop dinners. Looking for real dates.",
      city: "New York",
      country: "USA",
      location: "New York, USA",
      isAvailableToday: true,
      dateTypes: ["Dinner & Drinks", "Rooftop Party", "Fine Dining"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "2",
    username: "elena_r",
    displayName: "Elena, 26",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Fashion designer & art gallery enthusiast. Let's get coffee!",
      city: "London",
      country: "UK",
      location: "London, UK",
      isAvailableToday: true,
      dateTypes: ["Coffee & Walk", "Art Gallery", "Dinner"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "3",
    username: "isabella_v",
    displayName: "Isabella, 25",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Architect. Passionate about live jazz, travel & good cocktails.",
      city: "Paris",
      country: "France",
      location: "Paris, France",
      isAvailableToday: false,
      dateTypes: ["Cocktails & Jazz", "VIP Event", "Travel Companion"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "4",
    username: "marcus_k",
    displayName: "Marcus, 28",
    gender: "MAN",
    datingProfile: {
      tagline: "Tech founder. Enjoy deep conversations & fine dining.",
      city: "San Francisco",
      country: "USA",
      location: "San Francisco, USA",
      isAvailableToday: true,
      dateTypes: ["Fine Dining", "Cocktails", "Weekend Gateway"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    ],
  },
];

export default function HomePage() {
  const [profiles, setProfiles] = useState<ProfileFromAPI[]>(FEATURED_PROFILES);
  const [selectedGender, setSelectedGender] = useState<"ALL" | "WOMAN" | "MAN">("ALL");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/discover")
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      })
      .catch(() => {
        // Fallback to static sample profiles if API returns empty
      });
  }, []);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProfiles = profiles.filter((p) => {
    if (selectedGender === "ALL") return true;
    return p.gender === selectedGender;
  });

  return (
    <div className="space-y-10">

      {/* ── Hero Banner (US/European High-End Style) ───────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1C24] via-[#141419] to-[#0C0C0F] p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#FF4458]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-[#FF6B4A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4458]/15 border border-[#FF4458]/30 text-xs font-bold text-[#FF6B7A]">
            <Sparkles className="w-4 h-4 text-[#FF4458]" />
            <span>Premium Verified Dating</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Designed to be <span className="gradient-text">Deleted</span>. Meet Real Matches Near You.
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            Discover verified singles, arrange genuine date nights, rooftop cocktails, fine dining, and VIP meetups with zero ghosting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/discover">
              <button className="gradient-btn px-6 py-3 text-sm flex items-center gap-2">
                <span>Start Swiping &amp; Match</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all">
                Create 18+ Profile
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Filter Bar ───────────────────────────────────────── */}
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141419] border border-white/10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF4458]" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Show Me:</span>
          <div className="flex items-center gap-1.5 bg-[#0C0C0F] p-1 rounded-full border border-white/10">
            {(["ALL", "WOMAN", "MAN"] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedGender === gender
                    ? "bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] text-white shadow-md"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                {gender === "ALL" ? "All Singles" : gender === "WOMAN" ? "Women" : "Men"}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/discover"
          className="text-xs font-bold text-[#FF4458] hover:text-[#FF6B4A] flex items-center gap-1 transition-colors"
        >
          <span>Advanced Location &amp; Age Filters</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ── Profile Discovery Grid ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Active Candidates Near You</h2>
            <p className="text-xs text-[#A1A1AA]">Verified singles available for date proposals today</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● 100% 18+ Age Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => {
            const isLiked = !!likedMap[profile.id];
            const mainPhoto = profile.media[0]?.storageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={profile.id}
                className="glass-card rounded-2xl overflow-hidden relative group flex flex-col border border-white/10 hover:border-[#FF4458]/50 transition-all duration-300"
              >
                {/* Profile Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181820]">
                  <Image
                    src={mainPhoto}
                    alt={profile.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C0C0F] via-[#0C0C0F]/40 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="badge-verified text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>

                    {profile.datingProfile?.isAvailableToday && (
                      <span className="bg-emerald-500 text-black font-extrabold text-[9px] uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        Available Today
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${profile.username}`}
                        className="font-bold text-lg text-white hover:text-[#FF4458] transition-colors truncate"
                      >
                        {profile.displayName}
                      </Link>
                      <button
                        onClick={() => toggleLike(profile.id)}
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? "fill-[#FF4458] text-[#FF4458]" : "text-white"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#A1A1AA]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4458]" />
                      <span>{profile.datingProfile?.location || "New York, USA"}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Card Body Details */}
                <div className="p-4 bg-[#141419] flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed italic">
                    &ldquo;{profile.datingProfile?.tagline || "Enthusiastic about memorable date nights and deep conversations."}&rdquo;
                  </p>

                  {/* Date Types Pills */}
                  {profile.datingProfile?.dateTypes && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.datingProfile.dateTypes.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="badge-intent text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/${profile.username}`}>
                    <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#FF4458]/15 hover:border-[#FF4458]/30 border border-white/10 text-xs font-semibold text-white transition-all">
                      View Full Profile
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Safety & Trust Section (Hinge / Match Standard) ───────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-[#141419] border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF4458]/15 flex items-center justify-center text-[#FF4458] flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Strict 18+ Verification</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Every member verifies their age and identity before unlocking date proposals and messaging.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Encrypted Messaging</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Chat safely with matches, propose venue locations, and set meeting times securely.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Zero Fake Accounts</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Moderated community with instant reporting and blocking to protect every member.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

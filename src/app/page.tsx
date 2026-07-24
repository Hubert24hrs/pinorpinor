"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame, Sparkles, MapPin, Heart, ShieldCheck,
  ChevronRight, Filter, UserCheck, Lock
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

const NIGERIAN_SAMPLE_PROFILES: ProfileFromAPI[] = [
  {
    id: "ng-1",
    username: "zainab_lagos",
    displayName: "Zainab, 24",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Fashion entrepreneur in VI. Love rooftop cocktails & seafood dinners.",
      city: "Lagos",
      country: "Nigeria",
      location: "Victoria Island, Lagos",
      isAvailableToday: true,
      dateTypes: ["Rooftop Cocktails", "Seafood Dinner", "VIP Event"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "ng-2",
    username: "chioma_abj",
    displayName: "Chioma, 25",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Architect based in Maitama. Live jazz lover & coffee enthusiast.",
      city: "Abuja",
      country: "Nigeria",
      location: "Maitama, Abuja",
      isAvailableToday: true,
      dateTypes: ["Coffee & Walk", "Live Jazz", "Fine Dining"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "ng-3",
    username: "funke_lekki",
    displayName: "Funke, 26",
    gender: "WOMAN",
    datingProfile: {
      tagline: "Brand strategist in Lekki. Passionate about art exhibitions & beach lounges.",
      city: "Lagos",
      country: "Nigeria",
      location: "Lekki Phase 1, Lagos",
      isAvailableToday: false,
      dateTypes: ["Beach Lounge", "Art Exhibition", "Dinner Date"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "ng-4",
    username: "tunde_abj",
    displayName: "Tunde, 28",
    gender: "MAN",
    datingProfile: {
      tagline: "Software engineer in Asokoro. Enjoy deep conversations & fine dining.",
      city: "Abuja",
      country: "Nigeria",
      location: "Asokoro, Abuja",
      isAvailableToday: true,
      dateTypes: ["Fine Dining", "Cocktails & Conversation"],
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    ],
  },
];

const NIGERIAN_CITIES = [
  "All Nigeria", "Lagos (VI / Lekki / Ikeja)", "Abuja (Maitama / Asokoro)", "Port Harcourt", "Ibadan", "Enugu"
];

export default function HomePage() {
  const [profiles, setProfiles] = useState<ProfileFromAPI[]>(NIGERIAN_SAMPLE_PROFILES);
  const [selectedGender, setSelectedGender] = useState<"ALL" | "WOMAN" | "MAN">("ALL");
  const [selectedCity, setSelectedCity] = useState("All Nigeria");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/discover")
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      })
      .catch(() => {});
  }, []);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProfiles = profiles.filter((p) => {
    if (selectedGender !== "ALL" && p.gender !== selectedGender) return false;
    if (selectedCity !== "All Nigeria") {
      const cityKey = selectedCity.split(" ")[0];
      if (p.datingProfile?.city && !p.datingProfile.city.includes(cityKey)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-10">

      {/* ── Hero Banner (Royal Blue & Ocean Cyan Theme) ─────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#FFFFFF] to-[#ECFEFF] p-8 sm:p-12 border border-[#BFDBFE] shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#2563EB]/30 text-xs font-bold text-[#2563EB] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Nigeria&apos;s #1 Verified Dating Platform</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Meet Verified Singles in <span className="gradient-text">Lagos, Abuja &amp; Beyond</span>.
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Discover real, verified Nigerian profiles for date proposals, rooftop dinners, live jazz, and high-end meetups with zero ghosting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/discover">
              <button className="gradient-btn px-6 py-3 text-sm flex items-center gap-2 cursor-pointer">
                <span>Start Swiping &amp; Match</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-3 rounded-full text-sm font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                Create 18+ Profile
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Nigerian Location & Gender Filter Bar ───────────────────── */}
      <section className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Gender Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Filter By:</span>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200">
              {(["ALL", "WOMAN", "MAN"] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedGender === gender
                      ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {gender === "ALL" ? "All Singles" : gender === "WOMAN" ? "Women" : "Men"}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/discover"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Advanced Distance &amp; Intent Filters</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <MapPin className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
          {NIGERIAN_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 border cursor-pointer ${
                selectedCity === city
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* ── Profile Discovery Grid ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Candidates in Nigeria</h2>
            <p className="text-xs text-gray-500">Verified profiles available for date night proposals</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                className="glass-card rounded-2xl overflow-hidden relative group flex flex-col border border-gray-200 hover:border-[#2563EB]/40 transition-all duration-300 bg-white"
              >
                {/* Profile Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={mainPhoto}
                    alt={profile.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="badge-verified text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      18+ Verified
                    </span>

                    {profile.datingProfile?.isAvailableToday && (
                      <span className="bg-emerald-600 text-white font-extrabold text-[9px] uppercase px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                        Available Today
                      </span>
                    )}
                  </div>

                  {/* Gradient Overlay for bottom text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                  {/* Bottom Image Details */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${profile.username}`}
                        className="font-bold text-base text-white hover:text-[#06B6D4] transition-colors truncate cursor-pointer"
                      >
                        {profile.displayName}
                      </Link>
                      <button
                        onClick={() => toggleLike(profile.id)}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? "fill-[#2563EB] text-[#2563EB]" : "text-white"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{profile.datingProfile?.location || "Lagos, Nigeria"}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Card Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed italic">
                    &ldquo;{profile.datingProfile?.tagline || "Enthusiastic about memorable date nights in Lagos."}&rdquo;
                  </p>

                  {/* Date Types Pills */}
                  {profile.datingProfile?.dateTypes && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.datingProfile.dateTypes.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="badge-intent text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/${profile.username}`} className="block">
                    <button className="w-full py-2 rounded-xl bg-gray-50 hover:bg-[#2563EB] hover:text-white border border-gray-200 text-xs font-bold text-gray-800 transition-all shadow-xs cursor-pointer">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Safety & Trust Section ─────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563EB] flex-shrink-0 border border-blue-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">18+ Age Gated Verification</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Every member in Nigeria verifies their age and identity before proposing dates or unlocking chat.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 border border-amber-100">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Encrypted Messaging</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Chat safely with matches, propose venue locations in Lagos or Abuja, and set meeting times securely.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Zero Fake Accounts</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Moderated community with instant reporting and blocking to protect every member.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

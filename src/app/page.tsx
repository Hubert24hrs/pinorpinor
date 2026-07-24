"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Sparkles, MapPin, Heart, UserCircle2, Shield, ChevronRight } from "lucide-react";

interface LadyFromAPI {
  id: string;
  username: string;
  displayName: string;
  ladyProfile: {
    tagline: string | null;
    city: string | null;
    country: string | null;
    location: string | null;
    isAvailableToday: boolean;
    isRedHot: boolean;
    isLiveNow: boolean;
  } | null;
  media: { storageUrl: string }[];
  _count: { reviewsReceived: number };
}

const LOCATIONS = ["All", "Lagos", "Abuja", "Port Harcourt", "Dubai", "London"];

function LadyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E2DC] bg-white shadow-sm animate-pulse">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-2 w-1/2 rounded" />
      </div>
    </div>
  );
}

function LadyCard({ lady }: { lady: LadyFromAPI }) {
  const [liked, setLiked] = useState(false);
  const photoUrl = lady.media[0]?.storageUrl || null;

  return (
    <div className="glass-card card-shine rounded-2xl overflow-hidden flex flex-col group">
      {/* Photo */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EDE8]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={lady.displayName || "Lady"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle2 className="w-14 h-14 text-[#D4CCC4]" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Badges */}
        {lady.ladyProfile?.isRedHot && (
          <span className="absolute top-2.5 right-2.5 badge-hot z-10">🔥 Hot</span>
        )}
        {lady.ladyProfile?.isAvailableToday && (
          <span className="absolute bottom-2.5 left-2.5 badge-available z-10">Available Today</span>
        )}
        {lady.ladyProfile?.isLiveNow && (
          <span className="absolute top-2.5 left-2.5 badge-live z-10">LIVE</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 bg-white flex-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <Link
            href={`/${lady.username}`}
            className="font-semibold text-sm text-[#1A1714] hover:text-[#C2446E] transition-colors truncate leading-tight"
          >
            {lady.displayName}
          </Link>
          <button
            onClick={() => setLiked(v => !v)}
            className="flex-shrink-0 transition-colors ml-1 mt-0.5"
          >
            <Heart
              className="w-4 h-4"
              style={{
                color: liked ? "#C2446E" : "#D4CCC4",
                fill: liked ? "#C2446E" : "none"
              }}
            />
          </button>
        </div>

        {lady.ladyProfile?.location && (
          <div className="flex items-center gap-1 text-[11px] text-[#9C948C] mb-1">
            <MapPin className="w-3 h-3 text-[#C2446E] flex-shrink-0" />
            <span className="truncate">{lady.ladyProfile.location}</span>
          </div>
        )}

        {lady.ladyProfile?.tagline && (
          <p className="text-[11px] text-[#5C5450] line-clamp-1 leading-relaxed">
            {lady.ladyProfile.tagline}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF0F4] border border-[#F4B8CB] flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-7 h-7 text-[#C2446E]" />
      </div>
      <h3 className="font-['Playfair_Display',serif] font-bold text-xl text-[#1A1714] mb-2">
        No ladies listed in this area yet
      </h3>
      <p className="text-sm text-[#9C948C] mb-6 max-w-xs mx-auto">
        Be the first to join and create your profile. Early members get a featured placement.
      </p>
      <Link href="/register">
        <button className="btn-primary text-xs py-2.5 px-6">
          Create Your Profile
        </button>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [ladies, setLadies] = useState<LadyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedLocation !== "All") params.set("city", selectedLocation);
    params.set("limit", "24");

    setLoading(true);
    fetch(`/api/ladies?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setLadies(data.ladies || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch(() => setLadies([]))
      .finally(() => setLoading(false));
  }, [selectedLocation]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-6 sm:p-8 border border-[#F0E5E8]">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F4B8CB] text-xs font-semibold text-[#C2446E] mb-3 shadow-sm">
            🏆 #1 Ladies Showcase Platform
          </span>
          <h1 className="font-['Playfair_Display',serif] font-bold text-2xl sm:text-4xl text-[#1A1714] mb-3 leading-tight">
            Meet Verified Ladies for{" "}
            <span className="gradient-text">Dates & Events</span>
          </h1>
          <p className="text-sm text-[#5C5450] mb-6 leading-relaxed max-w-md">
            Browse real verified profiles of ladies available in your city. Connect for dinner dates, VIP events, travel companionship, and private meetups.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/register">
              <button className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-1.5">
                Showcase Yourself (For Ladies) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link href="/browse">
              <button className="btn-secondary text-xs py-2.5 px-5">
                Browse All Ladies
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E8E2DC] text-xs shadow-sm">
        <AlertTriangle className="w-4 h-4 text-[#B5860D] flex-shrink-0" />
        <span className="text-[#5C5450]">
          <strong className="text-[#1A1714]">Safety notice:</strong>{" "}
          All profiles are verified. Always confirm identity before arranging a meetup.
        </span>
        <Link href="#" className="ml-auto text-[#C2446E] font-semibold hover:underline flex-shrink-0">
          Learn More
        </Link>
      </div>

      {/* Location filter + count */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8E2DC] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {LOCATIONS.map(loc => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLocation === loc
                  ? "bg-[#C2446E] text-white shadow-sm"
                  : "bg-white text-[#5C5450] border border-[#E8E2DC] hover:border-[#C2446E] hover:text-[#C2446E]"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
        {!loading && (
          <span className="text-xs text-[#9C948C] hidden sm:block whitespace-nowrap">
            <strong className="text-[#1A1714]">{total}</strong> ladies available
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <LadyCardSkeleton key={i} />)
          : ladies.length > 0
          ? ladies.map(lady => <LadyCard key={lady.id} lady={lady} />)
          : <EmptyState />
        }
      </div>
    </div>
  );
}

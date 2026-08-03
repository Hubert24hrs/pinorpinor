"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles, Filter, Search, MapPin, RefreshCw, ShieldCheck,
  SlidersHorizontal, ChevronDown, Check
} from "lucide-react";
import { ProfileGrid } from "@/components/profile/ProfileGrid";
import { ProfileCardData } from "@/components/profile/ProfileCard";

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profiles, setProfiles] = useState<ProfileCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [cityFilter, setCityFilter] = useState(searchParams?.get("city") || "ALL");
  const [verifiedFilter, setVerifiedFilter] = useState(searchParams?.get("verified") === "true");
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [page, setPage] = useState(1);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter && cityFilter !== "ALL") params.set("city", cityFilter);
      if (verifiedFilter) params.set("verified", "true");
      params.set("page", page.toString());

      const res = await fetch(`/api/public/profiles?${params.toString()}`);
      const data = await res.json();

      let results: ProfileCardData[] = data.profiles || [];

      // Optional text search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        results = results.filter(
          (p) =>
            p.displayName.toLowerCase().includes(q) ||
            p.username.toLowerCase().includes(q) ||
            p.datingProfile?.city?.toLowerCase().includes(q) ||
            p.datingProfile?.tagline?.toLowerCase().includes(q) ||
            p.datingProfile?.dateTypes?.some((t) => t.toLowerCase().includes(q))
        );
      }

      setProfiles(results);
      setTotalCount(data.pagination?.total || results.length);
    } catch (error) {
      console.error("Error fetching discover profiles:", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [cityFilter, verifiedFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  const resetFilters = () => {
    setCityFilter("ALL");
    setVerifiedFilter(false);
    setSearchQuery("");
    setPage(1);
    router.push("/discover");
  };

  const CITIES = [
    "ALL",
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Ibadan",
    "Enugu",
    "Benin City",
    "International",
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-[#F4E7B3] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Women Profile Directory</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-4xl font-bold text-white">
          Discover Approved Women Members
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
          Browse verified adult women profiles across Nigeria and internationally.
          Filter by city, interests, and verification status.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7E3DC] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Text Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, city or interest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-[#C2446E] outline-none"
            />
          </form>

          {/* Verification Filter Pill */}
          <button
            onClick={() => setVerifiedFilter((prev) => !prev)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              verifiedFilter
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 border-[#E7E3DC] hover:border-stone-400"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${verifiedFilter ? "text-emerald-600" : "text-stone-400"}`} />
            <span>Verified 18+ Only</span>
            {verifiedFilter && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-stone-100">
          <MapPin className="w-3.5 h-3.5 text-[#C2446E] flex-shrink-0" />
          <span className="text-[11px] font-bold text-stone-500 flex-shrink-0 uppercase">City:</span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCityFilter(c);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 border cursor-pointer transition-all ${
                cityFilter === c
                  ? "bg-[#C2446E] text-white border-[#C2446E] shadow-xs"
                  : "bg-[#FAF8F5] text-stone-700 border-[#E7E3DC] hover:border-stone-400"
              }`}
            >
              {c === "ALL" ? "All Locations" : c}
            </button>
          ))}

          {(cityFilter !== "ALL" || verifiedFilter || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-[#C2446E] hover:underline flex items-center gap-1 flex-shrink-0 ml-auto cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-stone-600">
          Showing <strong className="text-stone-900">{profiles.length}</strong> approved women profiles
        </p>

        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#C2446E]">
          ● Women Only (18+)
        </span>
      </div>

      {/* Profile Grid */}
      <ProfileGrid
        profiles={profiles}
        loading={loading}
        emptyTitle="No Women Profiles Match Your Filters"
        emptyDescription="We couldn't find any approved profiles matching your search parameters. Try clearing your filters or selecting a different location."
        onResetFilters={resetFilters}
      />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-stone-500">
          <div className="w-8 h-8 rounded-full border-2 border-[#C2446E] border-t-transparent animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading discovery deck...</p>
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}

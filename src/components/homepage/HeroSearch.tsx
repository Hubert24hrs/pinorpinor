"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCity !== "ALL") params.set("city", selectedCity);
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full border border-[#E7E3DC] shadow-lg flex flex-col sm:flex-row items-center gap-2 max-w-xl"
    >
      <div className="flex-1 flex items-center gap-2.5 px-4 py-2 w-full">
        <Search className="w-4 h-4 text-[#C2446E] flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name, city, or interests..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-xs sm:text-sm text-stone-900 placeholder-stone-400 bg-transparent outline-none"
        />
      </div>

      <div className="h-6 w-[1px] bg-stone-200 hidden sm:block" />

      <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto">
        <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="text-xs text-stone-700 bg-transparent font-medium outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="ALL">All Cities</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
          <option value="Ibadan">Ibadan</option>
          <option value="Enugu">Enugu</option>
        </select>
      </div>

      <button
        type="submit"
        className="gradient-btn w-full sm:w-auto px-6 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Browse Women</span>
      </button>
    </form>
  );
}

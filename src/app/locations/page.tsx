import React from "react";
import Link from "next/link";
import { MapPin, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LocationsPage() {
  const LOCATIONS = [
    { city: "Lagos", state: "Lagos State", region: "Victoria Island, Lekki & Ikeja", count: "18+ Approved Women", bg: "bg-rose-50 border-rose-200 text-[#C2446E]" },
    { city: "Abuja", state: "Federal Capital Territory", region: "Maitama, Asokoro & Gwarinpa", count: "12+ Approved Women", bg: "bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]" },
    { city: "Port Harcourt", state: "Rivers State", region: "GRA Phase 1 & 2", count: "8+ Approved Women", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    { city: "Ibadan", state: "Oyo State", region: "Bodija & Oluyole Estate", count: "5+ Approved Women", bg: "bg-amber-50 border-amber-200 text-amber-900" },
    { city: "Enugu", state: "Enugu State", region: "Independence Layout & GRA", count: "4+ Approved Women", bg: "bg-purple-50 border-purple-200 text-purple-900" },
    { city: "Benin City", state: "Edo State", region: "GRA & Airport Road", count: "3+ Approved Women", bg: "bg-stone-100 border-stone-300 text-stone-900" },
  ];

  return (
    <div className="space-y-10">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4E7B3]">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Geographic Profile Directory</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-white">
          Browse Women Profiles by City
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
          Pinorpinor connects approved adult women across major metropolitan centers in Nigeria and internationally.
          Select a city below to view local profiles safely.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOCATIONS.map((loc) => (
          <Link key={loc.city} href={`/discover?city=${encodeURIComponent(loc.city)}`}>
            <div className="glass-card rounded-2xl p-6 border border-[#E7E3DC] hover:border-[#C2446E] transition-all group space-y-4 bg-white cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#C2446E]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${loc.bg}`}>
                  {loc.count}
                </span>
              </div>

              <div>
                <h3 className="font-serif-display text-xl font-bold text-stone-900 group-hover:text-[#C2446E] transition-colors">
                  {loc.city}
                </h3>
                <p className="text-xs text-stone-500 font-medium">{loc.state}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>{loc.region}</span>
                <ChevronRight className="w-4 h-4 text-[#C2446E] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-white border border-[#E7E3DC] text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Location Privacy Guaranteed</span>
        </div>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Public profiles state general city locations only. Home addresses and live GPS locations are never collected or published.
        </p>
      </div>
    </div>
  );
}

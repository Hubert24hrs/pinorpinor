"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Bell, ShieldCheck } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [session]);

  return (
    <header className="h-16 border-b border-[#E8E2DC] bg-white/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 md:ml-[220px]">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948C]" />
          <input
            type="text"
            placeholder="Search candidates by name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1A1714] placeholder-[#9C948C] focus:border-[#C2446E] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Verified badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EDE8] border border-[#E8E2DC] text-xs text-[#5C5450]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D7A4F]" />
          <span>100% Verified Profiles</span>
        </div>

        {/* Session Aware Actions */}
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <button className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#5C5450] hover:text-[#1A1714] relative transition-all">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C2446E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C2446E] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {session.user?.name?.[0] || "U"}
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/register">
              <button className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] text-[#5C5450] hover:bg-[#F2EDE8] text-xs font-semibold transition-all">
                Join Free
              </button>
            </Link>
            <Link href="/login">
              <button className="px-3.5 py-1.5 rounded-lg bg-[#C2446E] text-white text-xs font-semibold shadow-sm hover:bg-[#9B2C52] transition-all">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

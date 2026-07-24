"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, MessageSquare, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-white/7 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 md:ml-[220px]">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Input
            placeholder="Search ladies by name, city, location..."
            leftIcon={<Search className="w-4 h-4 text-[#a1a1aa]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#16131f] border-white/10 text-xs py-2 text-white placeholder-[#71717a] focus:border-[#e91e8c]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 ml-4">
        {/* Safety Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16131f] border border-white/7 text-xs text-[#a1a1aa]">
          <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>100% Verified Profiles</span>
        </div>

        {/* Notifications & Messages */}
        <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-white/20 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e91e8c]" />
        </button>

        <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-white/20 relative">
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Sign In & Sign Up CTAs */}
        <div className="flex items-center gap-2">
          <Link href="/register">
            <button className="px-3.5 py-1.5 rounded-lg border border-[#e91e8c]/50 text-[#e91e8c] hover:bg-[#e91e8c]/10 text-xs font-semibold transition-all">
              Sign Up
            </button>
          </Link>
          <Link href="/login">
            <button className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#e91e8c] to-[#be185d] text-white text-xs font-semibold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

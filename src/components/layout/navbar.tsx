"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Heart, MessageSquare, Bell, Settings, LogOut,
  User, ShieldCheck, Sparkles, Menu, X, SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",          label: "Home",     icon: Flame },
  { href: "/discover",  label: "Discover", icon: Sparkles },
  { href: "/messages",  label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userName = session?.user?.name || "User";
  const userInitial = userName[0]?.toUpperCase() || "P";

  return (
    <>
      {/* ── Top Header Navigation ────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-white/10",
          isScrolled
            ? "bg-[#0C0C0F]/90 backdrop-blur-xl shadow-lg"
            : "bg-[#0C0C0F]/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] flex items-center justify-center shadow-lg shadow-[#FF4458]/30 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl tracking-tight text-white leading-none">
                pinor<span className="text-[#FF4458]">pinor</span>
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-medium tracking-wider uppercase leading-none mt-0.5">
                Dating &amp; Meetups
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#141419] p-1.5 rounded-full border border-white/10">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 relative",
                    isActive
                      ? "text-white bg-gradient-to-r from-[#FF4458] to-[#FF6B4A] shadow-md shadow-[#FF4458]/20"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Verified Badge Header Callout */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>18+ Verified Profiles</span>
            </div>

            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full border border-white/10 bg-[#141419] hover:border-[#FF4458]/50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold text-white px-1 hidden sm:inline-block max-w-[100px] truncate">
                    {userName}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#181820] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2.5 border-b border-white/10">
                        <p className="text-xs font-bold text-white truncate">{userName}</p>
                        <p className="text-[10px] text-[#A1A1AA] truncate">{session.user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#FF4458]" />
                          My Dating Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#FF4458]" />
                          Discovery Settings
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-white/10">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="px-4 py-2 rounded-full text-xs font-semibold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="gradient-btn px-5 py-2 text-xs font-semibold">
                    Join Free
                  </button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Mobile Bottom Navigation Bar (Hinge / Tinder Style) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0C0C0F]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200",
                isActive ? "text-[#FF4458]" : "text-[#A1A1AA] hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-[#FF4458]/20")} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
        {session ? (
          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200",
              pathname === "/settings" ? "text-[#FF4458]" : "text-[#A1A1AA] hover:text-white"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[#A1A1AA]"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}

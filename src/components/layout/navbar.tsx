"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Heart, MessageSquare, Bell, Settings, LogOut,
  User, ShieldCheck, Sparkles, MapPin
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
      {/* ── Top Header Navigation (Royal Blue & Ocean Cyan Theme) ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200/80",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm"
            : "bg-white/90 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md shadow-[#2563EB]/25 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                pinor<span className="text-[#2563EB]">pinor</span>
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase leading-none mt-0.5 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#2563EB]" />
                Nigeria &amp; Global Dating
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 relative",
                    isActive
                      ? "text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] shadow-sm shadow-[#2563EB]/30"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
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
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>18+ Verified Profiles</span>
            </div>

            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full border border-gray-200 bg-white hover:border-[#2563EB]/50 transition-all duration-200 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold text-gray-900 px-1 hidden sm:inline-block max-w-[100px] truncate">
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
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-[10px] text-gray-500 truncate">{session.user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#2563EB]" />
                          My Dating Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#2563EB]" />
                          Discovery Settings
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                  <button className="px-4 py-2 rounded-full text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all">
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

      {/* ── Mobile Bottom Navigation Bar (Royal Blue Theme) ───────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-2 flex items-center justify-around shadow-lg">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200",
                isActive ? "text-[#2563EB]" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-[#2563EB]/15")} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
        {session ? (
          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200",
              pathname === "/settings" ? "text-[#2563EB]" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-gray-500"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}

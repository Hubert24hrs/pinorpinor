"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Sparkles, MapPin, ShieldCheck, User, Search,
  Settings, LogOut, Menu, X, HelpCircle, Heart, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/women", label: "Women" },
  { href: "/discover", label: "Discover" },
  { href: "/locations", label: "Locations" },
  { href: "/safety", label: "Safety" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userName = session?.user?.name || "Member";
  const userInitial = userName[0]?.toUpperCase() || "P";
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(session?.user?.role || "");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-[#E7E3DC]",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xs"
            : "bg-white/90 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] flex items-center justify-center shadow-md shadow-[#C2446E]/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-display font-bold text-xl tracking-tight text-stone-900 leading-none">
                pinor<span className="text-[#C2446E]">pinor</span>
              </span>
              <span className="text-[9px] text-stone-500 font-semibold tracking-wider uppercase leading-none mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-[#C2446E]" />
                Women-Focused Platform
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FAF8F5] p-1.5 rounded-full border border-[#E7E3DC]">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "text-white bg-gradient-to-r from-[#C2446E] to-[#7C1D38] shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search Icon button */}
            <Link
              href="/discover"
              className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Search Profiles"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Authenticated user menu */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full border border-stone-200 bg-white hover:border-[#C2446E]/50 transition-all shadow-xs cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold text-stone-900 px-1 hidden sm:inline-block max-w-[100px] truncate">
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
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2.5 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">{userName}</p>
                        <p className="text-[10px] text-stone-500 truncate">{session.user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#C2446E]" />
                          Member Dashboard
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Admin Moderation
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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
                {/* Discreet login link */}
                <Link href="/login">
                  <button className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors">
                    Sign In
                  </button>
                </Link>

                {/* Primary CTA */}
                <Link href="/join">
                  <button className="gradient-btn px-4 py-2 text-xs font-bold flex items-center gap-1">
                    <span>Join as a Woman</span>
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between",
                      pathname === href ? "bg-rose-50 text-[#C2446E]" : "text-stone-700 hover:bg-stone-50"
                    )}
                  >
                    <span>{label}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}
              </div>

              {!session && (
                <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                  <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="gradient-btn w-full py-2.5 text-xs font-bold">
                      Join as a Woman
                    </button>
                  </Link>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2 text-xs font-semibold text-stone-600">
                      Already have an account? Sign In
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Sticky Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-4 py-2 flex items-center justify-around shadow-lg">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors",
                isActive ? "text-[#C2446E]" : "text-stone-500"
              )}
            >
              <span className="text-xs font-bold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Menu, X, Home, Compass, TrendingUp,
  Users, MessageCircle, Settings, LogOut, ChevronDown,
  Sparkles, Upload, LayoutDashboard, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",         label: "Home",     icon: Home },
  { href: "/explore",  label: "Explore",  icon: Compass },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/creators", label: "Creators", icon: Users },
];

interface NavbarProps {
  user?: {
    id: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    role?: string;
  } | null;
  unreadNotifications?: number;
}

export function Navbar({ user, unreadNotifications = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[200] transition-all duration-300",
          isScrolled
            ? "bg-[#09090B]/80 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ─────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF2E88] to-[#7C3AED] flex items-center justify-center shadow-[0_0_20px_rgba(255,46,136,0.4)] group-hover:shadow-[0_0_30px_rgba(255,46,136,0.6)] transition-shadow duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-[family-name:var(--font-poppins)] font-bold text-lg text-white hidden sm:block">
                Pinor<span className="gradient-text">pinor</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ─────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-white bg-white/8"
                        : "text-[#A1A1AA] hover:text-white hover:bg-white/6"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl bg-white/8 -z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right Actions ─────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/8 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <>
                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/8 transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-[9px] font-bold text-white bg-[#FF2E88] rounded-full flex items-center justify-center">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/8 transition-all duration-200"
                    >
                      <Avatar
                        src={user.image}
                        name={user.name}
                        size="sm"
                        showRing
                        ringColor="primary"
                      />
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-[#A1A1AA] transition-transform duration-200 hidden sm:block",
                          isUserMenuOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[300]"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-white/8">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-[#A1A1AA] truncate">@{user.username}</p>
                          </div>

                          <div className="p-1.5">
                            <UserMenuItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                            <UserMenuItem href={`/${user.username}`} icon={<Users className="w-4 h-4" />} label="My Profile" />
                            <UserMenuItem href="/dashboard/upload" icon={<Upload className="w-4 h-4" />} label="Upload Content" />
                            <UserMenuItem href="/messages" icon={<MessageCircle className="w-4 h-4" />} label="Messages" />
                            {["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(user.role || "") && (
                              <UserMenuItem href="/admin" icon={<Zap className="w-4 h-4" />} label="Admin Panel" highlight />
                            )}
                          </div>

                          <div className="p-1.5 border-t border-white/8">
                            <UserMenuItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors duration-150"
                              onClick={() => { /* signOut */ }}
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/8 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Global Search Modal ────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
                <Search className="w-5 h-5 text-[#A1A1AA] flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search creators, posts, hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-[#A1A1AA]/60 text-base focus:outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/8 text-[#A1A1AA] transition-colors"
                >
                  <kbd className="text-xs px-1.5 py-0.5 rounded bg-white/8 border border-white/10">Esc</kbd>
                </button>
              </div>
              {!searchQuery && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["#photography", "#digitalart", "#music", "#travel", "#fashion", "#film"].map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/6 text-sm text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Nav Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#09090B] border-l border-white/8 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/8 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      pathname === href
                        ? "text-white bg-white/8"
                        : "text-[#A1A1AA] hover:text-white hover:bg-white/6"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="p-4 space-y-2 border-t border-white/8">
                  <Link href="/login" className="block">
                    <Button variant="outline" size="md" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="primary" size="md" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Helper: User Menu Item ─────────────────────────────────────
function UserMenuItem({
  href, icon, label, highlight,
}: { href: string; icon: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors duration-150",
        highlight
          ? "text-[#FF2E88] hover:bg-[#FF2E88]/10"
          : "text-[#A1A1AA] hover:text-white hover:bg-white/8"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

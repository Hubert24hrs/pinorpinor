"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Radio, Rss, Crown, Megaphone, Calendar, Video,
  MessageSquare, Globe, Star, AlertTriangle, Menu, X, Sparkles, LogIn
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home,        label: "Home",           href: "/",          color: "#e91e8c" },
  { icon: Radio,       label: "Live",           href: "/live",      color: "#ef4444" },
  { icon: Rss,         label: "Feeds",          href: "/feeds",     color: "#a1a1aa" },
  { icon: Crown,       label: "Exclusive",      href: "/exclusive", color: "#f59e0b" },
  { icon: Megaphone,   label: "Adverts",        href: "/adverts",   color: "#a1a1aa" },
  { icon: Calendar,    label: "Events",         href: "/events",    color: "#a1a1aa" },
  { icon: Video,       label: "Videos",         href: "/videos",    color: "#a1a1aa" },
  { icon: MessageSquare, label: "Rooms",        href: "/rooms",     color: "#a1a1aa" },
  { icon: Globe,       label: "Tours",          href: "/tours",     color: "#a1a1aa" },
  { icon: Star,        label: "Reviews",        href: "/reviews",   color: "#a1a1aa" },
  { icon: AlertTriangle, label: "Blacklisted",  href: "/blacklisted", color: "#ef4444" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/7">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-['Poppins',sans-serif] font-bold text-base text-white leading-none">
              Pinor<span className="gradient-text">pinor</span>
            </span>
            <p className="text-[9px] text-[#a1a1aa] mt-0.5 leading-none">where ladies connect</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? "text-white"
                  : "text-[#71717a] hover:text-white"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#e91e8c] rounded-r-full" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive ? "bg-white/10" : "group-hover:bg-white/5"
                }`}
                style={isActive ? { boxShadow: `0 0 12px ${item.color}30` } : {}}
              >
                <item.icon
                  className="w-4 h-4"
                  style={{ color: isActive ? item.color : undefined }}
                />
              </div>
              <span>{item.label}</span>
              {item.label === "Live" && (
                <span className="ml-auto badge-live text-[8px]">LIVE</span>
              )}
              {item.label === "Exclusive" && (
                <span className="ml-auto text-[9px] font-bold text-[#f59e0b]">VIP</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Auth CTA */}
      <div className="p-4 border-t border-white/7">
        <Link href="/register" onClick={() => setMobileOpen(false)}>
          <button className="btn-primary w-full text-xs py-2.5 rounded-lg">
            Join Free
          </button>
        </Link>
        <Link href="/login" onClick={() => setMobileOpen(false)}>
          <button className="btn-outline w-full text-xs py-2 rounded-lg mt-2">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 border-r border-white/7"
        style={{ width: "220px", background: "var(--bg-sidebar)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass flex items-center justify-center text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed left-0 top-0 h-screen z-50 border-r border-white/7 flex flex-col"
            style={{ width: "220px", background: "var(--bg-sidebar)" }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#71717a] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}

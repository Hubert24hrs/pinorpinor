"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home, Compass, MessageSquare, Bell, Settings, Heart, Menu, X, LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home,          label: "Home",          href: "/" },
  { icon: Compass,       label: "Discover",      href: "/discover" },
  { icon: MessageSquare, label: "Messages",      href: "/messages" },
  { icon: Bell,          label: "Notifications", href: "/notifications" },
  { icon: Settings,      label: "Settings",      href: "/settings" },
];

// ── SidebarContent extracted outside Sidebar to avoid "component created during render" lint error ──
interface SidebarContentProps {
  pathname: string;
  userName: string | null | undefined;
  userInitial: string;
  onClose: () => void;
}

function SidebarContent({ pathname, userName, userInitial, onClose }: SidebarContentProps) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[#2E2A27]">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-xl bg-[#C2446E] flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="font-['Playfair_Display',serif] font-bold text-base text-white leading-none tracking-wide">
              Pinorpinor
            </span>
            <p className="text-[9px] text-[#8A7E76] mt-0.5 leading-none">dating &amp; meetups</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-200 relative group ${
                isActive ? "text-white" : "text-[#8A7E76] hover:text-[#C4BAB4]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#C2446E]" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive ? "bg-white/10" : "group-hover:bg-white/5"
                }`}
              >
                <item.icon
                  className="w-4 h-4"
                  style={{ color: isActive ? "#C2446E" : undefined }}
                />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Auth CTA */}
      <div className="p-4 border-t border-[#2E2A27] space-y-2">
        {session ? (
          <div className="space-y-2">
            <Link href="/dashboard" onClick={onClose}>
              <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#C2446E] flex items-center justify-center text-white text-xs font-bold">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-[#8A7E76] truncate">View Profile</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-xs py-2 rounded-lg border border-[#3A3430] text-[#A09088] hover:text-white hover:border-[#5A504A] flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/register" onClick={onClose}>
              <button className="btn-primary w-full text-xs py-2.5 rounded-lg">
                Join Free
              </button>
            </Link>
            <Link href="/login" onClick={onClose}>
              <button className="w-full text-xs py-2 rounded-lg border border-[#3A3430] text-[#A09088] hover:text-white hover:border-[#5A504A] transition-all">
                Sign In
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = session?.user?.name;
  const userInitial = userName?.[0] ?? "U";

  const contentProps: SidebarContentProps = {
    pathname,
    userName,
    userInitial,
    onClose: () => setMobileOpen(false),
  };

  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 border-r border-[#2E2A27]"
        style={{ width: "220px", background: "#1C1A18" }}
      >
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white border border-[#E8E2DC] shadow-md flex items-center justify-center text-[#1A1714]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-50"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed left-0 top-0 h-screen z-50 border-r border-[#2E2A27] flex flex-col"
            style={{ width: "220px", background: "#1C1A18" }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#8A7E76] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent {...contentProps} />
          </aside>
        </>
      )}
    </>
  );
}

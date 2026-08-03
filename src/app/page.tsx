import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck, Sparkles, MapPin, ChevronRight, Lock, Eye,
  UserCheck, Heart, ArrowRight, CheckCircle2, Star, Users
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProfileCard, ProfileCardData } from "@/components/profile/ProfileCard";
import { HeroSearch } from "@/components/homepage/HeroSearch";

// Curated verified sample adult women profiles (used if database is empty/unseeded)
const FALLBACK_WOMEN_PROFILES: ProfileCardData[] = [
  {
    id: "fp-1",
    username: "zainab_lagos",
    displayName: "Zainab",
    age: 24,
    verificationStatus: "VERIFIED",
    datingProfile: {
      tagline: "Fashion entrepreneur in Victoria Island. Love rooftop cocktails & live jazz.",
      city: "Lagos",
      country: "Nigeria",
      location: "Victoria Island, Lagos",
      isAvailableToday: true,
      dateTypes: ["Rooftop Cocktails", "Fine Dining", "Art Exhibitions"],
      bio: "Creative lead living in VI. Enjoy spontaneous travel, high-end date nights, and insightful conversations.",
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "fp-2",
    username: "chioma_abj",
    displayName: "Chioma",
    age: 25,
    verificationStatus: "VERIFIED",
    datingProfile: {
      tagline: "Architect in Maitama. Live music enthusiast & espresso connoisseur.",
      city: "Abuja",
      country: "Nigeria",
      location: "Maitama, Abuja",
      isAvailableToday: true,
      dateTypes: ["Coffee & Walk", "Live Jazz", "VIP Events"],
      bio: "Designing beautiful structures by day, exploring live music spots by night.",
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "fp-3",
    username: "funke_lekki",
    displayName: "Funke",
    age: 26,
    verificationStatus: "VERIFIED",
    datingProfile: {
      tagline: "Brand strategist in Lekki. Passionate about art galleries & beach lounges.",
      city: "Lagos",
      country: "Nigeria",
      location: "Lekki Phase 1, Lagos",
      isAvailableToday: false,
      dateTypes: ["Beach Lounges", "Art Galleries", "Weekend Getaways"],
      bio: "Brand consultant living on the island. Love meeting inspiring people for memorable dates.",
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "fp-4",
    username: "amara_abj",
    displayName: "Amara",
    age: 27,
    verificationStatus: "VERIFIED",
    datingProfile: {
      tagline: "Interior designer in Asokoro. Love sunset dinners & cultural events.",
      city: "Abuja",
      country: "Nigeria",
      location: "Asokoro, Abuja",
      isAvailableToday: true,
      dateTypes: ["Sunset Dinners", "Wine Tasting", "Cultural Events"],
      bio: "Passionate about luxury interiors, classical music, and fine dining.",
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80" },
    ],
  },
];

async function getFeaturedWomen(): Promise<ProfileCardData[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        gender: "WOMAN",
        isActive: true,
        isBanned: false,
        datingProfile: {
          isPublic: true,
          isDiscoverable: true,
        },
      },
      take: 8,
      orderBy: [
        { datingProfile: { isRedHot: "desc" } },
        { datingProfile: { isAvailableToday: "desc" } },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        displayName: true,
        username: true,
        birthDate: true,
        verificationStatus: true,
        datingProfile: {
          select: {
            bio: true,
            tagline: true,
            city: true,
            country: true,
            location: true,
            dateTypes: true,
            isAvailableToday: true,
            isRedHot: true,
          },
        },
        media: {
          where: { isApproved: true },
          take: 2,
          select: { storageUrl: true },
        },
      },
    });

    if (users.length === 0) return FALLBACK_WOMEN_PROFILES;

    return users.map((u) => {
      let age: number | null = null;
      if (u.birthDate) {
        const today = new Date();
        age = today.getFullYear() - u.birthDate.getFullYear();
        const m = today.getMonth() - u.birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < u.birthDate.getDate())) age--;
      }
      return {
        id: u.id,
        username: u.username || u.id,
        displayName: u.displayName || "Member",
        age,
        verificationStatus: u.verificationStatus,
        datingProfile: u.datingProfile,
        media: u.media,
      };
    });
  } catch (error) {
    console.error("Database fetch error for homepage:", error);
    return FALLBACK_WOMEN_PROFILES;
  }
}

export default async function HomePage() {
  const featuredProfiles = await getFeaturedWomen();

  return (
    <div className="space-y-16">
      
      {/* ── 1. Editorial Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-[#141216] text-white p-8 sm:p-14 md:p-16 border border-stone-800 shadow-xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#C2446E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#F4E7B3]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Premium Women-Focused Social Discovery</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Discover Verified Women for <span className="gold-gradient-text">Authentic Local Meetups</span>.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Browse public profiles, short videos, interests, and preferred date activities created by approved adult women.
            No sign-in wall — begin exploring immediately.
          </p>

          {/* Hero Search */}
          <div className="pt-2">
            <HeroSearch />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/women">
              <button className="gradient-btn px-7 py-3.5 text-sm font-bold flex items-center gap-2 cursor-pointer">
                <span>Browse All Women Profiles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/join">
              <button className="gold-btn px-6 py-3.5 text-sm font-bold flex items-center gap-2 cursor-pointer">
                <ShieldCheck className="w-4 h-4" />
                <span>Join as a Woman (18+)</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Women Grid ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#C2446E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Approved Members</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Women Profiles
            </h2>
          </div>

          <Link href="/women" className="text-xs font-bold text-[#C2446E] hover:underline flex items-center gap-1">
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProfiles.map((profile, idx) => (
            <ProfileCard key={profile.id} profile={profile} priorityImage={idx < 4} />
          ))}
        </div>
      </section>

      {/* ── 3. Explore by Location Section ───────────────────────────── */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#C2446E] uppercase tracking-wider">Geographic Discovery</span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Explore Profiles by City
            </h2>
          </div>

          <Link href="/locations" className="text-xs font-bold text-[#C2446E] hover:underline flex items-center gap-1">
            <span>All Locations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { city: "Lagos", count: 18, desc: "Victoria Island, Lekki, Ikeja", href: "/discover?city=Lagos" },
            { city: "Abuja", count: 12, desc: "Maitama, Asokoro, Wuse", href: "/discover?city=Abuja" },
            { city: "Port Harcourt", count: 8, desc: "GRA Phase 1 & 2", href: "/discover?city=Port+Harcourt" },
            { city: "Ibadan", count: 5, desc: "Bodija & Oluyole", href: "/discover?city=Ibadan" },
            { city: "Enugu", count: 4, desc: "Independence Layout", href: "/discover?city=Enugu" },
            { city: "International", count: 15, desc: "London, Dubai, Accra & Beyond", href: "/discover?city=International" },
          ].map((loc) => (
            <Link key={loc.city} href={loc.href}>
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#C2446E] transition-all duration-200 group cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-stone-900 group-hover:text-[#C2446E] transition-colors">
                    {loc.city}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#C2446E]">
                    {loc.count}+ Profiles
                  </span>
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{loc.desc}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. How Pinorpinor Works ───────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-[#C2446E] uppercase tracking-wider">Simple &amp; Safe</span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            How Pinorpinor Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Designed for privacy, high standards, and effortless social discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Browse Profiles Freely",
              desc: "Explore public profiles, approved photos, and short videos without mandatory login.",
              icon: Eye,
            },
            {
              step: "02",
              title: "Verified Adult Women",
              desc: "Profiles are submitted by adult women (18+) and reviewed by moderation before publication.",
              icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Connect & Inquire",
              desc: "Use controlled contact options or meetup requests respecting member privacy settings.",
              icon: Heart,
            },
            {
              step: "04",
              title: "Safe First Meetings",
              desc: "Follow platform safety recommendations for secure public date-night meetups.",
              icon: UserCheck,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="p-6 rounded-2xl bg-white border border-[#E7E3DC] shadow-sm space-y-3 relative">
                <span className="text-2xl font-serif-display font-bold text-[#C2446E]/30">{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#C2446E]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900">{s.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Trust & Moderation Policy Section ─────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">18+ Server Verification</h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Every member verifies their age (18+) and identity before profile approval. Underage access is strictly forbidden.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-[#C2446E] flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Location Privacy Protected</h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Public profiles only present general city or neighborhood. Home addresses and GPS coordinates are never exposed.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Human Moderation</h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Every uploaded photo and video is independently reviewed before going public. Zero tolerance for unapproved media.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Call to Action for Women ───────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#C2446E] to-[#7C1D38] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F4E7B3]">
            Become a Verified Member
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
            Are You an Adult Woman Looking for Quality Connections?
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Create your approved public profile, present your photos, short videos, and date-night preferences, and control your privacy on your own terms.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/join">
            <button className="gold-btn px-8 py-3.5 text-sm font-extrabold cursor-pointer">
              Create Your Profile (18+)
            </button>
          </Link>
          <Link href="/safety">
            <button className="px-6 py-3.5 rounded-full border border-white/30 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer">
              Read Community Guidelines
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

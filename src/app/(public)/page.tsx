"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Sparkles, Star, TrendingUp, Users, Image as ImageIcon,
  Video, Shield, Zap, Globe, Heart, Camera, Music, Palette,
  Play, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, VerificationBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ParticleBackground, GradientMesh, MouseSpotlight } from "@/components/animations/particle-background";
import { formatNumber } from "@/lib/utils";

// ── Demo creators for hero showcase ──────────────────────────
const FEATURED_CREATORS = [
  {
    name: "Luna Vasquez",
    username: "lunavasquez",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
    category: "Photography",
    followers: 128400,
    verified: true,
  },
  {
    name: "Kai Okonkwo",
    username: "kaiokonkwo",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    category: "Film",
    followers: 94300,
    verified: true,
  },
  {
    name: "Aria Chen",
    username: "ariachen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    category: "Digital Art",
    followers: 211000,
    verified: true,
  },
  {
    name: "Marcus Bell",
    username: "marcusbell",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
    category: "Music",
    followers: 87200,
    verified: true,
  },
  {
    name: "Sofia Reyes",
    username: "sofiareyes",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    category: "Fashion",
    followers: 316000,
    verified: true,
  },
  {
    name: "James Nakamura",
    username: "jamesnakamura",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    category: "Travel",
    followers: 154700,
    verified: true,
  },
];

const STATS = [
  { label: "Creators", value: 48000 },
  { label: "Posts Shared", value: 2400000 },
  { label: "Monthly Views", value: 89000000 },
  { label: "Countries", value: 142 },
];

const FEATURES = [
  {
    icon: Camera,
    title: "Photo & Video Uploads",
    description: "Share your best work with drag-and-drop uploads, automatic optimization, and CDN delivery worldwide.",
    color: "#FF2E88",
    gradient: "from-[#FF2E88]/20 to-[#FF2E88]/5",
  },
  {
    icon: TrendingUp,
    title: "Creator Analytics",
    description: "Deep insights into your audience — follower growth, engagement rates, and top-performing content.",
    color: "#7C3AED",
    gradient: "from-[#7C3AED]/20 to-[#7C3AED]/5",
  },
  {
    icon: Users,
    title: "Build Your Audience",
    description: "Connect with fans who love your work. Follow, like, comment, and build a real community.",
    color: "#00E5FF",
    gradient: "from-[#00E5FF]/15 to-[#00E5FF]/5",
  },
  {
    icon: Shield,
    title: "Verified Creator Badge",
    description: "Get verified to stand out, build trust, and unlock premium creator features.",
    color: "#FFD700",
    gradient: "from-[#FFD700]/15 to-[#FFD700]/5",
  },
  {
    icon: Zap,
    title: "Real-Time Messaging",
    description: "Connect directly with your fans and fellow creators through private messages and DMs.",
    color: "#FF2E88",
    gradient: "from-[#FF2E88]/20 to-[#FF2E88]/5",
  },
  {
    icon: Globe,
    title: "Global Discovery",
    description: "Get discovered by new audiences worldwide through our trending system and explore feeds.",
    color: "#00D26A",
    gradient: "from-[#00D26A]/15 to-[#00D26A]/5",
  },
];

const CATEGORIES = [
  { name: "Photography", icon: Camera, color: "#FF2E88", count: "12.4K creators" },
  { name: "Digital Art", icon: Palette, color: "#7C3AED", count: "8.9K creators" },
  { name: "Music", icon: Music, color: "#FFD700", count: "6.2K creators" },
  { name: "Film", icon: Video, color: "#00E5FF", count: "4.8K creators" },
  { name: "Fashion", icon: Star, color: "#FF6B6B", count: "9.1K creators" },
  { name: "Travel", icon: Globe, color: "#00D26A", count: "7.3K creators" },
];

// ── Animation variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Animated Counter ───────────────────────────────────────────
function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] gradient-text mb-1">
        {inView ? formatNumber(value) : "0"}+
      </div>
      <div className="text-sm text-[#A1A1AA] font-medium">{label}</div>
    </motion.div>
  );
}

// ── Creator Card ──────────────────────────────────────────────
function CreatorShowcaseCard({ creator, index }: { creator: typeof FEATURED_CREATORS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/${creator.username}`} className="group block">
        <div className="glass rounded-2xl p-4 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(255,46,136,0.1)]">
          <div className="flex items-center gap-3">
            <Avatar
              src={creator.image}
              name={creator.name}
              size="md"
              showRing
              ringColor="primary"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-white truncate group-hover:gradient-text transition-all duration-200">
                  {creator.name}
                </span>
                {creator.verified && <VerificationBadge size="sm" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="primary" size="xs">{creator.category}</Badge>
                <span className="text-xs text-[#A1A1AA]">{formatNumber(creator.followers)} followers</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.1, duration: 0.6 }}
      className="group relative"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative glass rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-white/20 group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
        >
          <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
        </div>
        <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-lg text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-sm text-[#A1A1AA] leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <MouseSpotlight />

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-hero pt-16">
        <GradientMesh />
        <ParticleBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <Badge variant="gradient" size="md" leftIcon={<Sparkles className="w-3 h-3" />}>
                  The Future of Creator Platforms
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-[family-name:var(--font-poppins)] font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-white mb-6"
              >
                Where{" "}
                <span className="relative">
                  <span className="gradient-text text-glow-primary">Creators</span>
                </span>
                <br />
                Connect with{" "}
                <span className="gradient-text-accent">the World</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Build your verified creator profile, share stunning photos and videos, grow your audience,
                and connect with fans worldwide on the most premium creator platform.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
              >
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-[0_0_40px_rgba(255,46,136,0.3)] hover:shadow-[0_0_60px_rgba(255,46,136,0.5)]"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Creating Free
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Play className="w-4 h-4" />}>
                    Explore Creators
                  </Button>
                </Link>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-[#A1A1AA]"
              >
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Setup in 2 minutes",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#00D26A]" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Creator Showcase */}
            <div className="relative">
              {/* Floating card stack */}
              <div className="grid grid-cols-2 gap-3">
                {FEATURED_CREATORS.map((creator, i) => (
                  <CreatorShowcaseCard key={creator.username} creator={creator} index={i} />
                ))}
              </div>

              {/* Floating stats badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-[0_0_30px_rgba(255,46,136,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF2E88] to-[#7C3AED] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-[#A1A1AA]">New followers</div>
                    <div className="text-sm font-bold text-white">+2.4K today</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF2E88] fill-[#FF2E88]" />
                  <div>
                    <div className="text-xs text-[#A1A1AA]">Posts liked</div>
                    <div className="text-sm font-bold text-white">89M this month</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#A1A1AA] uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-[#FF2E88]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative py-16 border-y border-white/6 bg-[#09090B]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E88]/3 via-transparent to-[#7C3AED]/3 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" size="md" className="mb-4" leftIcon={<Zap className="w-3 h-3" />}>
                Everything You Need
              </Badge>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                Built for Creators,{" "}
                <span className="gradient-text">by Creators</span>
              </h2>
              <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
                Every feature is designed to help you grow your audience, showcase your work, and build
                meaningful connections with your fans.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATEGORIES SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#111827]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-poppins)] font-bold text-3xl sm:text-4xl text-white mb-4">
                Explore by <span className="gradient-text">Category</span>
              </h2>
              <p className="text-[#A1A1AA] max-w-xl mx-auto">
                Discover creators across every creative discipline imaginable.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link
                  href={`/categories/${cat.name.toLowerCase().replace(" ", "-")}`}
                  className="group flex flex-col items-center gap-3 p-5 glass rounded-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}30` }}
                  >
                    <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5">{cat.name}</div>
                    <div className="text-xs text-[#A1A1AA]">{cat.count}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E88]/8 via-[#7C3AED]/6 to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,46,136,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(124,58,237,0.08) 0%, transparent 50%)`
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Glow ring */}
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF2E88] to-[#7C3AED] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(255,46,136,0.4)]">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="font-[family-name:var(--font-poppins)] font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Ready to Start{" "}
              <span className="gradient-text">Creating?</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-10 max-w-2xl mx-auto">
              Join over 48,000 creators who are already building their audience on Pinorpinor.
              Your creative journey starts today — completely free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  variant="primary"
                  size="xl"
                  className="shadow-[0_0_60px_rgba(255,46,136,0.4)] hover:shadow-[0_0_80px_rgba(255,46,136,0.6)]"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Create Your Profile — Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="ghost" size="xl">
                  Browse Creators
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

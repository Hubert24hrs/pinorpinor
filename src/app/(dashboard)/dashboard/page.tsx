"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Heart, Eye, Upload, Sparkles, Image as ImageIcon,
  Plus, MessageSquare, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";

const STAT_CARDS = [
  { label: "Total Followers", value: 128400, change: "+12.4%", icon: Users, color: "#FF2E88" },
  { label: "Total Views", value: 892000, change: "+24.8%", icon: Eye, color: "#7C3AED" },
  { label: "Total Likes", value: 45200, change: "+18.2%", icon: Heart, color: "#00E5FF" },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", icon: TrendingUp, color: "#FFD700" },
];

export default function DashboardOverviewPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FF2E88]/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-[family-name:var(--font-poppins)] font-bold text-2xl sm:text-3xl text-white">
              Welcome back, Luna! ✨
            </h1>
          </div>
          <p className="text-[#A1A1AA] text-sm">
            Here's what's happening with your content and audience today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/upload">
            <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
              Upload New Media
            </Button>
          </Link>
          <Link href="/lunavasquez">
            <Button variant="outline" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              View Live Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card glow className="p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#A1A1AA] font-medium">{stat.label}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
                  {typeof stat.value === "number" ? formatNumber(stat.value) : stat.value}
                </span>
                <span className="text-xs font-semibold text-[#00D26A]">{stat.change}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-white/10 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Recent Top Posts</h3>
            <Link href="/dashboard/media" className="text-xs text-[#FF2E88] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-16 h-16 rounded-lg bg-black/40 relative overflow-hidden flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-white/40 absolute inset-0 m-auto" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">Golden hour glow over the pacific coastline 🌅</p>
                  <p className="text-xs text-[#A1A1AA]">Published 4 hours ago</p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-white font-semibold block">3.4K Likes</span>
                  <span className="text-[#A1A1AA]">184 Comments</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audience Insights */}
        <Card className="p-6 border border-white/10">
          <h3 className="font-semibold text-white mb-4">Audience Demographics</h3>
          <div className="space-y-4 text-xs text-[#A1A1AA]">
            <div>
              <div className="flex justify-between mb-1"><span>United States</span><span className="text-white font-semibold">42%</span></div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="w-[42%] h-full bg-[#FF2E88]" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>United Kingdom</span><span className="text-white font-semibold">24%</span></div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="w-[24%] h-full bg-[#7C3AED]" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>Germany</span><span className="text-white font-semibold">15%</span></div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="w-[15%] h-full bg-[#00E5FF]" /></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

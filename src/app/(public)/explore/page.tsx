"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, UserPlus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, VerificationBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Photography",
  "Digital Art",
  "Music",
  "Film",
  "Fashion",
  "Travel",
  "Fitness",
  "Food",
];

const DEMO_CREATORS = [
  {
    id: "1",
    name: "Luna Vasquez",
    username: "lunavasquez",
    bio: "Visual storyteller capturing the beauty of everyday moments.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=300&fit=crop",
    category: "Photography",
    followers: 128400,
    posts: 142,
    verified: true,
  },
  {
    id: "2",
    name: "Kai Okonkwo",
    username: "kaiokonkwo",
    bio: "Filmmaker | Cinematographer | Turning stories into cinema.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&h=300&fit=crop",
    category: "Film",
    followers: 94300,
    posts: 88,
    verified: true,
  },
  {
    id: "3",
    name: "Aria Chen",
    username: "ariachen",
    bio: "Digital artist & illustrator. Creating worlds with pixels.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=300&fit=crop",
    category: "Digital Art",
    followers: 211000,
    posts: 310,
    verified: true,
  },
  {
    id: "4",
    name: "Marcus Bell",
    username: "marcusbell",
    bio: "Music producer & composer crafting soundscapes.",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=300&fit=crop",
    category: "Music",
    followers: 87200,
    posts: 64,
    verified: true,
  },
  {
    id: "5",
    name: "Sofia Reyes",
    username: "sofiareyes",
    bio: "Fashion designer & style curator.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop",
    category: "Fashion",
    followers: 316000,
    posts: 420,
    verified: true,
  },
  {
    id: "6",
    name: "James Nakamura",
    username: "jamesnakamura",
    bio: "Travel photographer & adventure seeker.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=300&fit=crop",
    category: "Travel",
    followers: 154700,
    posts: 195,
    verified: true,
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCreators = DEMO_CREATORS.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-[family-name:var(--font-poppins)] font-bold text-3xl sm:text-4xl text-white mb-2">
          Explore <span className="gradient-text">Creators</span>
        </h1>
        <p className="text-[#A1A1AA] text-base">
          Discover verified talent, trending storytellers, and rising stars.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-6 mb-10">
        <div className="max-w-md">
          <Input
            placeholder="Search by name, handle, or bio..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#FF2E88] to-[#7C3AED] text-white shadow-[0_0_20px_rgba(255,46,136,0.3)]"
                  : "glass text-[#A1A1AA] hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => {
          const isFollowing = followingMap[creator.id];
          return (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Banner */}
              <div className="relative h-28 w-full bg-black/40">
                <Image
                  src={creator.banner}
                  alt={creator.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 relative pt-0">
                <div className="flex justify-between items-end mb-3 -mt-10 relative z-10">
                  <Avatar
                    src={creator.avatar}
                    name={creator.name}
                    size="lg"
                    showRing
                    ringColor="primary"
                  />
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    size="sm"
                    onClick={() => toggleFollow(creator.id)}
                    leftIcon={isFollowing ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Link
                      href={`/${creator.username}`}
                      className="font-[family-name:var(--font-poppins)] font-semibold text-lg text-white hover:text-[#FF2E88] transition-colors"
                    >
                      {creator.name}
                    </Link>
                    {creator.verified && <VerificationBadge size="sm" />}
                  </div>
                  <p className="text-xs text-[#A1A1AA] mb-3">@{creator.username}</p>

                  <p className="text-xs text-white/80 line-clamp-2 mb-4 h-8">
                    {creator.bio}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                    <Badge variant="secondary" size="xs">{creator.category}</Badge>
                    <div className="flex items-center gap-3 text-[#A1A1AA]">
                      <span><strong className="text-white">{formatNumber(creator.followers)}</strong> followers</span>
                      <span><strong className="text-white">{creator.posts}</strong> posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin, Link as LinkIcon, Calendar, UserPlus, Check, MessageCircle,
  Share2, Grid, Image as ImageIcon, Video, UserCheck, Globe, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge, VerificationBadge } from "@/components/ui/badge";
import { PostCard } from "@/components/posts/PostCard";
import { formatNumber } from "@/lib/utils";

// Mock Database for Creator Profiles
const PROFILE_DATA: Record<string, any> = {
  lunavasquez: {
    name: "Luna Vasquez",
    username: "lunavasquez",
    bio: "✨ Visual storyteller capturing the beauty of everyday moments. Photography & digital art.",
    tagline: "Light chaser. Dream maker.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&h=400&fit=crop",
    location: "Los Angeles, CA",
    website: "https://lunavasquez.com",
    joined: "January 2024",
    category: "Photography",
    followers: 128400,
    following: 420,
    postsCount: 142,
    verified: true,
    socials: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
    posts: [
      {
        id: "p1",
        caption: "Golden hour glow over the pacific coastline 🌅 #photography #pinorpinor",
        media: [{ id: "m1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop", type: "image" }],
        likesCount: 3420,
        commentsCount: 184,
        createdAt: new Date(Date.now() - 3600000 * 4),
      },
      {
        id: "p2",
        caption: "Neon reflections in downtown Tokyo streets ✨",
        media: [{ id: "m2", url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop", type: "image" }],
        likesCount: 5210,
        commentsCount: 312,
        createdAt: new Date(Date.now() - 3600000 * 28),
      },
    ]
  }
};

export default function CreatorProfilePage() {
  const params = useParams();
  const username = (params?.username as string) || "lunavasquez";
  const profile = PROFILE_DATA[username] || PROFILE_DATA["lunavasquez"];

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "photos" | "about">("posts");

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-black/60">
        <Image
          src={profile.banner}
          alt={profile.name}
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/30" />
      </div>

      {/* Profile Header Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
          <div className="flex items-end gap-4">
            <Avatar
              src={profile.avatar}
              name={profile.name}
              size="2xl"
              showRing
              ringColor="primary"
              className="ring-4 ring-[#09090B]"
            />
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-poppins)] font-bold text-2xl sm:text-3xl text-white">
                  {profile.name}
                </h1>
                {profile.verified && <VerificationBadge size="md" />}
              </div>
              <p className="text-sm text-[#A1A1AA]">@{profile.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isFollowing ? "outline" : "primary"}
              size="md"
              onClick={() => setIsFollowing(!isFollowing)}
              leftIcon={isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" size="md" leftIcon={<MessageCircle className="w-4 h-4" />}>
              Message
            </Button>
            <Button variant="ghost" size="icon" className="text-[#A1A1AA] hover:text-white">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
          <p className="text-white text-base leading-relaxed mb-4">{profile.bio}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA]">
            <Badge variant="primary" size="sm">{profile.category}</Badge>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
            <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#FF2E88] transition-colors">
              <LinkIcon className="w-3.5 h-3.5" />{profile.website}
            </a>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {profile.joined}</span>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-8 border-t border-white/8 pt-4 mt-6 text-sm">
            <div>
              <span className="font-bold text-white text-lg mr-1.5">{formatNumber(profile.followers)}</span>
              <span className="text-[#A1A1AA]">Followers</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg mr-1.5">{formatNumber(profile.following)}</span>
              <span className="text-[#A1A1AA]">Following</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg mr-1.5">{profile.postsCount}</span>
              <span className="text-[#A1A1AA]">Posts</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/10 mb-8 gap-8">
          {[
            { key: "posts", label: "Posts", icon: Grid },
            { key: "photos", label: "Photos", icon: ImageIcon },
            { key: "about", label: "About", icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-[#FF2E88] text-[#FF2E88]"
                  : "border-transparent text-[#A1A1AA] hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "posts" && (
          <div className="max-w-2xl mx-auto space-y-6">
            {profile.posts.map((post: any) => (
              <PostCard key={post.id} {...post} creator={profile} />
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profile.posts.map((post: any) => (
              <div key={post.id} className="relative aspect-square rounded-xl overflow-hidden glass group">
                <Image src={post.media[0].url} alt="Photo" fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="glass rounded-2xl p-6 space-y-4 text-sm text-[#A1A1AA]">
            <h3 className="text-white font-semibold text-lg">About {profile.name}</h3>
            <p>{profile.bio}</p>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-white font-medium">External Links:</p>
              <div className="flex gap-3 text-white">
                <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-[#FF2E88] flex items-center gap-1"><Camera className="w-4 h-4" /> Instagram</a>
                <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-[#FF2E88] flex items-center gap-1"><Globe className="w-4 h-4" /> Twitter / X</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

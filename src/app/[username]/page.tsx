"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, CheckCircle, Heart, Calendar, MessageSquare, Phone, ShieldCheck,
  Star, Share2, Award, Clock, Sparkles
} from "lucide-react";

const DEMO_PROFILES: Record<string, any> = {
  babygold: {
    name: "Baby-Gold",
    username: "babygold",
    tagline: "Beauty may catch your eye, but personality keeps you here. ✨",
    bio: "Hey handsome! I'm Baby-Gold, an elegant and fun-loving lady based in Ikeja, Lagos. I love fine dining, spontaneous travel, deep conversations, and creating unforgettable memories. Available for dinner dates, VIP events, and travel companionship.",
    location: "Ikeja, Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
    age: 23,
    height: "5'7\"",
    ethnicity: "African",
    availability: "Available Today",
    isRedHot: true,
    isVerified: true,
    rating: 4.9,
    reviewsCount: 38,
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=1000&fit=crop",
    ],
    dateTypes: ["Dinner Dates", "VIP Events", "Travel Companion", "Weekend Getaways"],
    reviews: [
      { id: 1, author: "David K.", rating: 5, date: "2 days ago", comment: "Baby-Gold is an absolute sweetheart! Amazing conversation and effortless charm." },
      { id: 2, author: "Marcus T.", rating: 5, date: "1 week ago", comment: "Punctual, stunning, and wonderful company for my business dinner." },
    ],
  },
};

export default function LadyProfilePage() {
  const params = useParams();
  const username = (params?.username as string) || "babygold";
  const lady = DEMO_PROFILES[username] || DEMO_PROFILES["babygold"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Profile Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Main Gallery Display (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          {/* Main Photo */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden glass border border-white/10 bg-black/60">
            <Image
              src={lady.gallery[activeImageIndex]}
              alt={lady.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {lady.isRedHot && (
              <span className="absolute top-4 right-4 badge-hot text-xs py-1 px-3 shadow-lg shadow-red-500/40 z-10">
                Red 🔥 Hot
              </span>
            )}
            {lady.availability && (
              <span className="absolute bottom-4 left-4 badge-available text-xs py-1 px-3 z-10">
                {lady.availability}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2">
            {lady.gallery.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden glass border-2 transition-all ${
                  activeImageIndex === idx ? "border-[#e91e8c]" : "border-transparent hover:border-white/20"
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Contact Actions (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-['Poppins',sans-serif] font-bold text-2xl text-white">
                    {lady.name}
                  </h1>
                  {lady.isVerified && (
                    <CheckCircle className="w-5 h-5 text-[#22c55e] fill-[#22c55e]/20" />
                  )}
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#71717a] hover:text-[#e91e8c] transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-[#e91e8c] text-[#e91e8c]" : ""}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#e91e8c]" />
                <span>{lady.location}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#22c55e]/10 text-[#22c55e] font-semibold border border-[#22c55e]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {lady.rating} ({lady.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/7 text-xs">
              <div className="bg-[#16131f] p-2.5 rounded-xl">
                <span className="text-[#71717a] block">Age</span>
                <span className="text-white font-semibold">{lady.age} yrs</span>
              </div>
              <div className="bg-[#16131f] p-2.5 rounded-xl">
                <span className="text-[#71717a] block">Height</span>
                <span className="text-white font-semibold">{lady.height}</span>
              </div>
            </div>

            {/* Date Preferences */}
            <div>
              <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-2">
                Date Preferences
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lady.dateTypes.map((type: string) => (
                  <span key={type} className="px-2.5 py-1 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-xs font-medium border border-[#e91e8c]/20">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2.5 pt-2">
              <button className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Book a Date
              </button>
              <button className="btn-outline w-full py-2.5 text-sm flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Send Private Message
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="font-semibold text-sm text-white">About {lady.name}</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">{lady.bio}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base text-white">Verified Reviews</h3>
          <span className="text-xs text-[#e91e8c] font-semibold">{lady.reviewsCount} Guy Reviews</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {lady.reviews.map((rev: any) => (
            <div key={rev.id} className="p-4 rounded-xl bg-[#16131f] border border-white/7 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{rev.author}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>
              <p className="text-[#a1a1aa] leading-relaxed">{rev.comment}</p>
              <span className="text-[10px] text-[#71717a] block">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

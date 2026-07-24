"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Radio, Users, Eye, Play } from "lucide-react";

const LIVE_ROOMS = [
  {
    id: "1",
    name: "Baby-Gold",
    username: "babygold",
    title: "Get ready with me for evening date ✨",
    viewers: 1420,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop",
    location: "Lagos, Nigeria",
  },
  {
    id: "2",
    name: "Maniya",
    username: "maniya",
    title: "Late night vibes & Q&A 💋",
    viewers: 980,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop",
    location: "Abuja, Nigeria",
  },
  {
    id: "3",
    name: "Hotie",
    username: "hotie",
    title: "Planning my weekend trip to Dubai ✈️",
    viewers: 2150,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
    location: "Lagos, Nigeria",
  },
];

export default function LivePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Radio className="w-5 h-5 text-[#ef4444] animate-pulse" />
        <h1 className="font-['Poppins',sans-serif] font-bold text-2xl text-white">
          Live <span className="gradient-text">Streams</span>
        </h1>
        <span className="badge-live text-xs py-1 px-2.5">LIVE NOW</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIVE_ROOMS.map((room) => (
          <Link key={room.id} href={`/live/${room.username}`} className="group block">
            <div className="glass-card rounded-2xl overflow-hidden relative border border-white/7">
              <div className="relative aspect-video w-full bg-black/60">
                <Image src={room.image} alt={room.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="badge-live text-[9px] py-1 px-2">LIVE</span>
                  <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md">
                    <Eye className="w-3 h-3 text-[#ef4444]" /> {room.viewers}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#e91e8c] text-white flex items-center justify-center shadow-lg shadow-pink-500/50">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#16131f]">
                <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-[#e91e8c] transition-colors">{room.title}</h3>
                <p className="text-xs text-[#a1a1aa]">{room.name} • {room.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

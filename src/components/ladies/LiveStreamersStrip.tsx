"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";

export interface LiveStreamer {
  id: string;
  name: string;
  username: string;
  image: string;
}

export function LiveStreamersStrip({ streamers }: { streamers: LiveStreamer[] }) {
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Radio className="w-4 h-4 text-[#ef4444] animate-pulse" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Ladies Live Now
        </h2>
        <span className="badge-live text-[8px] ml-1">LIVE</span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        {streamers.map((streamer) => (
          <Link
            key={streamer.id}
            href={`/live/${streamer.username}`}
            className="group flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            {/* Avatar Ring */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#ef4444] via-[#e91e8c] to-[#7c3aed] shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full relative overflow-hidden bg-black border-2 border-[#0a0a0f]">
                <Image
                  src={streamer.image}
                  alt={streamer.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* LIVE Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-[#0a0a0f] uppercase tracking-wider flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                LIVE
              </div>
            </div>

            <span className="text-[11px] font-medium text-[#a1a1aa] group-hover:text-white transition-colors truncate max-w-[70px] text-center">
              {streamer.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

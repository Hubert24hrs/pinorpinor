"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, Heart, Calendar, MessageSquare,
  ShieldCheck, Star, UserCircle2, ArrowLeft, Loader2, Sparkles
} from "lucide-react";

interface MediaItem {
  id: string;
  mediaType: string;
  storageUrl: string;
}

interface LadyData {
  id: string;
  username: string;
  displayName: string;
  gender: string;
  datingProfile: {
    bio: string | null;
    tagline: string | null;
    age: number | null;
    height: string | null;
    city: string | null;
    country: string | null;
    location: string | null;
    dateTypes: string[];
    isAvailableToday: boolean;
  } | null;
  media: MediaItem[];
}

const NIGERIAN_FALLBACK_PROFILES: Record<string, LadyData> = {
  "zainab_lagos": {
    id: "ng-1",
    username: "zainab_lagos",
    displayName: "Zainab, 24",
    gender: "WOMAN",
    datingProfile: {
      bio: "Fashion entrepreneur based in Victoria Island, Lagos. Love art gallery walks, live afro-beats, rooftop cocktails, and fine dining.",
      tagline: "Rooftop cocktails & seafood dinners in VI",
      age: 24,
      height: "5'8\"",
      city: "Lagos",
      country: "Nigeria",
      location: "Victoria Island, Lagos",
      dateTypes: ["Rooftop Cocktails", "Seafood Dinner", "VIP Event", "Fine Dining"],
      isAvailableToday: true,
    },
    media: [
      { id: "m1", mediaType: "PROFILE_PHOTO", storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
      { id: "m2", mediaType: "GALLERY_PHOTO", storageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  "chioma_abj": {
    id: "ng-2",
    username: "chioma_abj",
    displayName: "Chioma, 25",
    gender: "WOMAN",
    datingProfile: {
      bio: "Architect living in Maitama, Abuja. Live jazz music lover, matcha enthusiast, and fond of evening walks.",
      tagline: "Live jazz & fine dining in Abuja",
      age: 25,
      height: "5'7\"",
      city: "Abuja",
      country: "Nigeria",
      location: "Maitama, Abuja",
      dateTypes: ["Coffee & Walk", "Live Jazz", "Fine Dining"],
      isAvailableToday: true,
    },
    media: [
      { id: "m3", mediaType: "PROFILE_PHOTO", storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  "funke_lekki": {
    id: "ng-3",
    username: "funke_lekki",
    displayName: "Funke, 26",
    gender: "WOMAN",
    datingProfile: {
      bio: "Brand strategist in Lekki Phase 1. Passionate about art exhibitions, sunset beach lounges, and good wine.",
      tagline: "Beach lounges & art exhibitions",
      age: 26,
      height: "5'9\"",
      city: "Lagos",
      country: "Nigeria",
      location: "Lekki Phase 1, Lagos",
      dateTypes: ["Beach Lounge", "Art Exhibition", "Dinner Date"],
      isAvailableToday: false,
    },
    media: [
      { id: "m4", mediaType: "PROFILE_PHOTO", storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  "tunde_abj": {
    id: "ng-4",
    username: "tunde_abj",
    displayName: "Tunde, 28",
    gender: "MAN",
    datingProfile: {
      bio: "Software engineer in Asokoro, Abuja. Passionate about tech, fitness, deep conversations, and rooftop lounges.",
      tagline: "Rooftop lounge & deep conversations",
      age: 28,
      height: "6'1\"",
      city: "Abuja",
      country: "Nigeria",
      location: "Asokoro, Abuja",
      dateTypes: ["Fine Dining", "Cocktails & Conversation"],
      isAvailableToday: true,
    },
    media: [
      { id: "m5", mediaType: "PROFILE_PHOTO", storageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    ],
  },
};

export default function ProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = rawUsername?.toLowerCase();

  const [lady, setLady] = useState<LadyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    // Check Nigerian fallback profiles first
    if (NIGERIAN_FALLBACK_PROFILES[username]) {
      setLady(NIGERIAN_FALLBACK_PROFILES[username]);
      setLoading(false);
      return;
    }

    fetch(`/api/ladies/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.lady) {
          setLady(data.lady);
        } else {
          // Fallback to Zainab if unknown
          setLady(NIGERIAN_FALLBACK_PROFILES["zainab_lagos"]);
        }
      })
      .catch(() => {
        setLady(NIGERIAN_FALLBACK_PROFILES["zainab_lagos"]);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#FF2E63] animate-spin" />
      </div>
    );
  }

  if (!lady) return null;

  const allPhotos = lady.media.length > 0 ? lady.media : [
    { id: "def", mediaType: "PROFILE_PHOTO", storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back button */}
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#FF2E63] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left Column: Gallery Photos */}
        <div className="md:col-span-6 space-y-3">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
            <Image
              src={allPhotos[activeIndex]?.storageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
              alt={lady.displayName}
              fill
              className="object-cover"
              priority
            />

            <div className="absolute top-4 left-4 z-10">
              <span className="badge-verified text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                18+ Verified
              </span>
            </div>
          </div>

          {/* Thumbnail list */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeIndex === idx ? "border-[#FF2E63]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image src={photo.storageUrl} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Date Actions */}
        <div className="md:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
            
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {lady.displayName}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold mt-1">
                  <MapPin className="w-4 h-4 text-[#FF2E63]" />
                  <span>{lady.datingProfile?.location || "Lagos, Nigeria"}</span>
                </div>
              </div>

              <button
                onClick={() => setLiked((v) => !v)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                  liked
                    ? "bg-rose-50 border-[#FF2E63] text-[#FF2E63]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:text-[#FF2E63]"
                }`}
              >
                <Heart className={`w-6 h-6 ${liked ? "fill-[#FF2E63]" : ""}`} />
              </button>
            </div>

            {/* Tagline & Bio */}
            {lady.datingProfile?.tagline && (
              <p className="text-xs font-bold italic text-[#FF2E63] bg-rose-50 p-3 rounded-2xl border border-rose-100">
                &ldquo;{lady.datingProfile.tagline}&rdquo;
              </p>
            )}

            {lady.datingProfile?.bio && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {lady.datingProfile.bio}
              </p>
            )}

            {/* Preferred Date Types */}
            {lady.datingProfile?.dateTypes && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Preferred Date Types:
                </span>
                <div className="flex flex-wrap gap-2">
                  {lady.datingProfile.dateTypes.map((type) => (
                    <span
                      key={type}
                      className="badge-intent text-xs font-bold px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
              <Link href="/messages" className="block">
                <button className="gradient-btn w-full py-3 text-xs font-bold flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message &amp; Propose Date</span>
                </button>
              </Link>
              
              <Link href="/discover" className="block">
                <button className="w-full py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all">
                  Back to Candidates Deck
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

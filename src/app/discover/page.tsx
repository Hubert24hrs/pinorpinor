"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, X, Star, MapPin, ShieldCheck, Sparkles, Loader2,
  Flag, MessageCircle, SlidersHorizontal, User
} from "lucide-react";

interface Candidate {
  id: string;
  displayName: string;
  username: string;
  age: number | null;
  verificationStatus: string;
  datingProfile: {
    bio: string | null;
    tagline: string | null;
    city: string | null;
    country: string | null;
    location: string | null;
    height: string | null;
    relationshipIntent: string | null;
    dateTypes: string[];
    isAvailableToday: boolean;
  } | null;
  media: { storageUrl: string }[];
}

const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    displayName: "Charlotte, 25",
    username: "charlotte_v",
    age: 25,
    verificationStatus: "VERIFIED",
    datingProfile: {
      bio: "Interior designer living in Chelsea. Passionate about art galleries, natural wine, and impromptu weekend trips to Italy.",
      tagline: "Cocktails & Art Gallery walks",
      city: "London",
      country: "UK",
      location: "London, UK",
      height: "5'8\"",
      relationshipIntent: "Serious Relationship",
      dateTypes: ["Cocktails & Jazz", "Art Gallery Walk", "Fine Dining"],
      isAvailableToday: true,
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
      { storageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "cand-2",
    displayName: "Hannah, 24",
    username: "hannah_m",
    age: 24,
    verificationStatus: "VERIFIED",
    datingProfile: {
      bio: "Architect. Love rooftops, matcha lattes, and sunset dinners.",
      tagline: "Rooftop dining & deep conversations",
      city: "New York",
      country: "USA",
      location: "New York, USA",
      height: "5'7\"",
      relationshipIntent: "Dating to Marry",
      dateTypes: ["Rooftop Dinner", "Coffee & Walk"],
      isAvailableToday: false,
    },
    media: [
      { storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
    ],
  },
];

export default function DiscoverPage() {
  const { status } = useSession();
  const router = useRouter();

  const [candidates, setCandidates] = useState<Candidate[]>(SAMPLE_CANDIDATES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swiping, setSwiping] = useState(false);

  const [matchModal, setMatchModal] = useState<{
    matched: boolean;
    matchId?: string;
    conversationId?: string;
    partnerName?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/discover")
      .then((r) => r.json())
      .then((data) => {
        if (data.candidates && data.candidates.length > 0) {
          setCandidates(data.candidates);
        }
      })
      .catch(() => {});
  }, []);

  const currentCandidate = candidates[currentIndex];

  const handleSwipe = async (type: "LIKE" | "DISLIKE" | "SUPERLIKE") => {
    if (!currentCandidate || swiping) return;
    setSwiping(true);

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: currentCandidate.id,
          swipeType: type,
        }),
      });

      const data = await res.json();

      if (data.isMatch) {
        setMatchModal({
          matched: true,
          matchId: data.matchId,
          conversationId: data.conversationId,
          partnerName: currentCandidate.displayName,
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch {
      setCurrentIndex((prev) => prev + 1);
    } finally {
      setSwiping(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Discover Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141419] border border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF4458]" />
          <h1 className="text-lg font-bold text-white tracking-tight">Discover Singles</h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
          <SlidersHorizontal className="w-4 h-4 text-[#FF4458]" />
          <span>Location &amp; Distance: <strong className="text-white">50 miles</strong></span>
        </div>
      </div>

      {/* Main Swipe Deck Container */}
      {!currentCandidate || currentIndex >= candidates.length ? (
        <div className="p-12 text-center rounded-3xl bg-[#141419] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FF4458]/15 flex items-center justify-center text-[#FF4458] mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">You&apos;ve seen everyone nearby!</h2>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
            Expand your discovery filters or check back later for new verified profiles.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="gradient-btn px-6 py-2.5 text-xs font-semibold"
          >
            Review Candidates Again
          </button>
        </div>
      ) : (
        <div className="relative glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#141419]">
          
          {/* Main Photo Card */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0C0C0F]">
            <Image
              src={
                currentCandidate.media[0]?.storageUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              }
              alt={currentCandidate.displayName}
              fill
              className="object-cover"
              priority
            />

            {/* Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0C0C0F] via-[#0C0C0F]/60 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="badge-verified text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                18+ Verified
              </span>

              {currentCandidate.datingProfile?.isAvailableToday && (
                <span className="bg-emerald-500 text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md animate-pulse">
                  Available Today
                </span>
              )}
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {currentCandidate.displayName}
                </h2>
                {currentCandidate.datingProfile?.height && (
                  <span className="text-xs text-[#A1A1AA] font-semibold">
                    {currentCandidate.datingProfile.height}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                <MapPin className="w-4 h-4 text-[#FF4458]" />
                <span>{currentCandidate.datingProfile?.location || "New York, USA"}</span>
              </div>

              {currentCandidate.datingProfile?.tagline && (
                <p className="text-xs text-white/90 font-medium italic">
                  &ldquo;{currentCandidate.datingProfile.tagline}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Extended Bio & Intent */}
          <div className="p-5 space-y-4 bg-[#141419]">
            {currentCandidate.datingProfile?.bio && (
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {currentCandidate.datingProfile.bio}
              </p>
            )}

            {/* Intent & Date Types */}
            {currentCandidate.datingProfile?.dateTypes && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Preferred Date Types:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.datingProfile.dateTypes.map((type) => (
                    <span
                      key={type}
                      className="badge-intent text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Swipe Action Buttons Bar (Tinder / Hinge Style) */}
            <div className="pt-3 flex items-center justify-center gap-6">
              {/* Pass / Dislike */}
              <button
                onClick={() => handleSwipe("DISLIKE")}
                disabled={swiping}
                className="w-14 h-14 rounded-full bg-[#22222E] border border-white/10 hover:border-red-500/50 text-red-400 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                aria-label="Pass"
              >
                <X className="w-7 h-7" />
              </button>

              {/* Superlike */}
              <button
                onClick={() => handleSwipe("SUPERLIKE")}
                disabled={swiping}
                className="w-12 h-12 rounded-full bg-[#22222E] border border-white/10 hover:border-amber-500/50 text-amber-400 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                aria-label="Superlike"
              >
                <Star className="w-6 h-6 fill-amber-400/20" />
              </button>

              {/* Like / Match */}
              <button
                onClick={() => handleSwipe("LIKE")}
                disabled={swiping}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] text-white flex items-center justify-center shadow-xl shadow-[#FF4458]/30 hover:scale-110 active:scale-95 transition-all"
                aria-label="Like"
              >
                <Heart className="w-8 h-8 fill-white" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Match Celebration Modal */}
      {matchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#181820] border border-white/10 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF4458] to-[#FF6B4A] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#FF4458]/40 animate-bounce">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">It&apos;s a Match!</h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                You and <strong className="text-white">{matchModal.partnerName}</strong> liked each other.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link href={`/messages/${matchModal.conversationId}`}>
                <button className="gradient-btn w-full py-3 text-xs font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Send a Message</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  setMatchModal(null);
                  setCurrentIndex((prev) => prev + 1);
                }}
                className="w-full py-2.5 rounded-full border border-white/10 text-xs font-semibold text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

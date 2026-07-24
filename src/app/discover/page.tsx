"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, X, Star, MapPin, ShieldCheck, Sparkles, Loader2, Flag, ShieldAlert
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
    isRedHot: boolean;
  } | null;
  media: { storageUrl: string }[];
}

export default function DiscoverPage() {
  const { status } = useSession();
  const router = useRouter();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [matchModal, setMatchModal] = useState<{
    matched: boolean;
    matchId?: string;
    conversationId?: string;
    partnerName?: string;
  } | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const fetchCandidates = () => {
    setLoading(true);
    fetch("/api/discover")
      .then((r) => r.json())
      .then((data) => {
        setCandidates(data.candidates || []);
        setCurrentIndex(0);
      })
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchCandidates();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  const handleSwipe = async (action: "LIKE" | "PASS" | "SUPERLIKE") => {
    if (!currentCandidate || swiping) return;
    setSwiping(true);

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: currentCandidate.id, action }),
      });

      const data = await res.json();
      if (data.matched) {
        setMatchModal({
          matched: true,
          matchId: data.matchId,
          conversationId: data.conversationId,
          partnerName: currentCandidate.displayName,
        });
      }

      setCurrentIndex((prev) => prev + 1);
    } finally {
      setSwiping(false);
    }
  };

  const handleBlockReport = async (isBlock: boolean) => {
    if (!currentCandidate) return;
    if (isBlock) {
      await fetch("/api/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedUserId: currentCandidate.id }),
      });
    } else {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedUserId: currentCandidate.id,
          reason: reportReason || "Inappropriate profile",
        }),
      });
      setReportModalOpen(false);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-center px-4 py-4 relative">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
          Discover <span className="text-[#C2446E]">Matches</span>
        </h1>
        <button
          onClick={fetchCandidates}
          className="text-xs text-[#C2446E] font-semibold hover:underline"
        >
          Refresh Deck
        </button>
      </div>

      {/* Main Deck Container */}
      {!currentCandidate || currentIndex >= candidates.length ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-lg text-center my-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F4] border border-[#F4B8CB] flex items-center justify-center mx-auto text-[#C2446E]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="font-['Playfair_Display',serif] font-bold text-xl text-[#1A1714]">
            You've seen everyone for now!
          </h2>
          <p className="text-xs text-[#9C948C] max-w-xs mx-auto">
            Check back later for new members or adjust your discovery settings.
          </p>
          <button onClick={fetchCandidates} className="btn-primary text-xs py-2.5 px-6">
            Check Again
          </button>
        </div>
      ) : (
        <div className="relative bg-white rounded-3xl border border-[#E8E2DC] shadow-xl overflow-hidden flex flex-col">
          {/* Main Photo */}
          <div className="relative aspect-[3/4] w-full bg-[#FAF8F5]">
            {currentCandidate.media[0]?.storageUrl ? (
              <Image
                src={currentCandidate.media[0].storageUrl}
                alt={currentCandidate.displayName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9C948C]">
                No Photo Uploaded
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                {currentCandidate.verificationStatus === "VERIFIED" && (
                  <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#2D7A4F] flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {currentCandidate.datingProfile?.isAvailableToday && (
                  <span className="badge-available">Available Today</span>
                )}
              </div>

              {/* Report/Block Trigger */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/80 flex items-center justify-center hover:text-white"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Info over Image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="font-['Playfair_Display',serif] font-bold text-2xl">
                  {currentCandidate.displayName}
                </h2>
                {currentCandidate.age && (
                  <span className="text-xl font-light opacity-90">{currentCandidate.age}</span>
                )}
              </div>

              {currentCandidate.datingProfile?.location && (
                <div className="flex items-center gap-1.5 text-xs text-white/80 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C2446E]" />
                  <span>{currentCandidate.datingProfile.location}</span>
                </div>
              )}

              {currentCandidate.datingProfile?.tagline && (
                <p className="text-xs text-white/90 italic line-clamp-1">
                  "{currentCandidate.datingProfile.tagline}"
                </p>
              )}
            </div>
          </div>

          {/* Details below photo */}
          <div className="p-4 space-y-3 bg-white">
            {currentCandidate.datingProfile?.bio && (
              <p className="text-xs text-[#5C5450] line-clamp-2 leading-relaxed">
                {currentCandidate.datingProfile.bio}
              </p>
            )}

            {currentCandidate.datingProfile?.dateTypes?.length ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentCandidate.datingProfile.dateTypes.map((dt) => (
                  <span
                    key={dt}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FFF0F4] text-[#C2446E] border border-[#F4B8CB]"
                  >
                    {dt}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#E8E2DC]">
              <button
                onClick={() => handleSwipe("PASS")}
                disabled={swiping}
                className="w-14 h-14 rounded-full bg-white border border-[#E8E2DC] shadow-md flex items-center justify-center text-[#B83232] hover:bg-[#FFE8E8] transition-all transform active:scale-95"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleSwipe("SUPERLIKE")}
                disabled={swiping}
                className="w-12 h-12 rounded-full bg-white border border-[#E8E2DC] shadow-md flex items-center justify-center text-[#B5860D] hover:bg-[#FDF3D0] transition-all transform active:scale-95"
              >
                <Star className="w-5 h-5 fill-[#B5860D]" />
              </button>

              <button
                onClick={() => handleSwipe("LIKE")}
                disabled={swiping}
                className="w-14 h-14 rounded-full bg-[#C2446E] text-white shadow-lg shadow-[#C2446E]/30 flex items-center justify-center hover:bg-[#9B2C52] transition-all transform active:scale-95"
              >
                <Heart className="w-7 h-7 fill-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Modal */}
      {matchModal?.matched && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-4 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-[#FFF0F4] border-2 border-[#C2446E] flex items-center justify-center mx-auto text-[#C2446E] shadow-lg">
              <Heart className="w-10 h-10 fill-[#C2446E]" />
            </div>
            <h2 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
              It's a Match! 🎉
            </h2>
            <p className="text-xs text-[#5C5450]">
              You and <strong className="text-[#1A1714]">{matchModal.partnerName}</strong> liked each other!
            </p>
            <div className="space-y-2 pt-2">
              <Link href={`/messages/${matchModal.conversationId}`}>
                <button className="btn-primary w-full py-3 text-xs">
                  Send a Message Now
                </button>
              </Link>
              <button
                onClick={() => setMatchModal(null)}
                className="btn-secondary w-full py-2.5 text-xs"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report / Block Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#B83232]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-[#1A1714]">Safety & Moderation</h3>
            </div>
            <p className="text-xs text-[#5C5450]">
              What action would you like to take regarding {currentCandidate?.displayName}?
            </p>
            <textarea
              placeholder="Reason for report (optional)..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl p-3 text-xs text-[#1A1714] focus:border-[#C2446E] outline-none"
              rows={3}
            />
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => handleBlockReport(false)}
                className="w-full py-2.5 rounded-xl bg-[#FFE8E8] text-[#B83232] text-xs font-semibold hover:bg-[#F8BFC0]"
              >
                Submit Report
              </button>
              <button
                onClick={() => handleBlockReport(true)}
                className="w-full py-2.5 rounded-xl bg-[#1A1714] text-white text-xs font-semibold hover:bg-black"
              >
                Block User
              </button>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-full py-2 rounded-xl text-xs text-[#9C948C] hover:text-[#1A1714]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

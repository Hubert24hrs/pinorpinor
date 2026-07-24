"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, Heart, Calendar, MessageSquare,
  ShieldCheck, Star, UserCircle2, ArrowLeft, Loader2
} from "lucide-react";

interface MediaItem {
  id: string;
  mediaType: string;
  storageUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: { displayName: string | null; username: string | null };
}

interface LadyData {
  id: string;
  username: string;
  displayName: string;
  ladyProfile: {
    bio: string | null;
    tagline: string | null;
    age: number | null;
    height: string | null;
    city: string | null;
    country: string | null;
    location: string | null;
    dateTypes: string[];
    isAvailableToday: boolean;
    isRedHot: boolean;
    viewCount: number;
  } | null;
  media: MediaItem[];
  reviewsReceived: Review[];
  _count: { reviewsReceived: number };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-[#D4CCC4]"}`}
        />
      ))}
    </div>
  );
}

export default function LadyProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [lady, setLady] = useState<LadyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/ladies/${username}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.lady) setLady(data.lady);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const profilePhotos = lady?.media.filter((m) => m.mediaType === "PROFILE_PHOTO") || [];
  const galleryPhotos = lady?.media.filter((m) => m.mediaType === "GALLERY_PHOTO") || [];
  const allPhotos = [...profilePhotos, ...galleryPhotos];

  const avgRating =
    lady?.reviewsReceived && lady.reviewsReceived.length > 0
      ? (
          lady.reviewsReceived.reduce((s, r) => s + r.rating, 0) /
          lady.reviewsReceived.length
        ).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  if (notFound || !lady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <UserCircle2 className="w-20 h-20 text-[#D4CCC4] mb-4" />
        <h2 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714] mb-2">
          Profile not found
        </h2>
        <p className="text-sm text-[#9C948C] mb-6">
          This profile may not exist or is private.
        </p>
        <Link href="/">
          <button className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Gallery (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          {/* Main Photo */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#E8E2DC] bg-[#FAF8F5]">
            {allPhotos[activeIndex] ? (
              <Image
                src={allPhotos[activeIndex].storageUrl}
                alt={lady.displayName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <UserCircle2 className="w-20 h-20 text-[#D4CCC4]" />
                <p className="text-xs text-[#9C948C]">No photos uploaded yet</p>
              </div>
            )}

            {lady.ladyProfile?.isRedHot && (
              <span className="absolute top-4 right-4 badge-hot text-xs py-1 px-3 shadow-md z-10">
                Red 🔥 Hot
              </span>
            )}
            {lady.ladyProfile?.isAvailableToday && (
              <span className="absolute bottom-4 left-4 badge-available text-xs py-1 px-3 z-10">
                Available Today
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allPhotos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allPhotos.slice(0, 8).map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeIndex === idx
                      ? "border-[#C2446E]"
                      : "border-transparent hover:border-[#D4CCC4]"
                  }`}
                >
                  <Image
                    src={photo.storageUrl}
                    alt="Gallery"
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-5">
            {/* Name & like */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
                    {lady.displayName}
                  </h1>
                </div>
                <button
                  onClick={() => setLiked((v) => !v)}
                  className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#9C948C] hover:text-[#C2446E] transition-colors"
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-[#C2446E] text-[#C2446E]" : ""}`} />
                </button>
              </div>

              {lady.ladyProfile?.location && (
                <div className="flex items-center gap-2 text-xs text-[#9C948C] mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#C2446E]" />
                  <span>{lady.ladyProfile.location}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#D4EDDA] text-[#2D7A4F] font-semibold border border-[#A8D5B8] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {avgRating} ({lady._count.reviewsReceived})
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            {(lady.ladyProfile?.age || lady.ladyProfile?.height) && (
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8E2DC] text-xs">
                {lady.ladyProfile?.age && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2DC]">
                    <span className="text-[#9C948C] block">Age</span>
                    <span className="text-[#1A1714] font-semibold">{lady.ladyProfile.age} yrs</span>
                  </div>
                )}
                {lady.ladyProfile?.height && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2DC]">
                    <span className="text-[#9C948C] block">Height</span>
                    <span className="text-[#1A1714] font-semibold">{lady.ladyProfile.height}</span>
                  </div>
                )}
              </div>
            )}

            {/* Date types */}
            {lady.ladyProfile?.dateTypes && lady.ladyProfile.dateTypes.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[#9C948C] uppercase tracking-wider block mb-2">
                  Date Preferences
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lady.ladyProfile.dateTypes.map((type) => (
                    <span key={type} className="px-2.5 py-1 rounded-lg bg-[#FFF0F4] text-[#C2446E] text-xs font-medium border border-[#F4B8CB]">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link href="/discover">
                <button className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" /> Match in Discover
                </button>
              </Link>
            </div>
          </div>

          {/* Bio */}
          {lady.ladyProfile?.bio && (
            <div className="bg-white rounded-2xl p-5 border border-[#E8E2DC] shadow-sm">
              <h3 className="font-semibold text-sm text-[#1A1714] mb-2">About {lady.displayName}</h3>
              <p className="text-xs text-[#5C5450] leading-relaxed">{lady.ladyProfile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {lady.reviewsReceived.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-[#1A1714]">Verified Reviews</h3>
            <span className="text-xs text-[#C2446E] font-semibold">{lady._count.reviewsReceived} reviews</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {lady.reviewsReceived.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1A1714]">
                    {rev.author.displayName || rev.author.username || "Anonymous"}
                  </span>
                  <StarRating rating={rev.rating} />
                </div>
                {rev.comment && (
                  <p className="text-[#5C5450] leading-relaxed">{rev.comment}</p>
                )}
                <span className="text-[10px] text-[#9C948C] block">
                  {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

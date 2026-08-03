"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Share2, Heart, Sparkles, Eye } from "lucide-react";

export interface ProfileCardData {
  id: string;
  username: string;
  displayName: string;
  age?: number | null;
  verificationStatus?: string;
  datingProfile?: {
    tagline?: string | null;
    city?: string | null;
    country?: string | null;
    location?: string | null;
    isAvailableToday?: boolean;
    dateTypes?: string[];
    bio?: string | null;
    isRedHot?: boolean;
  } | null;
  media?: { id?: string; storageUrl: string }[];
}

interface ProfileCardProps {
  profile: ProfileCardData;
  priorityImage?: boolean;
}

export function ProfileCard({ profile, priorityImage = false }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const mainPhoto =
    profile.media && profile.media[0]?.storageUrl
      ? profile.media[0].storageUrl
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/profile/${profile.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVerified = profile.verificationStatus === "VERIFIED";
  const locationText =
    profile.datingProfile?.city ||
    profile.datingProfile?.location ||
    "Lagos, Nigeria";

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col border border-[#E7E3DC] hover:border-[#C2446E]/40 transition-all duration-300 bg-white shadow-sm">
      {/* Profile Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Image
          src={mainPhoto}
          alt={`Profile photo of ${profile.displayName}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priorityImage}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {isVerified ? (
            <span className="badge-verified text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Woman
            </span>
          ) : (
            <span className="badge-rose text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#C2446E]" />
              Approved Member
            </span>
          )}

          {profile.datingProfile?.isAvailableToday && (
            <span className="bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs animate-pulse">
              Available Today
            </span>
          )}
        </div>

        {/* Gradient Overlay for Readable Text */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* Overlay Content */}
        <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1 text-white">
          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${profile.username}`}
              className="font-bold text-base text-white hover:text-[#F4E7B3] transition-colors truncate cursor-pointer flex items-center gap-1.5"
            >
              <span>{profile.displayName}</span>
              {profile.age && <span className="text-white/80 font-normal text-sm">, {profile.age}</span>}
            </Link>

            <button
              onClick={handleShare}
              title={copied ? "Link Copied!" : "Share Profile"}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-200 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="truncate">{locationText}</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        {profile.datingProfile?.tagline ? (
          <p className="text-xs text-stone-600 line-clamp-2 italic leading-relaxed">
            &ldquo;{profile.datingProfile.tagline}&rdquo;
          </p>
        ) : profile.datingProfile?.bio ? (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {profile.datingProfile.bio}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Approved woman member on Pinorpinor.
          </p>
        )}

        {/* Date Types / Interests */}
        {profile.datingProfile?.dateTypes && profile.datingProfile.dateTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.datingProfile.dateTypes.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="badge-rose text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        <div className="pt-1 flex items-center gap-2">
          <Link href={`/profile/${profile.username}`} className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-[#C2446E] hover:text-white border border-stone-200 text-xs font-bold text-stone-800 transition-all cursor-pointer flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>View Profile</span>
            </button>
          </Link>

          <button
            onClick={() => setIsSaved((prev) => !prev)}
            title={isSaved ? "Saved" : "Save for later"}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? "bg-rose-50 border-rose-200 text-[#C2446E]"
                : "bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#C2446E]" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

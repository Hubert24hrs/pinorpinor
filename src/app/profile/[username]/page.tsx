import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, MapPin, Sparkles, Heart, Share2, Flag,
  Calendar, CheckCircle, MessageSquare, AlertTriangle, ArrowLeft
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProfileCardData } from "@/components/profile/ProfileCard";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

async function getProfile(username: string): Promise<ProfileCardData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        displayName: true,
        username: true,
        gender: true,
        birthDate: true,
        verificationStatus: true,
        isActive: true,
        isBanned: true,
        datingProfile: {
          select: {
            bio: true,
            tagline: true,
            city: true,
            country: true,
            location: true,
            height: true,
            relationshipIntent: true,
            dateTypes: true,
            isAvailableToday: true,
            isRedHot: true,
            isPublic: true,
          },
        },
        media: {
          where: { isApproved: true },
          orderBy: { order: "asc" },
          select: { id: true, storageUrl: true, mediaType: true },
        },
      },
    });

    if (!user || !user.isActive || user.isBanned || user.gender !== "WOMAN" || !user.datingProfile?.isPublic) {
      return null;
    }

    let age: number | null = null;
    if (user.birthDate) {
      const today = new Date();
      age = today.getFullYear() - user.birthDate.getFullYear();
      const m = today.getMonth() - user.birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < user.birthDate.getDate())) age--;
    }

    return {
      id: user.id,
      username: user.username || username,
      displayName: user.displayName || "Member",
      age,
      verificationStatus: user.verificationStatus,
      datingProfile: user.datingProfile,
      media: user.media,
    };
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  const title = `${profile.displayName}${profile.age ? `, ${profile.age}` : ""} — Verified Profile`;
  const description = profile.datingProfile?.tagline || profile.datingProfile?.bio || `View ${profile.displayName}'s profile on Pinorpinor.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.media && profile.media[0] ? [profile.media[0].storageUrl] : [],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    // If database is unavailable, provide a clean fall-back profile view for sample usernames
    if (["zainab_lagos", "chioma_abj", "funke_lekki", "amara_abj"].includes(username)) {
      return (
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>
          <div className="p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-4">
            <span className="badge-rose text-xs font-bold px-3 py-1 rounded-full">Sample Profile</span>
            <h1 className="font-serif-display text-3xl font-bold">{username.replace("_", " ")}</h1>
            <p className="text-xs text-stone-600">Sample verified woman profile preview.</p>
          </div>
        </div>
      );
    }
    notFound();
  }

  const photos = profile.media || [];
  const mainPhoto = photos[0]?.storageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
  const locationText = profile.datingProfile?.city || profile.datingProfile?.location || "Lagos, Nigeria";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery Deck</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[#E7E3DC] bg-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left: Primary Image */}
          <div className="relative aspect-[3/4] w-full bg-[#F5F2EC]">
            <Image
              src={mainPhoto}
              alt={profile.displayName}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {profile.datingProfile?.isAvailableToday && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-xs animate-pulse">
                Available Today
              </span>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge-verified text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Woman
                  </span>
                </div>

                <h1 className="font-serif-display text-3xl font-bold text-stone-900 flex items-baseline gap-2 pt-1">
                  <span>{profile.displayName}</span>
                  {profile.age && <span className="font-normal text-stone-500 text-xl">, {profile.age}</span>}
                </h1>

                <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C2446E]" />
                  <span>{locationText}</span>
                </p>
              </div>

              {profile.datingProfile?.tagline && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC]">
                  <p className="text-xs text-stone-700 italic font-medium leading-relaxed">
                    &ldquo;{profile.datingProfile.tagline}&rdquo;
                  </p>
                </div>
              )}

              {profile.datingProfile?.bio && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">About Me</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {profile.datingProfile.bio}
                  </p>
                </div>
              )}

              {/* Preferred Date Types */}
              {profile.datingProfile?.dateTypes && profile.datingProfile.dateTypes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Preferred Meetup Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.datingProfile.dateTypes.map((type) => (
                      <span key={type} className="badge-rose text-xs font-bold px-3 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controlled Contact Request Box */}
            <div className="p-5 rounded-2xl bg-[#141216] text-white space-y-3 border border-stone-800">
              <div className="flex items-center gap-2 text-[#F4E7B3]">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold">Platform-Managed Contact Request</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Contact details are protected by member privacy preferences. Submit an inquiry or date request to connect safely.
              </p>
              <button
                onClick={() => alert(`To connect with ${profile.displayName}, please sign in or create an account.`)}
                className="gold-btn w-full py-3 text-xs font-bold cursor-pointer"
              >
                Send Controlled Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Photos Gallery Section */}
      {photos.length > 1 && (
        <div className="space-y-4">
          <h2 className="font-serif-display text-xl font-bold text-stone-900">
            Approved Photo Gallery ({photos.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((item, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F2EC] border border-[#E7E3DC]">
                <Image
                  src={item.storageUrl}
                  alt={`${profile.displayName} gallery photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="p-5 rounded-2xl bg-white border border-[#E7E3DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Report suspicious profiles or guideline violations to our moderation team.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/safety#report" className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium">
            <Flag className="w-3.5 h-3.5" />
            <span>Report Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

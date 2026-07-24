import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// GET /api/discover — return a paginated deck of candidate profiles
// Filters: gender preference, excludes self + already-swiped + blocked users
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") || "10"));
  const skip = (page - 1) * limit;

  // Get requesting user's preferences
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { gender: true, interestedIn: true },
  });

  if (!me?.interestedIn) {
    return NextResponse.json({ candidates: [], message: "Complete your profile to start discovering." });
  }

  // IDs to exclude: already-swiped users
  const [swipedIds, blockedIds, blockedByIds] = await Promise.all([
    prisma.swipe.findMany({
      where: { fromUserId: userId },
      select: { toUserId: true },
    }),
    prisma.block.findMany({
      where: { blockerId: userId },
      select: { blockedUserId: true },
    }),
    prisma.block.findMany({
      where: { blockedUserId: userId },
      select: { blockerId: true },
    }),
  ]);

  const excludeIds = [
    userId,
    ...swipedIds.map((s) => s.toUserId),
    ...blockedIds.map((b) => b.blockedUserId),
    ...blockedByIds.map((b) => b.blockerId),
  ];

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
      gender: me.interestedIn,
      isActive: true,
      isBanned: false,
      datingProfile: {
        isPublic: true,
        isDiscoverable: true,
      },
    },
    skip,
    take: limit,
    orderBy: [
      { datingProfile: { isRedHot: "desc" } },
      { datingProfile: { isAvailableToday: "desc" } },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      displayName: true,
      username: true,
      birthDate: true,
      verificationStatus: true,
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
          // Note: lat/lng intentionally excluded from select
        },
      },
      media: {
        where: { mediaType: "PROFILE_PHOTO", isApproved: true },
        orderBy: { order: "asc" },
        take: 3,
        select: { storageUrl: true },
      },
    },
  });

  // Compute age server-side, never trust client
  const enriched = candidates.map((c) => {
    const age = c.birthDate
      ? (() => {
          const today = new Date();
          let a = today.getFullYear() - c.birthDate!.getFullYear();
          const m = today.getMonth() - c.birthDate!.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < c.birthDate!.getDate())) a--;
          return a;
        })()
      : null;
    const { birthDate, ...rest } = c;
    return { ...rest, age };
  });

  return NextResponse.json({ candidates: enriched, page, limit });
}

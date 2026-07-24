import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// GET /api/matches — list current user's active matches with partner info
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
      unmatchedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      userA: {
        select: {
          id: true,
          displayName: true,
          username: true,
          verificationStatus: true,
          datingProfile: { select: { city: true, isAvailableToday: true } },
          media: {
            where: { mediaType: "PROFILE_PHOTO", isApproved: true },
            orderBy: { order: "asc" },
            take: 1,
            select: { storageUrl: true },
          },
        },
      },
      userB: {
        select: {
          id: true,
          displayName: true,
          username: true,
          verificationStatus: true,
          datingProfile: { select: { city: true, isAvailableToday: true } },
          media: {
            where: { mediaType: "PROFILE_PHOTO", isApproved: true },
            orderBy: { order: "asc" },
            take: 1,
            select: { storageUrl: true },
          },
        },
      },
      conversation: {
        select: {
          id: true,
          updatedAt: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderId: true },
          },
        },
      },
    },
  });

  // Shape: partner is whichever user is not the requester
  const shaped = matches.map((m) => {
    const partner = m.userAId === userId ? m.userB : m.userA;
    const lastMessage = m.conversation.messages[0] || null;
    return {
      matchId: m.id,
      conversationId: m.conversationId,
      createdAt: m.createdAt,
      partner,
      lastMessage,
      conversationUpdatedAt: m.conversation.updatedAt,
    };
  });

  return NextResponse.json({ matches: shaped });
}

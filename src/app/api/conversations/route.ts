import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// GET /api/conversations — list conversations for current user
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const memberships = await prisma.conversationMember.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          members: {
            where: { userId: { not: userId } },
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  username: true,
                  verificationStatus: true,
                  datingProfile: { select: { isAvailableToday: true } },
                  media: {
                    where: { mediaType: "PROFILE_PHOTO", isApproved: true },
                    orderBy: { order: "asc" },
                    take: 1,
                    select: { storageUrl: true },
                  },
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderId: true, isDeleted: true },
          },
          match: {
            select: { id: true, unmatchedAt: true },
          },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  const conversations = memberships.map((m) => {
    const partner = m.conversation.members[0]?.user || null;
    const lastMessage = m.conversation.messages[0] || null;
    const match = m.conversation.match;
    return {
      conversationId: m.conversationId,
      lastReadAt: m.lastReadAt,
      partner,
      lastMessage,
      matchId: match?.id || null,
      isUnmatched: !!match?.unmatchedAt,
      updatedAt: m.conversation.updatedAt,
    };
  });

  return NextResponse.json({ conversations });
}

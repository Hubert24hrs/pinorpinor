import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { swipeSchema } from "@/lib/validations/swipe";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const body = await req.json();

  const parsed = swipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { targetUserId, action } = parsed.data;

  if (targetUserId === userId) {
    return NextResponse.json({ error: "Cannot swipe on yourself" }, { status: 400 });
  }

  // Check target user exists and is not blocked
  const [targetUser, isBlocked] = await Promise.all([
    prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, isActive: true } }),
    prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: targetUserId },
          { blockerId: targetUserId, blockedUserId: userId },
        ],
      },
    }),
  ]);

  if (!targetUser?.isActive) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (isBlocked) {
    return NextResponse.json({ error: "Cannot swipe on this user" }, { status: 403 });
  }

  // Upsert the swipe record
  await prisma.swipe.upsert({
    where: { fromUserId_toUserId: { fromUserId: userId, toUserId: targetUserId } },
    create: { fromUserId: userId, toUserId: targetUserId, action },
    update: { action },
  });

  // Check for mutual LIKE (only if current action is LIKE or SUPERLIKE)
  if (action === "LIKE" || action === "SUPERLIKE") {
    const mutualSwipe = await prisma.swipe.findFirst({
      where: {
        fromUserId: targetUserId,
        toUserId: userId,
        action: { in: ["LIKE", "SUPERLIKE"] },
      },
    });

    if (mutualSwipe) {
      // Check if a match already exists
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { userAId: userId, userBId: targetUserId },
            { userAId: targetUserId, userBId: userId },
          ],
        },
      });

      if (!existingMatch) {
        // Create Match + Conversation + ConversationMembers in a transaction
        const result = await prisma.$transaction(async (tx) => {
          const conversation = await tx.conversation.create({ data: {} });

          await tx.conversationMember.createMany({
            data: [
              { conversationId: conversation.id, userId },
              { conversationId: conversation.id, userId: targetUserId },
            ],
          });

          const match = await tx.match.create({
            data: {
              userAId: userId,
              userBId: targetUserId,
              conversationId: conversation.id,
            },
          });

          // Notify both users
          await tx.notification.createMany({
            data: [
              {
                userId,
                type: "MATCH",
                title: "It's a Match! 🎉",
                body: "You matched with someone new. Say hello!",
                data: { matchId: match.id, conversationId: conversation.id, withUserId: targetUserId },
              },
              {
                userId: targetUserId,
                type: "MATCH",
                title: "It's a Match! 🎉",
                body: "You matched with someone new. Say hello!",
                data: { matchId: match.id, conversationId: conversation.id, withUserId: userId },
              },
            ],
          });

          return { match, conversation };
        });

        return NextResponse.json({
          matched: true,
          matchId: result.match.id,
          conversationId: result.match.conversationId,
        });
      }

      return NextResponse.json({
        matched: true,
        matchId: existingMatch.id,
        conversationId: existingMatch.conversationId,
      });
    }
  }

  return NextResponse.json({ matched: false });
}

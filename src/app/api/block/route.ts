import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { z } from "zod";

const blockSchema = z.object({
  blockedUserId: z.string().min(1),
});

// POST /api/block — block a user
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const blockerId = session!.user.id;
  const body = await req.json();

  const parsed = blockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { blockedUserId } = parsed.data;
  if (blockedUserId === blockerId) {
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });
  }

  // Create block record & automatically unmatch if there's an existing match
  await prisma.$transaction(async (tx) => {
    await tx.block.upsert({
      where: { blockerId_blockedUserId: { blockerId, blockedUserId } },
      create: { blockerId, blockedUserId },
      update: {},
    });

    const match = await tx.match.findFirst({
      where: {
        OR: [
          { userAId: blockerId, userBId: blockedUserId },
          { userAId: blockedUserId, userBId: blockerId },
        ],
        unmatchedAt: null,
      },
    });

    if (match) {
      await tx.match.update({
        where: { id: match.id },
        data: { unmatchedAt: new Date(), unmatchedBy: blockerId },
      });
    }
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/block — unblock a user
export async function DELETE(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const blockerId = session!.user.id;
  const { searchParams } = new URL(req.url);
  const blockedUserId = searchParams.get("blockedUserId");

  if (!blockedUserId) {
    return NextResponse.json({ error: "blockedUserId query parameter required" }, { status: 400 });
  }

  await prisma.block.deleteMany({
    where: { blockerId, blockedUserId },
  });

  return NextResponse.json({ success: true });
}

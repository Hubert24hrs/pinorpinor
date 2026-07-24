import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// DELETE /api/matches/[matchId] — unmatch
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const { matchId } = await params;

  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.userAId !== userId && match.userBId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (match.unmatchedAt) {
    return NextResponse.json({ error: "Already unmatched" }, { status: 400 });
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { unmatchedAt: new Date(), unmatchedBy: userId },
  });

  return NextResponse.json({ success: true });
}

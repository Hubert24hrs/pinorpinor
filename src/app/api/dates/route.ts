import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { dateProposalSchema } from "@/lib/validations/date-proposal";

// POST /api/dates — propose a date inside a match
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const body = await req.json();

  const parsed = dateProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { matchId, proposedTime, locationName, locationNote } = parsed.data;

  // Validate match ownership & active status
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { userAId: true, userBId: true, unmatchedAt: true, conversationId: true },
  });

  if (!match || (match.userAId !== userId && match.userBId !== userId)) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }
  if (match.unmatchedAt) {
    return NextResponse.json({ error: "Cannot propose date on unmatched pair" }, { status: 400 });
  }

  const dateProposal = await prisma.dateProposal.create({
    data: {
      matchId,
      proposedByUserId: userId,
      proposedTime: new Date(proposedTime),
      locationName,
      locationNote,
      status: "PENDING",
    },
  });

  // Notify recipient
  const recipientId = match.userAId === userId ? match.userBId : match.userAId;
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "DATE_PROPOSAL",
      title: "Date Proposal 🌹",
      body: `You received a date proposal at ${locationName}!`,
      data: { proposalId: dateProposal.id, matchId, conversationId: match.conversationId },
    },
  });

  return NextResponse.json({ proposal: dateProposal }, { status: 201 });
}

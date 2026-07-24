import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { dateResponseSchema } from "@/lib/validations/date-proposal";

// PATCH /api/dates/[id] — accept, decline, reschedule, or cancel a date proposal
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const { id: proposalId } = await params;

  const body = await req.json();
  const parsed = dateResponseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { status, proposedTime, locationName, locationNote } = parsed.data;

  const proposal = await prisma.dateProposal.findUnique({
    where: { id: proposalId },
    include: {
      match: { select: { userAId: true, userBId: true, conversationId: true } },
    },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Date proposal not found" }, { status: 404 });
  }

  const isProposer = proposal.proposedByUserId === userId;
  const isParticipant = proposal.match.userAId === userId || proposal.match.userBId === userId;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if ((status === "ACCEPTED" || status === "DECLINED" || status === "RESCHEDULED") && isProposer) {
    return NextResponse.json({ error: "Only the recipient can respond to this date proposal" }, { status: 400 });
  }

  if (status === "CANCELLED" && !isProposer) {
    return NextResponse.json({ error: "Only the proposer can cancel this date proposal" }, { status: 400 });
  }

  const updatedData: any = { status };
  if (status === "RESCHEDULED") {
    if (proposedTime) updatedData.proposedTime = new Date(proposedTime);
    if (locationName) updatedData.locationName = locationName;
    if (locationNote !== undefined) updatedData.locationNote = locationNote;
    updatedData.proposedByUserId = userId;
  }

  const updatedProposal = await prisma.dateProposal.update({
    where: { id: proposalId },
    data: updatedData,
  });

  const recipientId = proposal.match.userAId === userId ? proposal.match.userBId : proposal.match.userAId;
  const title = status === "ACCEPTED" ? "Date Accepted! 💖" : status === "DECLINED" ? "Date Declined" : status === "RESCHEDULED" ? "Date Rescheduled" : "Date Cancelled";

  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: status === "ACCEPTED" ? "DATE_ACCEPTED" : status === "DECLINED" ? "DATE_DECLINED" : "DATE_PROPOSAL",
      title,
      body: `Status for date at ${proposal.locationName} is now ${status}.`,
      data: { proposalId, matchId: proposal.matchId, conversationId: proposal.match.conversationId },
    },
  });

  return NextResponse.json({ proposal: updatedProposal });
}

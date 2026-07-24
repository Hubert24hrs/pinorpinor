import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { z } from "zod";

const reportSchema = z.object({
  reportedUserId: z.string().min(1),
  reason: z.string().min(1).max(100),
  details: z.string().max(1000).optional(),
});

// POST /api/report — report a user
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const reporterId = session!.user.id;
  const body = await req.json();

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { reportedUserId, reason, details } = parsed.data;

  if (reportedUserId === reporterId) {
    return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedUserId,
      reason,
      details,
    },
  });

  return NextResponse.json({ success: true, reportId: report.id }, { status: 201 });
}

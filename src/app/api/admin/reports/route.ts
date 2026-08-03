import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const role = session?.user?.role as string | undefined;
  if (!role || !["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const reports = await prisma.report.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        reason: true,
        details: true,
        isResolved: true,
        createdAt: true,
        reporter: { select: { displayName: true } },
        reported: { select: { displayName: true, username: true } },
      },
    });
    const normalized = reports.map((r) => ({
      ...r,
      status: r.isResolved ? "RESOLVED" : "OPEN",
    }));
    return NextResponse.json({ reports: normalized });
  } catch (err) {
    console.error("Admin reports fetch error:", err);
    return NextResponse.json({ reports: [] });
  }
}

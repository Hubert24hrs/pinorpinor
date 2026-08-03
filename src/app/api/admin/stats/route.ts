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
    const [pendingProfiles, approvedProfiles, totalMembers, openReports] = await Promise.all([
      prisma.user.count({
        where: { verificationStatus: "PENDING", gender: "WOMAN", isBanned: false },
      }),
      prisma.user.count({
        where: { verificationStatus: "VERIFIED", gender: "WOMAN", isBanned: false },
      }),
      prisma.user.count({ where: { isBanned: false } }),
      prisma.report.count({ where: { isResolved: false } }),
    ]);

    return NextResponse.json({
      pendingProfiles,
      approvedProfiles,
      totalMembers,
      openReports,
      pendingMedia: 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({
      pendingProfiles: 0, approvedProfiles: 0, totalMembers: 0,
      openReports: 0, pendingMedia: 0,
    });
  }
}

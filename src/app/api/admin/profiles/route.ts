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

  const { searchParams } = new URL(req.url);
  const profileStatus = searchParams.get("status") || "PENDING";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") || "10"));
  const skip = (page - 1) * limit;

  const verificationFilter =
    profileStatus === "PENDING" ? "PENDING" :
    profileStatus === "APPROVED" ? "VERIFIED" : "PENDING";

  try {
    const [total, profiles] = await Promise.all([
      prisma.user.count({
        where: { verificationStatus: verificationFilter, gender: "WOMAN" },
      }),
      prisma.user.findMany({
        where: { verificationStatus: verificationFilter, gender: "WOMAN" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          displayName: true,
          username: true,
          email: true,
          createdAt: true,
          verificationStatus: true,
          datingProfile: {
            select: { bio: true, tagline: true, city: true, isPublic: true },
          },
          media: {
            where: { isApproved: false },
            take: 4,
            select: { id: true, storageUrl: true, mediaType: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ profiles, total, page, limit });
  } catch (err) {
    console.error("Admin profiles fetch error:", err);
    return NextResponse.json({ profiles: [], total: 0, page, limit });
  }
}

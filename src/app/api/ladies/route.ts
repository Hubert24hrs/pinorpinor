import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const available = searchParams.get("available");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const skip = (page - 1) * limit;

    const where: any = {
      role: "WOMAN",
      isActive: true,
      isBanned: false,
      datingProfile: {
        isPublic: true,
      },
      media: {
        some: { mediaType: "PROFILE_PHOTO", isApproved: true },
      },
    };

    if (city) {
      where.datingProfile = { ...where.datingProfile, city };
    }
    if (available === "true") {
      where.datingProfile = { ...where.datingProfile, isAvailableToday: true };
    }

    const [ladies, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { datingProfile: { isRedHot: "desc" } },
          { datingProfile: { isAvailableToday: "desc" } },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          username: true,
          displayName: true,
          datingProfile: {
            select: {
              tagline: true,
              city: true,
              country: true,
              location: true,
              isAvailableToday: true,
              isRedHot: true,
              isLiveNow: true,
            },
          },
          media: {
            where: { mediaType: "PROFILE_PHOTO", isApproved: true },
            orderBy: { order: "asc" },
            take: 1,
            select: { storageUrl: true },
          },
          _count: {
            select: { reviewsReceived: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Map datingProfile -> ladyProfile key for home page UI compatibility
    const mapped = ladies.map((l) => {
      const { datingProfile, ...rest } = l;
      return { ...rest, ladyProfile: datingProfile };
    });

    return NextResponse.json({
      ladies: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/ladies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ladies" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: {
        username,
        role: "WOMAN",
        isActive: true,
        isBanned: false,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        datingProfile: {
          select: {
            bio: true,
            tagline: true,
            height: true,
            city: true,
            country: true,
            location: true,
            dateTypes: true,
            isAvailableToday: true,
            isRedHot: true,
            isLiveNow: true,
            viewCount: true,
          },
        },
        media: {
          where: { isApproved: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            mediaType: true,
            storageUrl: true,
            thumbnailUrl: true,
            width: true,
            height: true,
            duration: true,
          },
        },
        reviewsReceived: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: { select: { displayName: true, username: true } },
          },
        },
        _count: {
          select: { reviewsReceived: true },
        },
      },
    });

    if (!user || !user.datingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Increment viewCount
    await prisma.datingProfile.update({
      where: { userId: user.id },
      data: { viewCount: { increment: 1 } },
    });

    const { datingProfile, ...rest } = user;

    return NextResponse.json({
      lady: { ...rest, ladyProfile: datingProfile },
    });
  } catch (error: any) {
    console.error("GET /api/ladies/[username] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        displayName: true,
        username: true,
        gender: true,
        role: true,
        birthDate: true,
        verificationStatus: true,
        isActive: true,
        isBanned: true,
        createdAt: true,
        datingProfile: {
          select: {
            bio: true,
            tagline: true,
            city: true,
            country: true,
            location: true,
            height: true,
            ethnicity: true,
            relationshipIntent: true,
            dateTypes: true,
            prompts: true,
            isAvailableToday: true,
            isRedHot: true,
            isPublic: true,
            isDiscoverable: true,
          },
        },
        media: {
          where: { isApproved: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            storageUrl: true,
            thumbnailUrl: true,
            mediaType: true,
            order: true,
          },
        },
      },
    });

    // Enforcement: profile must be active, not banned, female, and public
    if (
      !user ||
      !user.isActive ||
      user.isBanned ||
      user.gender !== "WOMAN" ||
      !user.datingProfile?.isPublic
    ) {
      return NextResponse.json({ error: "Profile not found or not available" }, { status: 404 });
    }

    let age: number | null = null;
    if (user.birthDate) {
      const today = new Date();
      age = today.getFullYear() - user.birthDate.getFullYear();
      const m = today.getMonth() - user.birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < user.birthDate.getDate())) age--;
    }

    const { birthDate, ...publicProfile } = user;

    return NextResponse.json({ profile: { ...publicProfile, age } });
  } catch (error) {
    console.error("Public single profile API error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

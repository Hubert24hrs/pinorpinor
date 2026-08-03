import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const ageMin = parseInt(searchParams.get("ageMin") || "18");
    const ageMax = parseInt(searchParams.get("ageMax") || "99");
    const verifiedOnly = searchParams.get("verified") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(30, parseInt(searchParams.get("limit") || "12"));
    const skip = (page - 1) * limit;

    // Strict filter: WOMAN gender, active, not banned, discoverable
    const whereCondition: any = {
      gender: "WOMAN",
      isActive: true,
      isBanned: false,
      datingProfile: {
        isPublic: true,
        isDiscoverable: true,
      },
    };

    if (city && city !== "ALL" && city !== "All Locations") {
      whereCondition.datingProfile.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (verifiedOnly) {
      whereCondition.verificationStatus = "VERIFIED";
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where: whereCondition }),
      prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: [
          { datingProfile: { isRedHot: "desc" } },
          { datingProfile: { isAvailableToday: "desc" } },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          displayName: true,
          username: true,
          birthDate: true,
          verificationStatus: true,
          createdAt: true,
          datingProfile: {
            select: {
              bio: true,
              tagline: true,
              city: true,
              country: true,
              location: true,
              height: true,
              relationshipIntent: true,
              dateTypes: true,
              isAvailableToday: true,
              isRedHot: true,
            },
          },
          media: {
            where: { isApproved: true },
            orderBy: { order: "asc" },
            take: 4,
            select: {
              id: true,
              storageUrl: true,
              mediaType: true,
            },
          },
        },
      }),
    ]);

    // Calculate age server-side, never expose raw birthDate in response
    const profiles = users.map((u) => {
      let age: number | null = null;
      if (u.birthDate) {
        const today = new Date();
        age = today.getFullYear() - u.birthDate.getFullYear();
        const m = today.getMonth() - u.birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < u.birthDate.getDate())) age--;
      }

      // Age safety enforcement: filter out under-18 if any exist
      if (age !== null && age < 18) return null;

      const { birthDate, ...publicData } = u;
      return { ...publicData, age };
    }).filter(Boolean);

    return NextResponse.json({
      profiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Public profiles API error:", error);
    // Return empty fallback array rather than breaking UI on database connection errors
    return NextResponse.json({
      profiles: [],
      pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
    });
  }
}

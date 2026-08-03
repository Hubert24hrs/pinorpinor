import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_CITIES = [
  { city: "Lagos", count: 18, highlight: "Victoria Island, Lekki & Ikeja" },
  { city: "Abuja", count: 12, highlight: "Maitama, Asokoro & Gwarinpa" },
  { city: "Port Harcourt", count: 8, highlight: "GRA Phase 1 & 2" },
  { city: "Ibadan", count: 5, highlight: "Bodija & Oluyole" },
  { city: "Enugu", count: 4, highlight: "Independence Layout" },
  { city: "Benin City", count: 3, highlight: "GRA & Airport Road" },
];

export async function GET() {
  try {
    const cityGroups = await prisma.datingProfile.groupBy({
      by: ["city"],
      where: {
        isPublic: true,
        isDiscoverable: true,
        city: { not: null },
        user: {
          gender: "WOMAN",
          isActive: true,
          isBanned: false,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          city: "desc",
        },
      },
      take: 12,
    });

    if (cityGroups.length > 0) {
      const locations = cityGroups.map((g) => ({
        city: g.city,
        count: g._count._all,
      }));
      return NextResponse.json({ locations });
    }

    return NextResponse.json({ locations: FALLBACK_CITIES });
  } catch (error) {
    console.error("Public locations API error:", error);
    return NextResponse.json({ locations: FALLBACK_CITIES });
  }
}

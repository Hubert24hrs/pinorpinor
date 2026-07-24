import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session.user.id;
  const body = await req.json();

  const { bio, tagline, city, country, location, height, dateTypes, isAvailableToday } = body;

  const profile = await prisma.datingProfile.upsert({
    where: { userId },
    create: {
      userId,
      bio,
      tagline,
      city,
      country,
      location,
      height,
      dateTypes: dateTypes || [],
      isAvailableToday: !!isAvailableToday,
    },
    update: {
      bio,
      tagline,
      city,
      country,
      location,
      height,
      dateTypes: dateTypes || [],
      isAvailableToday: !!isAvailableToday,
    },
  });

  return NextResponse.json({ profile });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { profileUpdateSchema } from "@/lib/validations/profile";

// GET /api/profile — return own full profile
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      username: true,
      role: true,
      gender: true,
      interestedIn: true,
      birthDate: true,
      verificationStatus: true,
      createdAt: true,
      datingProfile: true,
      media: {
        where: { isApproved: true },
        orderBy: [{ mediaType: "asc" }, { order: "asc" }],
        select: { id: true, mediaType: true, storageUrl: true, order: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Never expose lat/lng to client
  const { datingProfile, ...rest } = user;
  const safeProfile = datingProfile
    ? (({ lat, lng, ...p }) => p)(datingProfile as any)
    : null;

  return NextResponse.json({ user: { ...rest, datingProfile: safeProfile } });
}

// PATCH /api/profile — update own profile
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const { displayName, ...profileFields } = parsed.data;

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: displayName ? { displayName } : {},
      select: { id: true, displayName: true },
    }),
    prisma.datingProfile.upsert({
      where: { userId },
      create: { userId, ...profileFields },
      update: profileFields,
    }),
  ]);

  return NextResponse.json({ success: true, displayName: updatedUser.displayName });
}

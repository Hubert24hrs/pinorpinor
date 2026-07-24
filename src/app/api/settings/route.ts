import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { z } from "zod";

const settingsSchema = z.object({
  notifyOnMatch: z.boolean().optional(),
  notifyOnMessage: z.boolean().optional(),
  notifyOnDateProposal: z.boolean().optional(),
  notifyOnLike: z.boolean().optional(),
  showInDiscovery: z.boolean().optional(),
  showDistance: z.boolean().optional(),
  maxDistanceKm: z.number().min(1).max(500).optional(),
  ageRangeMin: z.number().min(18).max(100).optional(),
  ageRangeMax: z.number().min(18).max(100).optional(),
});

// GET /api/settings — get settings & blocked users list
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const [settings, blocks] = await Promise.all([
    prisma.settings.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }),
    prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: { id: true, displayName: true, username: true },
        },
      },
    }),
  ]);

  return NextResponse.json({ settings, blockedUsers: blocks.map((b) => b.blocked) });
}

// PATCH /api/settings — update settings
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const body = await req.json();

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const updatedSettings = await prisma.settings.upsert({
    where: { userId },
    create: { userId, ...parsed.data },
    update: parsed.data,
  });

  // If showInDiscovery is changed, reflect it on DatingProfile as well
  if (parsed.data.showInDiscovery !== undefined) {
    await prisma.datingProfile.updateMany({
      where: { userId },
      data: { isDiscoverable: parsed.data.showInDiscovery },
    });
  }

  return NextResponse.json({ settings: updatedSettings });
}

// DELETE /api/settings — deactivate account
export async function DELETE() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true, message: "Account deactivated" });
}

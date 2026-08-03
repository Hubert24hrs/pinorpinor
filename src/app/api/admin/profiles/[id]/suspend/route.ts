import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const role = session?.user?.role as string | undefined;
  if (!role || !["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.user.update({
      where: { id },
      data: { isBanned: true, isActive: false },
    });

    return NextResponse.json({ success: true, message: "Account suspended." });
  } catch (err) {
    console.error("Profile suspend error:", err);
    return NextResponse.json({ error: "Failed to suspend profile" }, { status: 500 });
  }
}

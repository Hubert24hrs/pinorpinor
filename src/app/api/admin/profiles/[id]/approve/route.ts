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
      data: { verificationStatus: "VERIFIED", isActive: true },
    });

    return NextResponse.json({ success: true, message: "Profile approved and published." });
  } catch (err) {
    console.error("Profile approve error:", err);
    return NextResponse.json({ error: "Failed to approve profile" }, { status: 500 });
  }
}

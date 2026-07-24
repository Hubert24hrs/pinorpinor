import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import type { MediaType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const {
      storageKey,
      mediaType,
      mimeType,
      fileSize,
      width,
      height,
      duration,
      order,
    } = await req.json();

    if (!storageKey || !mediaType) {
      return NextResponse.json(
        { error: "storageKey and mediaType are required" },
        { status: 400 }
      );
    }

    const storageUrl = getPublicUrl(storageKey);

    const media = await prisma.media.create({
      data: {
        userId,
        mediaType: mediaType as MediaType,
        storageKey,
        storageUrl,
        mimeType: mimeType || null,
        fileSize: fileSize || null,
        width: width || null,
        height: height || null,
        duration: duration || null,
        order: order || 0,
        isApproved: true,
      },
    });

    return NextResponse.json({ media });
  } catch (error: any) {
    console.error("upload confirm error:", error);
    return NextResponse.json(
      { error: "Failed to save media metadata" },
      { status: 500 }
    );
  }
}

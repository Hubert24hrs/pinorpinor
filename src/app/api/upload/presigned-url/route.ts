import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import {
  generateStorageKey,
  createSignedUploadUrl,
  getPublicUrl,
  validateMimeType,
  validateFileSize,
  MAX_PROFILE_PHOTOS,
  MAX_GALLERY_PHOTOS,
  MAX_VIDEOS,
  ALLOWED_IMAGE_TYPES,
} from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth guard — only logged-in ladies can upload
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "LADY") {
      return NextResponse.json(
        { error: "Only lady accounts can upload media" },
        { status: 403 }
      );
    }

    const { mimeType, fileSize, mediaType } = await req.json();

    // 2. Validate MIME type
    if (!validateMimeType(mimeType)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed: jpg, png, webp, heic, mp4, mov, webm`,
        },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (!validateFileSize(mimeType, fileSize)) {
      const limitMB = ALLOWED_IMAGE_TYPES.includes(mimeType) ? 15 : 200;
      return NextResponse.json(
        { error: `File too large. Maximum size: ${limitMB}MB` },
        { status: 400 }
      );
    }

    // 4. Validate media type and enforce per-user limits
    const userId = session.user.id;

    if (mediaType === "PROFILE_PHOTO") {
      const count = await prisma.media.count({
        where: { userId, mediaType: "PROFILE_PHOTO" },
      });
      if (count >= MAX_PROFILE_PHOTOS) {
        return NextResponse.json(
          { error: `Maximum ${MAX_PROFILE_PHOTOS} profile photos allowed` },
          { status: 400 }
        );
      }
    } else if (mediaType === "GALLERY_PHOTO") {
      const count = await prisma.media.count({
        where: { userId, mediaType: "GALLERY_PHOTO" },
      });
      if (count >= MAX_GALLERY_PHOTOS) {
        return NextResponse.json(
          { error: `Maximum ${MAX_GALLERY_PHOTOS} gallery photos allowed` },
          { status: 400 }
        );
      }
    } else if (mediaType === "VIDEO") {
      const count = await prisma.media.count({
        where: { userId, mediaType: "VIDEO" },
      });
      if (count >= MAX_VIDEOS) {
        return NextResponse.json(
          { error: `Maximum ${MAX_VIDEOS} videos allowed` },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
    }

    // 5. Generate storage key
    const folderMap: Record<string, "profile" | "gallery" | "video"> = {
      PROFILE_PHOTO: "profile",
      GALLERY_PHOTO: "gallery",
      VIDEO: "video",
    };
    const storageKey = generateStorageKey(userId, folderMap[mediaType], mimeType);

    // 6. Create signed upload URL
    const { signedUrl } = await createSignedUploadUrl(storageKey);

    // 7. Pre-compute public CDN URL
    const publicUrl = getPublicUrl(storageKey);

    return NextResponse.json({
      signedUrl,
      storageKey,
      publicUrl,
    });
  } catch (error: any) {
    console.error("presigned-url error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

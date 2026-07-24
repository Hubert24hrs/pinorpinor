import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client (for client-side uploads via signed URLs)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations — never expose to client)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Storage bucket name ───────────────────────────────────────
export const STORAGE_BUCKET = "pinorpinor-media";

// ── Allowed MIME types ────────────────────────────────────────
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/webm",
  "video/quicktime",
];

export const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// ── Size limits ───────────────────────────────────────────────
export const MAX_IMAGE_SIZE = 15 * 1024 * 1024;   // 15 MB
export const MAX_VIDEO_SIZE = 200 * 1024 * 1024;  // 200 MB
export const MAX_VIDEO_DURATION = 60;              // 60 seconds

// ── Media limits per user ─────────────────────────────────────
export const MAX_PROFILE_PHOTOS = 6;
export const MAX_GALLERY_PHOTOS = 30;
export const MAX_VIDEOS = 10;

/**
 * Generate a unique storage key for a media file.
 * Pattern: users/{userId}/{mediaType}/{timestamp}-{random}.{ext}
 */
export function generateStorageKey(
  userId: string,
  mediaType: "profile" | "gallery" | "video",
  mimeType: string
): string {
  const ext = mimeType.split("/")[1]?.replace("quicktime", "mov") || "bin";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `users/${userId}/${mediaType}/${timestamp}-${random}.${ext}`;
}

/**
 * Get the public CDN URL for a storage key.
 */
export function getPublicUrl(storageKey: string): string {
  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storageKey);
  return data.publicUrl;
}

/**
 * Create a signed upload URL (10 min TTL) for direct browser uploads.
 * The browser uploads directly to Supabase Storage — no server bandwidth used.
 */
export async function createSignedUploadUrl(
  storageKey: string
): Promise<{ signedUrl: string; token: string }> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(storageKey);

  if (error || !data) {
    throw new Error(`Failed to create signed upload URL: ${error?.message}`);
  }

  return { signedUrl: data.signedUrl, token: data.token };
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteStorageFile(storageKey: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([storageKey]);

  if (error) {
    console.error("Failed to delete storage file:", error.message);
  }
}

/**
 * Validate a file's MIME type against the allowed list.
 */
export function validateMimeType(mimeType: string): boolean {
  return ALLOWED_TYPES.includes(mimeType);
}

/**
 * Validate a file's size against the appropriate limit.
 */
export function validateFileSize(mimeType: string, sizeBytes: number): boolean {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return sizeBytes <= MAX_IMAGE_SIZE;
  }
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return sizeBytes <= MAX_VIDEO_SIZE;
  }
  return false;
}

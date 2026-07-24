"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from "lucide-react";

interface UploadedFile {
  id: string;
  storageUrl: string;
  mediaType: string;
  file: File;
}

interface MediaUploaderProps {
  mediaType: "PROFILE_PHOTO" | "GALLERY_PHOTO" | "VIDEO";
  maxFiles?: number;
  onUploadComplete?: (media: UploadedFile) => void;
  label?: string;
  hint?: string;
  accept?: string;
}

type FileStatus = "idle" | "validating" | "uploading" | "success" | "error";

interface FileUploadState {
  file: File;
  preview: string;
  status: FileStatus;
  progress: number;
  error?: string;
  storageUrl?: string;
  mediaId?: string;
}

export function MediaUploader({
  mediaType,
  maxFiles = 6,
  onUploadComplete,
  label = "Upload Files",
  hint = "JPG, PNG, WEBP up to 15MB",
  accept = "image/jpeg,image/png,image/webp,image/heic",
}: MediaUploaderProps) {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      // Prevent duplicates
      if (files.length >= maxFiles) return;

      const preview = URL.createObjectURL(file);
      const newFile: FileUploadState = {
        file,
        preview,
        status: "validating",
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      try {
        // 1. Get a signed upload URL from our API
        const presignedRes = await fetch("/api/upload/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mimeType: file.type,
            fileSize: file.size,
            mediaType,
          }),
        });

        if (!presignedRes.ok) {
          const { error } = await presignedRes.json();
          setFiles((prev) =>
            prev.map((f) =>
              f.preview === preview
                ? { ...f, status: "error", error: error || "Upload failed" }
                : f
            )
          );
          return;
        }

        const { signedUrl, storageKey, publicUrl } = await presignedRes.json();

        // 2. Upload the file directly to Supabase Storage using the signed URL
        setFiles((prev) =>
          prev.map((f) =>
            f.preview === preview
              ? { ...f, status: "uploading", progress: 10 }
              : f
          )
        );

        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error("Upload to storage failed");
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.preview === preview ? { ...f, progress: 80 } : f
          )
        );

        // 3. Confirm the upload and store metadata in DB
        const confirmRes = await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storageKey,
            mediaType,
            mimeType: file.type,
            fileSize: file.size,
            order: files.length,
          }),
        });

        if (!confirmRes.ok) {
          throw new Error("Failed to save media metadata");
        }

        const { media } = await confirmRes.json();

        setFiles((prev) =>
          prev.map((f) =>
            f.preview === preview
              ? {
                  ...f,
                  status: "success",
                  progress: 100,
                  storageUrl: publicUrl,
                  mediaId: media.id,
                }
              : f
          )
        );

        onUploadComplete?.({
          id: media.id,
          storageUrl: publicUrl,
          mediaType,
          file,
        });
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) =>
            f.preview === preview
              ? {
                  ...f,
                  status: "error" as const,
                  error: errMsg,
                }
              : f
          )
        );
      }
    },
    [files, maxFiles, mediaType, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      Array.from(e.dataTransfer.files).forEach(processFile);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      Array.from(e.target.files).forEach(processFile);
    },
    [processFile]
  );

  const removeFile = (preview: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.preview === preview);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.preview !== preview);
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {files.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-[#e91e8c] bg-[#e91e8c]/5"
              : "border-white/15 hover:border-[#e91e8c]/50 bg-[#16131f]"
          }`}
          onClick={() => document.getElementById(`file-input-${mediaType}`)?.click()}
        >
          <input
            id={`file-input-${mediaType}`}
            type="file"
            multiple={maxFiles > 1}
            accept={accept}
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#e91e8c]/10 border border-[#e91e8c]/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#e91e8c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-[#71717a] mt-1">{hint}</p>
              <p className="text-xs text-[#71717a]">
                {files.length}/{maxFiles} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((f) => (
            <div
              key={f.preview}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#16131f] border border-white/10 group"
            >
              <Image
                src={f.preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="150px"
              />

              {/* Status Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                {f.status === "uploading" || f.status === "validating" ? (
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-1" />
                    <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e8c] rounded-full transition-all duration-500"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  </div>
                ) : f.status === "success" ? (
                  <CheckCircle className="w-7 h-7 text-[#22c55e] drop-shadow" />
                ) : f.status === "error" ? (
                  <div className="text-center px-2">
                    <AlertCircle className="w-6 h-6 text-[#ef4444] mx-auto mb-1" />
                    <p className="text-[10px] text-white leading-tight">{f.error}</p>
                  </div>
                ) : null}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.preview);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

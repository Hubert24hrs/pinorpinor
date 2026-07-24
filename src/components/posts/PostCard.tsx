"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, CheckCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, VerificationBadge } from "@/components/ui/badge";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

interface Creator {
  id: string;
  name: string;
  username: string;
  image: string;
  verified?: boolean;
}

interface PostMedia {
  id: string;
  url: string;
  type: "image" | "video";
  aspectRatio?: string;
}

export interface PostCardProps {
  id: string;
  creator: Creator;
  caption?: string;
  media: PostMedia[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date | string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
}

export function PostCard({
  id,
  creator,
  caption,
  media,
  likesCount: initialLikes,
  commentsCount,
  createdAt,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  onLike,
  onBookmark,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    if (onLike) onLike(id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass rounded-2xl overflow-hidden border border-white/10 mb-6 hover:border-white/20 transition-all duration-300 shadow-lg"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href={`/${creator.username}`} className="flex items-center gap-3 group">
          <Avatar src={creator.image} name={creator.name} size="md" showRing ringColor="primary" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white group-hover:text-[#FF2E88] transition-colors">
                {creator.name}
              </span>
              {creator.verified && <VerificationBadge size="sm" />}
            </div>
            <p className="text-xs text-[#A1A1AA]">@{creator.username} • {formatRelativeTime(createdAt)}</p>
          </div>
        </Link>
        <button className="text-[#A1A1AA] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Carousel / Single Display */}
      {media.length > 0 && (
        <div className="relative bg-black/40 aspect-square sm:aspect-[4/3] w-full overflow-hidden flex items-center justify-center">
          <Image
            src={media[activeMediaIndex].url}
            alt={caption || "Post media"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          {media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMediaIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeMediaIndex ? "bg-[#FF2E88] w-4" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Content */}
      {caption && (
        <div className="p-4 text-sm text-white/90 leading-relaxed font-[family-name:var(--font-inter)]">
          {caption}
        </div>
      )}

      {/* Action Bar */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between text-[#A1A1AA]">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isLiked ? "text-[#FF2E88]" : "hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-[#FF2E88]" : ""}`} />
            <span>{formatNumber(likesCount)}</span>
          </button>

          <Link href={`/posts/${id}`} className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{formatNumber(commentsCount)}</span>
          </Link>

          <button className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
            isBookmarked ? "text-[#00E5FF]" : "hover:text-white"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-[#00E5FF]" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}

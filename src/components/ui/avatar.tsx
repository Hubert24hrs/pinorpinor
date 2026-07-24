"use client";

import React from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showRing?: boolean;
  ringColor?: "primary" | "gold" | "accent";
  isOnline?: boolean;
}

const sizeMap = {
  xs:  { container: "w-6 h-6",   text: "text-[9px]",  ring: "ring-1", indicator: "w-1.5 h-1.5" },
  sm:  { container: "w-8 h-8",   text: "text-xs",     ring: "ring-1", indicator: "w-2 h-2" },
  md:  { container: "w-10 h-10", text: "text-sm",     ring: "ring-2", indicator: "w-2.5 h-2.5" },
  lg:  { container: "w-14 h-14", text: "text-base",   ring: "ring-2", indicator: "w-3 h-3" },
  xl:  { container: "w-20 h-20", text: "text-xl",     ring: "ring-2", indicator: "w-3.5 h-3.5" },
  "2xl": { container: "w-28 h-28", text: "text-3xl",  ring: "ring-4", indicator: "w-4 h-4" },
};

const ringColorMap = {
  primary:   "ring-[#FF2E88]",
  gold:      "ring-[#FFD700]",
  accent:    "ring-[#00E5FF]",
};

export function Avatar({ src, name, size = "md", className, showRing, ringColor = "primary", isOnline }: AvatarProps) {
  const sizes = sizeMap[size];

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center",
          "bg-gradient-to-br from-[#FF2E88]/20 to-[#7C3AED]/20",
          "border border-white/10",
          sizes.container,
          showRing && [sizes.ring, "ring-offset-2 ring-offset-[#09090B]", ringColorMap[ringColor]],
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name || "Avatar"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 64px, 128px"
          />
        ) : (
          <span className={cn("font-bold text-white/80", sizes.text)}>
            {name ? getInitials(name) : "?"}
          </span>
        )}
      </div>
      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-[#00D26A]",
            "border-2 border-[#09090B]",
            sizes.indicator
          )}
        />
      )}
    </div>
  );
}

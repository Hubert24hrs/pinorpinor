"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold transition-all duration-200 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:   "bg-white/8 text-white border border-white/10 hover:bg-white/12",
        primary:   "bg-[#FF2E88]/15 text-[#FF2E88] border border-[#FF2E88]/20 hover:bg-[#FF2E88]/25",
        secondary: "bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/20 hover:bg-[#7C3AED]/25",
        accent:    "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 hover:bg-[#00E5FF]/20",
        gold:      "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 hover:bg-[#FFD700]/20",
        success:   "bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/20",
        warning:   "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
        error:     "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20",
        verified:  "bg-gradient-to-r from-[#FFD700]/20 to-[#FF8C00]/20 text-[#FFD700] border border-[#FFD700]/30",
        gradient:  "bg-gradient-to-r from-[#FF2E88] to-[#7C3AED] text-white border-0",
      },
      size: {
        xs: "text-[9px] px-1.5 py-0.5 rounded-md",
        sm: "text-[10px] px-2 py-0.5 rounded-md",
        md: "text-xs px-2.5 py-1 rounded-lg",
        lg: "text-sm px-3 py-1 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
}

export function Badge({ className, variant, size, leftIcon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
    </span>
  );
}

// ── Verification Badge ────────────────────────────────────────
export function VerificationBadge({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <span title="Verified Creator" className="flex-shrink-0">
      <svg
        className={cn(sizeMap[size], "drop-shadow-[0_0_4px_rgba(255,215,0,0.6)]")}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="11" fill="url(#verifiedGrad)" />
        <path
          d="M8 12.5l2.5 2.5 5.5-5.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="verifiedGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD700" />
            <stop offset="1" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-xl", className)}
      {...props}
    />
  );
}

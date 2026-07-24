"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-[family-name:var(--font-montserrat)] font-semibold",
    "transition-all duration-250 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2E88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        // Primary gradient
        primary: [
          "bg-gradient-to-r from-[#FF2E88] to-[#7C3AED] text-white",
          "hover:shadow-[0_0_40px_rgba(255,46,136,0.4)] hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Outline with glow on hover
        outline: [
          "border border-white/20 bg-white/4 text-white backdrop-blur-md",
          "hover:border-[#FF2E88]/60 hover:bg-white/8 hover:shadow-[0_0_20px_rgba(255,46,136,0.2)]",
          "active:scale-[0.98]",
        ],
        // Ghost
        ghost: [
          "text-[#A1A1AA] bg-transparent",
          "hover:text-white hover:bg-white/8",
          "active:scale-[0.98]",
        ],
        // Destructive
        destructive: [
          "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]",
          "hover:bg-[#EF4444]/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
        ],
        // Secondary (purple)
        secondary: [
          "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white",
          "hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Gold
        gold: [
          "bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black",
          "hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Link
        link: [
          "text-[#FF2E88] underline-offset-4 hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        xs:  "h-7 px-3 text-xs rounded-lg",
        sm:  "h-9 px-4 text-sm rounded-xl",
        md:  "h-11 px-6 text-sm rounded-xl",
        lg:  "h-13 px-8 text-base rounded-2xl",
        xl:  "h-16 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, onClick, ...props }, ref) => {
    // Ripple effect handler
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === "link" || variant === "ghost") {
        onClick?.(e);
        return;
      }

      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        background: rgba(255,255,255,0.2);
        transform: scale(0);
        animation: ripple 600ms ease-out forwards;
        pointer-events: none;
      `;

      // Inject @keyframes once
      if (!document.getElementById("ripple-style")) {
        const style = document.createElement("style");
        style.id = "ripple-style";
        style.textContent = `@keyframes ripple { to { transform: scale(1); opacity: 0; } }`;
        document.head.appendChild(style);
      }

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

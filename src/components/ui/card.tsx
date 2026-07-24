"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover3d?: boolean;
  glowColor?: "primary" | "secondary" | "accent" | "gold";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, hover3d, glowColor = "primary", children, ...props }, ref) => {
    const glowColors = {
      primary:   "hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,46,136,0.2)]",
      secondary: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(124,58,237,0.2)]",
      accent:    "hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(0,229,255,0.2)]",
      gold:      "hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,215,0,0.2)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-2xl transition-all duration-300",
          glow && [glowColors[glowColor], "hover:-translate-y-1"],
          hover3d && "transform-gpu perspective-1000",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-[family-name:var(--font-poppins)] font-semibold text-lg text-white", className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[#A1A1AA] mt-1", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center px-6 pb-6 gap-3", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80 font-[family-name:var(--font-inter)]"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#FF2E88] transition-colors duration-200 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 px-4 text-sm text-white placeholder:text-[#A1A1AA]/60",
              "bg-white/4 backdrop-blur-sm",
              "border border-white/10 rounded-xl",
              "transition-all duration-200",
              "focus:outline-none focus:border-[#FF2E88]/60 focus:bg-white/6 focus:shadow-[0_0_0_3px_rgba(255,46,136,0.1)]",
              "hover:border-white/20",
              "font-[family-name:var(--font-inter)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#EF4444]/50 focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#EF4444] flex items-center gap-1.5 mt-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#A1A1AA] mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ── Textarea ─────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full min-h-24 px-4 py-3 text-sm text-white placeholder:text-[#A1A1AA]/60",
            "bg-white/4 backdrop-blur-sm",
            "border border-white/10 rounded-xl resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-[#FF2E88]/60 focus:bg-white/6 focus:shadow-[0_0_0_3px_rgba(255,46,136,0.1)]",
            "hover:border-white/20",
            error && "border-[#EF4444]/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-[#A1A1AA] mt-1">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };

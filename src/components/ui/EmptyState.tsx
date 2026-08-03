import React from "react";
import Link from "next/link";
import { Sparkles, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No Profiles Found",
  description = "No approved women profiles match your selected filters. Try broadening your location or age preferences.",
  actionText = "Join as a Woman Member",
  actionHref = "/join",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="p-10 text-center rounded-3xl bg-white border border-[#E7E3DC] shadow-sm max-w-xl mx-auto space-y-5 my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#FDF2F5] border border-[#FBCFE8] flex items-center justify-center text-[#C2446E] mx-auto shadow-xs">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">{title}</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onReset && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full border border-stone-300 bg-white text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        {actionHref && (
          <Link href={actionHref}>
            <button className="gradient-btn px-6 py-2.5 text-xs font-bold cursor-pointer">
              {actionText}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

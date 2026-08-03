import React from "react";

export function ProfileCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col border border-[#E7E3DC] bg-white shadow-xs">
      <div className="aspect-[3/4] w-full skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-16 skeleton rounded-full" />
          <div className="h-5 w-20 skeleton rounded-full" />
        </div>
        <div className="h-9 w-full skeleton rounded-xl mt-2" />
      </div>
    </div>
  );
}

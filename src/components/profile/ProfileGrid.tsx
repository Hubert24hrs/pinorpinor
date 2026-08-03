import React from "react";
import { ProfileCard, ProfileCardData } from "./ProfileCard";
import { ProfileCardSkeleton } from "./ProfileCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProfileGridProps {
  profiles: ProfileCardData[];
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export function ProfileGrid({
  profiles,
  loading = false,
  skeletonCount = 8,
  emptyTitle,
  emptyDescription,
  onResetFilters,
}: ProfileGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {profiles.map((profile, index) => (
        <ProfileCard
          key={profile.id || profile.username}
          profile={profile}
          priorityImage={index < 4}
        />
      ))}
    </div>
  );
}

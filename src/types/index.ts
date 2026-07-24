// ──────────────────────────────────────────────────────────────
// Global TypeScript Types for Pinorpinor
// ──────────────────────────────────────────────────────────────

export type UserRole = "GUEST" | "USER" | "CREATOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type VerificationStatus = "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO";
export type NotificationType = "LIKE" | "COMMENT" | "REPLY" | "FOLLOW" | "MENTION" | "MESSAGE" | "VERIFICATION_UPDATE" | "SYSTEM";

// ── Creator / User ──────────────────────────────────────────────
export interface Creator {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  role: UserRole;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  profile: Profile | null;
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  tagline: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  website: string | null;
  location: string | null;
  isPublic: boolean;
  instagramUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  externalLinks: ExternalLink[] | null;
  category: Category | null;
}

export interface ExternalLink {
  title: string;
  url: string;
  icon?: string;
}

// ── Post ────────────────────────────────────────────────────────
export interface Post {
  id: string;
  userId: string;
  caption: string | null;
  status: PostStatus;
  isPinned: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  viewCount: number;
  createdAt: Date;
  user: Creator;
  photos: Photo[];
  videos: Video[];
  hashtags: { hashtag: Hashtag }[];
  _count?: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// ── Media ───────────────────────────────────────────────────────
export interface Photo {
  id: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  order: number;
}

export interface Video {
  id: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  order: number;
}

// ── Category ────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  color: string | null;
}

// ── Hashtag ─────────────────────────────────────────────────────
export interface Hashtag {
  id: string;
  name: string;
  postCount: number;
}

// ── Comment ─────────────────────────────────────────────────────
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  user: Creator;
  replies: Reply[];
  _count?: { likes: number; replies: number };
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  user: Creator;
}

// ── Notification ─────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: NotificationType;
  message: string | null;
  entityId: string | null;
  entityType: string | null;
  isRead: boolean;
  createdAt: Date;
  trigger: Creator | null;
}

// ── Search ──────────────────────────────────────────────────────
export interface SearchResults {
  creators: Creator[];
  posts: Post[];
  hashtags: Hashtag[];
  total: number;
}

// ── Pagination ──────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ── API Response ────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── Upload ──────────────────────────────────────────────────────
export interface UploadResult {
  publicId: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  resourceType: "image" | "video";
}

// ── Analytics ──────────────────────────────────────────────────
export interface AnalyticsData {
  followerGrowth: { date: string; count: number }[];
  postEngagement: { date: string; likes: number; comments: number; views: number }[];
  topPosts: Post[];
  totalFollowers: number;
  totalLikes: number;
  totalViews: number;
  engagementRate: number;
}

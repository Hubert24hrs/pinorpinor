"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck, Flag, Check, X, Loader2, Users, AlertTriangle,
  Eye, Clock, Ban, RefreshCw, ChevronRight, Star, CheckCircle2,
  Activity, MessageSquare, UserCheck, Sparkles
} from "lucide-react";

interface PendingProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  createdAt: string;
  verificationStatus: string;
  datingProfile?: {
    city?: string;
    bio?: string;
    tagline?: string;
    isPublic?: boolean;
  };
  media?: { id: string; storageUrl: string; mediaType: string }[];
}

interface PendingMedia {
  id: string;
  storageUrl: string;
  mediaType: string;
  userId: string;
  user?: { displayName: string; username: string };
  createdAt: string;
}

interface Report {
  id: string;
  reason: string;
  details?: string;
  status: string;
  createdAt: string;
  reporter?: { displayName: string };
  reported?: { displayName: string; username: string };
}

interface Stats {
  pendingProfiles: number;
  approvedProfiles: number;
  pendingMedia: number;
  openReports: number;
  totalMembers: number;
}

type Tab = "overview" | "profiles" | "media" | "reports";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    pendingProfiles: 0, approvedProfiles: 0, pendingMedia: 0,
    openReports: 0, totalMembers: 0,
  });
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<PendingProfile | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      const role = session?.user?.role || "";
      if (!["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(role)) {
        router.push("/dashboard");
        return;
      }
    }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, profilesRes, reportsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/profiles?status=PENDING"),
        fetch("/api/admin/reports?status=OPEN"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (profilesRes.ok) {
        const d = await profilesRes.json();
        setPendingProfiles(d.profiles || []);
      }
      if (reportsRes.ok) {
        const d = await reportsRes.json();
        setReports(d.reports || []);
      }
    } catch (e) {
      console.error("Admin data fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  const handleProfileAction = async (
    profileId: string,
    action: "approve" | "reject" | "suspend"
  ) => {
    setActionLoading(`profile-${profileId}-${action}`);
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/${action}`, {
        method: "POST",
      });
      if (res.ok) {
        setPendingProfiles((prev) => prev.filter((p) => p.id !== profileId));
        setPreviewProfile(null);
        setStats((prev) => ({
          ...prev,
          pendingProfiles: Math.max(0, prev.pendingProfiles - 1),
          approvedProfiles: action === "approve" ? prev.approvedProfiles + 1 : prev.approvedProfiles,
        }));
      }
    } catch (e) {
      console.error("Profile action error:", e);
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-semibold">Loading admin data...</p>
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Pending Profiles", value: stats.pendingProfiles, icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Approved Profiles", value: stats.approvedProfiles, icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Total Members", value: stats.totalMembers, icon: Users, color: "text-[#C2446E] bg-rose-50 border-rose-200" },
    { label: "Open Reports", value: stats.openReports, icon: Flag, color: "text-red-700 bg-red-50 border-red-200" },
  ];

  const TABS: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "profiles", label: "Pending Profiles", icon: UserCheck, badge: stats.pendingProfiles },
    { id: "media", label: "Media Queue", icon: Eye, badge: stats.pendingMedia },
    { id: "reports", label: "Reports", icon: Flag, badge: stats.openReports },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141216] text-white border border-stone-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-[#F4E7B3] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Platform Administration & Moderation Dashboard</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
          Pinorpinor Admin Console
        </h1>
        <p className="text-xs text-stone-400">
          Review submitted profiles, moderate media, and manage safety reports.
          All actions are logged for compliance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-[#E7E3DC] shadow-sm overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-1 min-w-max justify-center cursor-pointer ${
              activeTab === id
                ? "bg-[#141216] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeTab === id ? "bg-[#C2446E] text-white" : "bg-rose-100 text-rose-700"
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}

        <button
          onClick={fetchData}
          className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer ml-auto flex-shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`p-5 rounded-2xl border space-y-2 bg-white shadow-xs`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-stone-900">{s.value}</p>
                  <p className="text-xs font-semibold text-stone-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Approve Shortcuts */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E3DC] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#C2446E]" />
                Pending Profile Queue
              </h2>
              {pendingProfiles.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                  All profiles reviewed — nothing pending.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProfiles.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {p.displayName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{p.displayName}</p>
                        <p className="text-[10px] text-stone-500 truncate">@{p.username} · {p.datingProfile?.city || "N/A"}</p>
                      </div>
                      <button
                        onClick={() => setPreviewProfile(p)}
                        className="text-xs font-bold text-[#C2446E] hover:underline cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                  {pendingProfiles.length > 3 && (
                    <button
                      onClick={() => setActiveTab("profiles")}
                      className="w-full text-xs font-bold text-stone-600 hover:text-stone-900 py-2 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>View all {pendingProfiles.length} pending</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Reports Quick View */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E3DC] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                Open Safety Reports
              </h2>
              {reports.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                  No open safety reports.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-700">{r.reason}</span>
                        <span className="text-[10px] text-stone-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.reported && (
                        <p className="text-[11px] text-stone-600">
                          Reported profile: <strong>@{r.reported.username}</strong>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PENDING PROFILES TAB ─────────────────────────────────────── */}
      {activeTab === "profiles" && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-stone-500">
            {pendingProfiles.length} profiles awaiting moderation review.
          </p>

          {pendingProfiles.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-white border border-[#E7E3DC] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-stone-900">All Profiles Reviewed</h3>
              <p className="text-xs text-stone-500">No pending profiles in the moderation queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingProfiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-2xl p-5 border border-[#E7E3DC] shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    {profile.media && profile.media[0] ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                        <Image src={profile.media[0].storageUrl} alt={profile.displayName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
                        {profile.displayName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 text-sm">{profile.displayName}</p>
                      <p className="text-xs text-stone-500">@{profile.username}</p>
                      <p className="text-[11px] text-stone-400">{profile.email}</p>
                    </div>
                  </div>

                  {profile.datingProfile && (
                    <div className="space-y-1">
                      <p className="text-xs text-stone-600 line-clamp-2">{profile.datingProfile.bio || "No bio provided"}</p>
                      <p className="text-[11px] text-stone-400">
                        📍 {profile.datingProfile.city || "City not specified"}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setPreviewProfile(profile)}
                      className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Review</span>
                    </button>

                    <button
                      onClick={() => handleProfileAction(profile.id, "approve")}
                      disabled={!!actionLoading}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                    >
                      {actionLoading === `profile-${profile.id}-approve` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleProfileAction(profile.id, "reject")}
                      disabled={!!actionLoading}
                      className="py-2 px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold cursor-pointer flex items-center gap-1 hover:bg-red-100"
                    >
                      {actionLoading === `profile-${profile.id}-reject` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MEDIA TAB ───────────────────────────────────────────────── */}
      {activeTab === "media" && (
        <div className="py-10 text-center rounded-3xl bg-white border border-[#E7E3DC] space-y-3">
          <Eye className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-900">Media Moderation Queue</h3>
          <p className="text-xs text-stone-500">Photo and video moderation queue is managed via the admin API. No pending media items.</p>
        </div>
      )}

      {/* ── REPORTS TAB ─────────────────────────────────────────────── */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-white border border-[#E7E3DC] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-stone-900">No Open Reports</h3>
              <p className="text-xs text-stone-500">All safety reports have been handled.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-[#E7E3DC] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                    {r.reason}
                  </span>
                  <span className="text-[10px] text-stone-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.details && <p className="text-xs text-stone-600">{r.details}</p>}
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  {r.reporter && <span>Reported by: <strong>{r.reporter.displayName}</strong></span>}
                  {r.reported && <span>· Target: <strong>@{r.reported.username}</strong></span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PROFILE REVIEW MODAL ─────────────────────────────────────── */}
      {previewProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display font-bold text-xl text-stone-900">Profile Review</h3>
              <button onClick={() => setPreviewProfile(null)} className="text-stone-500 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] text-white text-2xl font-bold flex items-center justify-center">
                  {previewProfile.displayName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg text-stone-900">{previewProfile.displayName}</p>
                  <p className="text-xs text-stone-500">@{previewProfile.username} · {previewProfile.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] space-y-2 text-xs text-stone-700">
                <p><strong>City:</strong> {previewProfile.datingProfile?.city || "N/A"}</p>
                <p><strong>Tagline:</strong> {previewProfile.datingProfile?.tagline || "None"}</p>
                <p><strong>Bio:</strong> {previewProfile.datingProfile?.bio || "None"}</p>
                <p><strong>Public:</strong> {previewProfile.datingProfile?.isPublic ? "Yes" : "No"}</p>
                <p><strong>Submitted:</strong> {new Date(previewProfile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleProfileAction(previewProfile.id, "reject")}
                disabled={!!actionLoading}
                className="flex-1 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4" /><span>Reject Profile</span></>}
              </button>

              <button
                onClick={() => handleProfileAction(previewProfile.id, "suspend")}
                disabled={!!actionLoading}
                className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleProfileAction(previewProfile.id, "approve")}
                disabled={!!actionLoading}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /><span>Approve &amp; Publish</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

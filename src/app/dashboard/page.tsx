"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MediaUploader } from "@/components/upload/MediaUploader";
import {
  Camera, Images, Video, MapPin, Save, Loader2, CheckCircle, ToggleLeft, ToggleRight
} from "lucide-react";

const DATE_TYPE_OPTIONS = [
  "Dinner Dates",
  "VIP Events",
  "Travel Companion",
  "Weekend Getaways",
  "Business Events",
  "Nightlife",
  "Casual Meetups",
  "Coffee & Drinks",
];

const INTENT_OPTIONS = [
  { value: "SERIOUS", label: "Serious Relationship" },
  { value: "CASUAL", label: "Casual Dating" },
  { value: "FRIENDS", label: "New Friends" },
  { value: "OPEN", label: "Open to Anything" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<"photos" | "gallery" | "videos" | "profile">("photos");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    tagline: "",
    city: "",
    country: "Nigeria",
    location: "",
    height: "",
    relationshipIntent: "SERIOUS",
    dateTypes: [] as string[],
    isAvailableToday: false,
    isDiscoverable: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            const p = data.user.datingProfile || {};
            setForm({
              displayName: data.user.displayName || "",
              bio: p.bio || "",
              tagline: p.tagline || "",
              city: p.city || "",
              country: p.country || "Nigeria",
              location: p.location || "",
              height: p.height || "",
              relationshipIntent: p.relationshipIntent || "SERIOUS",
              dateTypes: p.dateTypes || [],
              isAvailableToday: p.isAvailableToday || false,
              isDiscoverable: p.isDiscoverable ?? true,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  const toggleDateType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      dateTypes: prev.dateTypes.includes(type)
        ? prev.dateTypes.filter((t) => t !== type)
        : [...prev.dateTypes, type],
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "photos", label: "Profile Photos", icon: Camera },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "videos", label: "Videos", icon: Video },
    { id: "profile", label: "My Profile", icon: MapPin },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
          My <span className="text-[#2563EB]">Profile & Media</span>
        </h1>
        <p className="text-xs text-[#9C948C] mt-1">
          Manage your photos, bio, preferences, and availability.
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E8E2DC] shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${
              tab === id
                ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Profile Photos */}
      {tab === "photos" && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold text-[#1A1714] mb-1">Profile Photos</h2>
            <p className="text-xs text-[#9C948C]">
              Upload 1–6 photos for your card in discovery.
            </p>
          </div>
          <MediaUploader
            mediaType="PROFILE_PHOTO"
            maxFiles={6}
            label="Upload Profile Photos"
            hint="JPG, PNG, WEBP or HEIC • Max 15MB each"
            accept="image/jpeg,image/png,image/webp,image/heic"
          />
        </div>
      )}

      {/* Gallery */}
      {tab === "gallery" && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold text-[#1A1714] mb-1">Photo Gallery</h2>
            <p className="text-xs text-[#9C948C]">
              Add up to 30 gallery photos visible on your full profile view.
            </p>
          </div>
          <MediaUploader
            mediaType="GALLERY_PHOTO"
            maxFiles={30}
            label="Upload Gallery Photos"
            hint="JPG, PNG, WEBP or HEIC • Max 15MB each"
            accept="image/jpeg,image/png,image/webp,image/heic"
          />
        </div>
      )}

      {/* Videos */}
      {tab === "videos" && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold text-[#1A1714] mb-1">My Videos</h2>
            <p className="text-xs text-[#9C948C]">
              Upload up to 10 short videos (max 60 seconds each).
            </p>
          </div>
          <MediaUploader
            mediaType="VIDEO"
            maxFiles={10}
            label="Upload Videos"
            hint="MP4, MOV, WEBM • Max 60 seconds • Max 200MB"
            accept="video/mp4,video/mov,video/webm,video/quicktime"
          />
        </div>
      )}

      {/* Profile Info Editor */}
      {tab === "profile" && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-5">
          <h2 className="font-semibold text-[#1A1714]">Profile Details</h2>

          {/* Availability Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC]">
              <div>
                <p className="text-sm font-semibold text-[#1A1714]">Available Today</p>
                <p className="text-xs text-[#9C948C] mt-0.5">Show active badge on profile</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, isAvailableToday: !f.isAvailableToday }))}
              >
                {form.isAvailableToday ? (
                  <ToggleRight className="w-8 h-8 text-[#2D7A4F]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#9C948C]" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC]">
              <div>
                <p className="text-sm font-semibold text-[#1A1714]">Show in Discovery</p>
                <p className="text-xs text-[#9C948C] mt-0.5">Appear in swipe deck</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, isDiscoverable: !f.isDiscoverable }))}
              >
                {form.isDiscoverable ? (
                  <ToggleRight className="w-8 h-8 text-[#2563EB]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#9C948C]" />
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Display Name</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Tagline / One-liner</label>
              <input
                type="text"
                placeholder="e.g. Coffee & conversations ✨"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5C5450] mb-1.5">City</label>
              <input
                type="text"
                placeholder="e.g. Lagos"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Height</label>
              <input
                type="text"
                placeholder="e.g. 5ft 9in"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none"
              />
            </div>
          </div>

          {/* Relationship Intent */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Relationship Intent</label>
            <select
              value={form.relationshipIntent}
              onChange={(e) => setForm((f) => ({ ...f, relationshipIntent: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1A1714] focus:border-[#C2446E] outline-none"
            >
              {INTENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-[#5C5450] mb-1.5">Bio / About You</label>
            <textarea
              rows={4}
              placeholder="Tell your potential matches about yourself and what kind of dates you enjoy."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1A1714] focus:border-[#C2446E] outline-none resize-none"
            />
          </div>

          {/* Date Preferences */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Date Preferences</label>
            <div className="flex flex-wrap gap-2">
              {DATE_TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleDateType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    form.dateTypes.includes(type)
                      ? "bg-blue-50 text-[#2563EB] border border-[#BFDBFE]"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#2563EB]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="gradient-btn w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Profile</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

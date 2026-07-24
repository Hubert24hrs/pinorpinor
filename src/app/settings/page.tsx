"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Bell, Eye, UserX, Trash2, Loader2, CheckCircle } from "lucide-react";

interface BlockedUser {
  id: string;
  displayName: string;
  username: string;
}

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState({
    notifyOnMatch: true,
    notifyOnMessage: true,
    notifyOnDateProposal: true,
    showInDiscovery: true,
  });

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = () => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.blockedUsers) setBlockedUsers(data.blockedUsers);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (blockedUserId: string) => {
    await fetch(`/api/block?blockedUserId=${blockedUserId}`, { method: "DELETE" });
    fetchSettings();
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate your account? You will be logged out.")) return;
    await fetch("/api/settings", { method: "DELETE" });
    signOut({ callbackUrl: "/login" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
          Account <span className="text-[#C2446E]">Settings</span>
        </h1>
        <p className="text-xs text-[#9C948C] mt-1">
          Manage notifications, discovery preferences, and safety list.
        </p>
      </div>

      {/* Discovery Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
        <h2 className="font-semibold text-sm text-[#1A1714] flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#C2446E]" /> Discovery & Visibility
        </h2>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC]">
          <div>
            <p className="text-xs font-semibold text-[#1A1714]">Show Me in Discover</p>
            <p className="text-[10px] text-[#9C948C]">Allow other users to discover your profile in the swipe deck</p>
          </div>
          <input
            type="checkbox"
            checked={settings.showInDiscovery}
            onChange={() => handleToggle("showInDiscovery")}
            className="rounded accent-[#C2446E] w-4 h-4"
          />
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
        <h2 className="font-semibold text-sm text-[#1A1714] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#C2446E]" /> Notifications
        </h2>

        {[
          { key: "notifyOnMatch", label: "Match Notifications", desc: "Notify when you get a new mutual match" },
          { key: "notifyOnMessage", label: "Message Notifications", desc: "Notify when a match sends you a message" },
          { key: "notifyOnDateProposal", label: "Date Proposal Notifications", desc: "Notify when someone proposes a date" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC]">
            <div>
              <p className="text-xs font-semibold text-[#1A1714]">{item.label}</p>
              <p className="text-[10px] text-[#9C948C]">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={(settings as any)[item.key]}
              onChange={() => handleToggle(item.key as any)}
              className="rounded accent-[#C2446E] w-4 h-4"
            />
          </div>
        ))}

        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> Settings Saved</>
          ) : (
            <>Save Settings</>
          )}
        </button>
      </div>

      {/* Blocked Users */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
        <h2 className="font-semibold text-sm text-[#1A1714] flex items-center gap-2">
          <UserX className="w-4 h-4 text-[#B83232]" /> Blocked Users
        </h2>

        {blockedUsers.length === 0 ? (
          <p className="text-xs text-[#9C948C]">You haven't blocked any users.</p>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC]">
                <span className="text-xs font-semibold text-[#1A1714]">{b.displayName}</span>
                <button
                  onClick={() => handleUnblock(b.id)}
                  className="text-xs text-[#C2446E] font-semibold hover:underline"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Deactivation */}
      <div className="bg-[#FFE8E8]/40 rounded-2xl p-6 border border-[#F8BFC0] space-y-3">
        <h2 className="font-semibold text-sm text-[#B83232]">Danger Zone</h2>
        <p className="text-xs text-[#5C5450]">
          Deactivating your account will hide your profile and end active matches.
        </p>
        <button
          onClick={handleDeactivate}
          className="py-2 px-4 rounded-xl bg-[#B83232] text-white text-xs font-semibold hover:bg-[#9B2C52] transition-colors"
        >
          Deactivate Account
        </button>
      </div>
    </div>
  );
}

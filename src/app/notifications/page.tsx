"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, Heart, MessageSquare, Calendar, ShieldCheck, CheckCheck, Loader2 } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, router]);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({}) });
    fetchNotifications();
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "MATCH": return <Heart className="w-4 h-4 text-[#C2446E] fill-[#C2446E]" />;
      case "MESSAGE": return <MessageSquare className="w-4 h-4 text-[#7A6A5C]" />;
      case "DATE_PROPOSAL":
      case "DATE_ACCEPTED": return <Calendar className="w-4 h-4 text-[#2D7A4F]" />;
      default: return <Bell className="w-4 h-4 text-[#5C5450]" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
            Notifications
          </h1>
          <p className="text-xs text-[#9C948C] mt-1">Activity and updates regarding your matches</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="text-xs text-[#C2446E] font-semibold hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#E8E2DC] shadow-sm text-center space-y-3">
          <Bell className="w-8 h-8 mx-auto text-[#D4CCC4]" />
          <p className="text-xs text-[#9C948C]">You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm divide-y divide-[#E8E2DC]">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-3 transition-colors ${
                !n.isRead ? "bg-[#FFF0F4]/40" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-[#1A1714]">{n.title}</h4>
                <p className="text-xs text-[#5C5450] mt-0.5">{n.body}</p>
                <span className="text-[10px] text-[#9C948C] mt-1 block">
                  {new Date(n.createdAt).toLocaleDateString()} at{" "}
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare, Search, ShieldCheck, Heart,
  Sparkles, MapPin, Circle, Loader2
} from "lucide-react";

interface ConversationItem {
  conversationId: string;
  partner: {
    id: string;
    displayName: string;
    username: string;
    location?: string;
    isOnline?: boolean;
    media: { storageUrl: string }[];
  } | null;
  lastMessage: {
    content: string | null;
    createdAt: string;
  } | null;
  unreadCount?: number;
}

// Nigerian sample conversations with African portrait images
const SAMPLE_CONVERSATIONS: ConversationItem[] = [
  {
    conversationId: "conv-1",
    partner: {
      id: "ng-1",
      displayName: "Zainab, 24",
      username: "zainab_lagos",
      location: "Victoria Island, Lagos",
      isOnline: true,
      media: [{ storageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: { content: "I'd love to join you for rooftop cocktails in VI! What time works for you? 🥂", createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    unreadCount: 2,
  },
  {
    conversationId: "conv-2",
    partner: {
      id: "ng-2",
      displayName: "Chioma, 25",
      username: "chioma_abj",
      location: "Maitama, Abuja",
      isOnline: true,
      media: [{ storageUrl: "https://images.unsplash.com/photo-1598346762291-aee88549193f?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: { content: "Live jazz at Yellow Chilli this Friday sounds perfect! 🎷", createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
    unreadCount: 0,
  },
  {
    conversationId: "conv-3",
    partner: {
      id: "ng-3",
      displayName: "Funke, 26",
      username: "funke_lekki",
      location: "Lekki Phase 1, Lagos",
      isOnline: false,
      media: [{ storageUrl: "https://images.unsplash.com/photo-1535324492437-d8dea70a38a7?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: { content: "The Terra Kulture art show is next Saturday. Would you want to go? 🎨", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    unreadCount: 1,
  },
  {
    conversationId: "conv-4",
    partner: {
      id: "ng-5",
      displayName: "Amaka, 23",
      username: "amaka_ph",
      location: "GRA, Port Harcourt",
      isOnline: false,
      media: [{ storageUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: { content: "Matched! Say hi and propose a date 👋", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    unreadCount: 0,
  },
];

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MessagesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>(SAMPLE_CONVERSATIONS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => {
        if (data.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
        }
      })
      .catch(() => {});
  }, []);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const filtered = conversations.filter((c) =>
    !search || c.partner?.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Messages</h1>
          {totalUnread > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </div>
        <Link href="/discover">
          <button className="gradient-btn px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            Find Matches
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none shadow-sm transition-all"
        />
      </div>

      {/* Conversation List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No matches yet</h2>
          <p className="text-xs text-gray-600 max-w-xs mx-auto">
            Swipe and match with verified Nigerian singles to start chatting and proposing date nights.
          </p>
          <Link href="/discover">
            <button className="gradient-btn px-6 py-2.5 text-xs font-semibold cursor-pointer">
              Discover Singles
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {filtered.map((conv) => (
            <Link
              key={conv.conversationId}
              href={`/messages/${conv.conversationId}`}
              className="flex items-center gap-3.5 p-4 hover:bg-blue-50/40 transition-colors group cursor-pointer"
            >
              {/* Avatar with Online Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-13 h-13 w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-gray-100 bg-gray-100">
                  <Image
                    src={conv.partner?.media[0]?.storageUrl || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80"}
                    alt={conv.partner?.displayName || "Match"}
                    width={52}
                    height={52}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Online indicator */}
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    conv.partner?.isOnline ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm text-gray-900 truncate ${conv.unreadCount ? "font-extrabold" : ""}`}>
                      {conv.partner?.displayName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {conv.lastMessage?.createdAt ? timeAgo(conv.lastMessage.createdAt) : ""}
                    </span>
                    {(conv.unreadCount ?? 0) > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                  <MapPin className="w-3 h-3 text-[#2563EB]" />
                  <span>{conv.partner?.location || "Lagos, Nigeria"}</span>
                  {conv.partner?.isOnline && (
                    <span className="text-emerald-500 font-semibold ml-1">• Online</span>
                  )}
                </div>

                <p className={`text-xs truncate ${conv.unreadCount ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                  {conv.lastMessage?.content || "Say hello and propose a date!"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#ECFEFF] border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-900">Boost your matches 🚀</p>
          <p className="text-[11px] text-gray-500">Get seen by 10x more singles in Lagos & Abuja today</p>
        </div>
        <Link href="/discover">
          <button className="gradient-btn px-4 py-2 text-[11px] font-bold cursor-pointer">Boost Now</button>
        </Link>
      </div>

    </div>
  );
}

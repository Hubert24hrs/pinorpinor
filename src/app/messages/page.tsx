"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Loader2, ShieldCheck, Heart, Sparkles, MapPin } from "lucide-react";

interface ConversationItem {
  conversationId: string;
  partner: {
    id: string;
    displayName: string;
    username: string;
    location?: string;
    media: { storageUrl: string }[];
  } | null;
  lastMessage: {
    content: string | null;
    createdAt: string;
  } | null;
}

const SAMPLE_CONVERSATIONS: ConversationItem[] = [
  {
    conversationId: "conv-1",
    partner: {
      id: "ng-1",
      displayName: "Zainab, 24",
      username: "zainab_lagos",
      location: "Victoria Island, Lagos",
      media: [{ storageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: {
      content: "I'd love to join you for rooftop cocktails in VI! What time suits you best?",
      createdAt: "10 mins ago",
    },
  },
  {
    conversationId: "conv-2",
    partner: {
      id: "ng-2",
      displayName: "Chioma, 25",
      username: "chioma_abj",
      location: "Maitama, Abuja",
      media: [{ storageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" }],
    },
    lastMessage: {
      content: "Sounds great! Live jazz at Maitama this Friday night works perfectly.",
      createdAt: "1 hour ago",
    },
  },
];

export default function MessagesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationItem[]>(SAMPLE_CONVERSATIONS);
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Your Matches &amp; Conversations</h1>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
          {conversations.length} Active Matches
        </span>
      </div>

      {/* Conversation List */}
      {conversations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No active matches yet</h2>
          <p className="text-xs text-gray-600 max-w-xs mx-auto">
            Swipe and match with candidates in Lagos or Abuja to start chatting and proposing date nights.
          </p>
          <Link href="/discover">
            <button className="gradient-btn px-6 py-2.5 text-xs font-semibold">
              Discover Matches
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.conversationId}
              href={`/messages/${conv.conversationId}`}
              className="block glass-card rounded-2xl p-4 border border-gray-200 hover:border-[#2563EB]/40 transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3.5">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                  <Image
                    src={conv.partner?.media[0]?.storageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                    alt={conv.partner?.displayName || "Partner"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-gray-900 truncate">
                        {conv.partner?.displayName}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {conv.lastMessage?.createdAt || "Just now"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                    <MapPin className="w-3 h-3 text-[#2563EB]" />
                    <span>{conv.partner?.location || "Lagos, Nigeria"}</span>
                  </div>

                  <p className="text-xs text-gray-600 truncate">
                    {conv.lastMessage?.content || "Click to open conversation thread..."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

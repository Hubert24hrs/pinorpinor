"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Loader2, UserCircle2, ShieldCheck, Heart } from "lucide-react";

interface ConversationItem {
  conversationId: string;
  partner: {
    id: string;
    displayName: string;
    username: string;
    verificationStatus: string;
    datingProfile: { isAvailableToday: boolean } | null;
    media: { storageUrl: string }[];
  } | null;
  lastMessage: {
    content: string | null;
    createdAt: string;
    senderId: string;
  } | null;
  isUnmatched: boolean;
  updatedAt: string;
}

export default function MessagesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/conversations")
        .then((r) => r.json())
        .then((data) => setConversations(data.conversations || []))
        .catch(() => setConversations([]))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

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
          My <span className="text-[#C2446E]">Conversations</span>
        </h1>
        <p className="text-xs text-[#9C948C] mt-1">
          Private messages with your matches. Propose dates and plan meetups.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#E8E2DC] shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#F4B8CB] flex items-center justify-center mx-auto text-[#C2446E]">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-['Playfair_Display',serif] font-bold text-lg text-[#1A1714]">
            No messages yet
          </h3>
          <p className="text-xs text-[#9C948C] max-w-xs mx-auto">
            Start swiping in Discover to find matches and open new conversations.
          </p>
          <Link href="/discover">
            <button className="btn-primary text-xs py-2.5 px-6">
              Go to Discover
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm divide-y divide-[#E8E2DC]">
          {conversations.map((item) => {
            const partner = item.partner;
            const photo = partner?.media[0]?.storageUrl;
            return (
              <Link
                key={item.conversationId}
                href={`/messages/${item.conversationId}`}
                className="flex items-center gap-3.5 p-4 hover:bg-[#FAF8F5] transition-colors"
              >
                {/* Partner Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F2EDE8] flex-shrink-0">
                  {photo ? (
                    <Image src={photo} alt={partner?.displayName || "Partner"} fill className="object-cover" />
                  ) : (
                    <UserCircle2 className="w-full h-full text-[#D4CCC4]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <h4 className="font-semibold text-sm text-[#1A1714] truncate">
                        {partner?.displayName || "Match"}
                      </h4>
                      {partner?.verificationStatus === "VERIFIED" && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2D7A4F] flex-shrink-0" />
                      )}
                    </div>
                    {item.lastMessage && (
                      <span className="text-[10px] text-[#9C948C] whitespace-nowrap">
                        {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C5450] truncate">
                    {item.isUnmatched
                      ? "Match ended"
                      : item.lastMessage?.content || "Tap to start conversation..."}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

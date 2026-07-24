"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Send, Calendar, MapPin, ShieldAlert, Loader2, UserCircle2, CheckCircle2, AlertTriangle, ShieldCheck
} from "lucide-react";

interface MessageItem {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  createdAt: string;
  senderId: string;
}

export default function ChatThreadPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Date Proposal Modal State
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [locationNote, setLocationNote] = useState("");
  const [safetyTipsOpen, setSafetyTipsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then((p) => setConversationId(p.conversationId));
  }, [params]);

  const fetchMessages = () => {
    if (!conversationId) return;
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && conversationId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [status, conversationId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  const handleProposeDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !proposedTime) return;

    // Get matchId
    const matchesRes = await fetch("/api/matches").then((r) => r.json());
    const currentMatch = matchesRes.matches?.find(
      (m: any) => m.conversationId === conversationId
    );

    if (!currentMatch) return;

    const res = await fetch("/api/dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: currentMatch.matchId,
        locationName,
        proposedTime: new Date(proposedTime).toISOString(),
        locationNote,
      }),
    });

    if (res.ok) {
      setDateModalOpen(false);
      setSafetyTipsOpen(true); // Show safety tips modal
      fetchMessages();
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  const currentUserId = session?.user?.id;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl border border-[#E8E2DC] shadow-md overflow-hidden">
      {/* Thread Header */}
      <div className="p-4 border-b border-[#E8E2DC] flex items-center justify-between bg-[#FAF8F5]">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="text-[#5C5450] hover:text-[#1A1714]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-semibold text-sm text-[#1A1714]">Private Chat</h2>
        </div>

        <button
          onClick={() => setDateModalOpen(true)}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" /> Propose a Date
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#9C948C]">
            No messages yet. Send a greeting to start chatting!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs shadow-sm ${
                    isMe
                      ? "bg-[#C2446E] text-white rounded-br-none"
                      : "bg-white text-[#1A1714] border border-[#E8E2DC] rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-[#9C948C] mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#E8E2DC] bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-xs text-[#1A1714] focus:border-[#C2446E] outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="btn-primary p-2.5 rounded-xl flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Propose Date Modal */}
      {dateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-['Playfair_Display',serif] font-bold text-lg text-[#1A1714]">
              Propose a Date 🌹
            </h3>
            <form onSubmit={handleProposeDate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#5C5450] mb-1">Place / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Ocean Basket, Victoria Island"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-3 py-2 text-xs text-[#1A1714] focus:border-[#C2446E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C5450] mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-3 py-2 text-xs text-[#1A1714] focus:border-[#C2446E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C5450] mb-1">Note (Optional)</label>
                <textarea
                  placeholder="e.g. Let's meet at 7 PM for dinner..."
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF8F5] border border-[#E8E2DC] rounded-xl px-3 py-2 text-xs text-[#1A1714] focus:border-[#C2446E] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(false)}
                  className="btn-secondary flex-1 text-xs py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-xs py-2.5">
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Tips Modal */}
      {safetyTipsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FDF3D0] border border-[#B5860D] flex items-center justify-center mx-auto text-[#B5860D]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-['Playfair_Display',serif] font-bold text-lg text-[#1A1714]">
              Date Safety Checklist 🛡️
            </h3>
            <div className="text-left text-xs text-[#5C5450] space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2DC]">
              <p>📍 <strong>Meet in Public:</strong> Always arrange first dates in public places.</p>
              <p>📲 <strong>Tell a Friend:</strong> Share your location and date details with someone you trust.</p>
              <p>🚗 <strong>Own Transportation:</strong> Stay in control of how you get to and from the venue.</p>
            </div>
            <button
              onClick={() => setSafetyTipsOpen(false)}
              className="btn-primary w-full text-xs py-2.5"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

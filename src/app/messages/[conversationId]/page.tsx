"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Send, Calendar, MapPin, ShieldCheck,
  AlertTriangle, Loader2, Smile, Phone, MoreVertical,
  Check, CheckCheck, Heart
} from "lucide-react";

interface MessageItem {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  createdAt: string;
  senderId: string;
  read?: boolean;
}

// Nigerian venue suggestions for date proposals
const NIGERIAN_VENUES = [
  "Ocean Basket, Victoria Island, Lagos",
  "Nok by Alara, Lagos",
  "Yellow Chilli Restaurant, Abuja",
  "De Tastee Fried Chicken, Lagos",
  "Ember Creek, Victoria Island, Lagos",
  "Transcorp Hilton Rooftop, Abuja",
  "Bogobiri House, Ikoyi, Lagos",
  "Shiro Restaurant, Oniru, Lagos",
];

// Quick emoji reactions
const QUICK_EMOJIS = ["🔥", "💙", "😊", "🥂", "👀", "😍", "🙈", "❤️"];

const SAMPLE_MESSAGES: MessageItem[] = [
  {
    id: "m-1",
    content: "Hi! I saw your profile and I love your energy. Would you want to grab dinner sometime? 😊",
    mediaUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    senderId: "other",
    read: true,
  },
  {
    id: "m-2",
    content: "Thank you! That sounds really nice. I know a great rooftop spot in VI — Ocean Basket 🥂",
    mediaUrl: null,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    senderId: "me",
    read: true,
  },
  {
    id: "m-3",
    content: "Oh I love Ocean Basket! When are you free this weekend?",
    mediaUrl: null,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    senderId: "other",
    read: true,
  },
  {
    id: "m-4",
    content: "Saturday evening works perfectly for me! Shall we say 7 PM? 🌃",
    mediaUrl: null,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    senderId: "me",
    read: false,
  },
];

// Sample partner info keyed by conversationId
const CONV_PARTNERS: Record<string, { name: string; location: string; photo: string; username: string; isOnline: boolean }> = {
  "conv-1": { name: "Zainab, 24", location: "Victoria Island, Lagos", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80", username: "zainab_lagos", isOnline: true },
  "conv-2": { name: "Chioma, 25", location: "Maitama, Abuja", photo: "https://images.unsplash.com/photo-1598346762291-aee88549193f?auto=format&fit=crop&w=200&q=80", username: "chioma_abj", isOnline: true },
  "conv-3": { name: "Funke, 26", location: "Lekki Phase 1, Lagos", photo: "https://images.unsplash.com/photo-1535324492437-d8dea70a38a7?auto=format&fit=crop&w=200&q=80", username: "funke_lekki", isOnline: false },
  "conv-4": { name: "Amaka, 23", location: "GRA, Port Harcourt", photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80", username: "amaka_ph", isOnline: false },
};

export default function ChatThreadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId as string;

  const [messages, setMessages] = useState<MessageItem[]>(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [safetyTipsOpen, setSafetyTipsOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [locationNote, setLocationNote] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const partner = CONV_PARTNERS[conversationId] || {
    name: "Your Match",
    location: "Lagos, Nigeria",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
    username: "match",
    isOnline: false,
  };

  useEffect(() => {
    if (!conversationId) return;
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetch(`/api/conversations/${conversationId}/messages`)
        .then((r) => r.json())
        .then((data) => { if (data.messages?.length > 0) setMessages(data.messages); })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const optimisticMsg: MessageItem = {
      id: `local-${Date.now()}`,
      content: input,
      mediaUrl: null,
      createdAt: new Date().toISOString(),
      senderId: session?.user?.id || "me",
      read: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    const msgText = input;
    setInput("");

    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msgText }),
      });
    } catch {
    } finally {
      setSending(false);
    }
  };

  const sendEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleProposeDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !proposedTime) return;
    setDateModalOpen(false);
    setSafetyTipsOpen(true);
    // Add a system message showing the proposal
    const proposal: MessageItem = {
      id: `proposal-${Date.now()}`,
      content: `📅 Date Proposal: ${locationName} on ${new Date(proposedTime).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}${locationNote ? ` — "${locationNote}"` : ""}`,
      mediaUrl: null,
      createdAt: new Date().toISOString(),
      senderId: session?.user?.id || "me",
      read: false,
    };
    setMessages((prev) => [...prev, proposal]);
    try {
      const matchesRes = await fetch("/api/matches").then((r) => r.json());
      const match = matchesRes.matches?.find((m: any) => m.conversationId === conversationId);
      if (match) {
        await fetch("/api/dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId: match.matchId,
            locationName,
            proposedTime: new Date(proposedTime).toISOString(),
            locationNote,
          }),
        });
      }
    } catch {}
  };

  const currentUserId = session?.user?.id || "me";

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-90px)] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">

      {/* ── Chat Header ─────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Partner avatar */}
          <Link href={`/${partner.username}`} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
              <Image src={partner.photo} alt={partner.name} fill className="object-cover" />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  partner.isOnline ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900 group-hover:text-[#2563EB] transition-colors">
                  {partner.name}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin className="w-2.5 h-2.5 text-[#2563EB]" />
                <span>{partner.location}</span>
                {partner.isOnline && <span className="text-emerald-500 font-semibold ml-1">• Online now</span>}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDateModalOpen(true)}
            className="gradient-btn px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Propose Date
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Message List ─────────────────────────────── */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
        {/* Date Separator */}
        <div className="flex items-center gap-2 py-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400 font-semibold px-2">Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId || msg.senderId === "me";
          const isProposal = msg.content?.startsWith("📅 Date Proposal:");
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs shadow-sm leading-relaxed ${
                  isProposal
                    ? "bg-blue-50 border border-[#BFDBFE] text-[#1D4ED8] font-semibold"
                    : isMe
                    ? "bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[9px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {isMe && (
                  msg.read
                    ? <CheckCheck className="w-3 h-3 text-[#06B6D4]" />
                    : <Check className="w-3 h-3 text-gray-400" />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Emoji Quick Bar ─────────────────────────── */}
      {showEmojis && (
        <div className="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
          {QUICK_EMOJIS.map((em) => (
            <button
              key={em}
              onClick={() => sendEmoji(em)}
              className="text-xl hover:scale-125 transition-transform flex-shrink-0 cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* ── Message Input ─────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setShowEmojis((v) => !v)}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-all flex-shrink-0 cursor-pointer"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
        />

        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white shadow-md shadow-[#2563EB]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0 cursor-pointer"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* ── Propose Date Modal ──────────────────────── */}
      {dateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Propose a Date 🌹</h3>
            </div>

            <form onSubmit={handleProposeDate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Venue in Nigeria</label>
                <select
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="">Choose a venue...</option>
                  {NIGERIAN_VENUES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                  <option value="custom">Other (type below)</option>
                </select>
                {locationName === "custom" && (
                  <input
                    type="text"
                    placeholder="Type venue name..."
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Personal Note (Optional)</label>
                <textarea
                  placeholder="e.g. Looking forward to a lovely evening 🌙"
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-[#2563EB] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-btn py-2.5 text-xs font-bold cursor-pointer"
                >
                  Send Proposal 🌹
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Safety Tips Modal ──────────────────────── */}
      {safetyTipsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Date Safety Tips 🛡️</h3>
              <p className="text-xs text-gray-500 mt-1">Stay safe while having a great time!</p>
            </div>
            <div className="text-left text-xs text-gray-700 space-y-2.5 bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p>📍 <strong>Meet in Public:</strong> Always arrange first dates at busy public venues like restaurants or malls.</p>
              <p>📲 <strong>Tell a Friend:</strong> Share your date location and time with someone you trust.</p>
              <p>🚗 <strong>Own Transport:</strong> Drive yourself or use a ride app (Bolt/Uber) to stay in control.</p>
              <p>🚫 <strong>No Money Transfers:</strong> Never send money to someone you haven't met yet.</p>
            </div>
            <button
              onClick={() => setSafetyTipsOpen(false)}
              className="gradient-btn w-full py-3 text-sm font-bold cursor-pointer"
            >
              Got It, Stay Safe! ✅
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

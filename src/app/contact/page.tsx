"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submit — will wire to API when email configured
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">Contact Us</h1>
        <p className="text-xs text-stone-500">
          Safety reports, account questions, media removal requests, and general enquiries.
        </p>
      </div>

      {sent ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="font-serif-display text-xl font-bold text-stone-900">Message Received</h2>
          <p className="text-xs text-stone-600">Thank you for reaching out. Our team will review your message and respond within 24–48 hours.</p>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Enquiry Type</label>
              <select
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E]"
              >
                <option value="general">General Enquiry</option>
                <option value="safety">Safety or Abuse Report</option>
                <option value="media_removal">Media Removal Request</option>
                <option value="account">Account Support</option>
                <option value="moderation">Profile Moderation Question</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Message</label>
              <textarea
                rows={5}
                required
                placeholder="Describe your enquiry in detail..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#C2446E] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Safety reports are escalated to our moderation team within 4 hours. For immediate danger, contact local emergency services.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Enquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

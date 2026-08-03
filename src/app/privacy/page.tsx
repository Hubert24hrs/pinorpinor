import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">Privacy Policy</h1>
        <p className="text-xs text-stone-500">Last updated: August 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">1. Information We Collect</h2>
          <p>
            Pinorpinor collects basic account credentials (email address, encrypted password), profile details (display name, username, bio, date of birth for 18+ verification, city location), and uploaded media (photos, short videos).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">2. How Information is Used</h2>
          <p>
            We use collected data strictly to render public profiles, enforce age eligibility (18+), maintain platform security, prevent fraudulent activity, and enable platform-managed inquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">3. Location &amp; Contact Privacy</h2>
          <p>
            Public profiles display general city or regional location only. Precise street addresses and live GPS coordinates are never published. Private phone numbers and email addresses are never publicly visible on profile cards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">4. Account Data Export &amp; Deletion</h2>
          <p>
            Members may request data export or permanent account deletion at any time through their member dashboard. Upon deletion, profile data and media are removed from active databases.
          </p>
        </section>
      </div>
    </div>
  );
}

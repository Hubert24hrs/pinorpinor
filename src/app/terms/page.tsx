import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">Terms of Service</h1>
        <p className="text-xs text-stone-500">Last updated: August 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#E7E3DC] shadow-sm space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">1. Eligibility</h2>
          <p>
            Pinorpinor is an 18+ platform. By accessing or creating an account, you confirm you are at least 18 years old. Any attempt to circumvent age verification constitutes a serious violation and will result in permanent account termination and potential legal referral.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">2. Profile Submission Standards</h2>
          <p>
            Profiles submitted to Pinorpinor must be authentic. Impersonation, use of others&apos; photos without consent, or submission of AI-generated fictitious profiles are strictly forbidden. All submitted media undergoes human moderation review prior to public display.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">3. Prohibited Conduct</h2>
          <p>The following activities are strictly prohibited on Pinorpinor:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Solicitation of commercial sexual services, escort arrangements, or prostitution</li>
            <li>Human trafficking, coercion, or exploitation of any person</li>
            <li>Distribution of explicit sexual content without documented consent</li>
            <li>Harassment, threats, blackmail, or abusive communications</li>
            <li>Fraudulent identity, financial scams, or romance fraud targeting members</li>
            <li>Creation of profiles for individuals under 18 years of age</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">4. Content Moderation</h2>
          <p>
            Pinorpinor reserves the right to reject, remove, or modify any submitted profile, photo, video, or bio that violates these Terms of Service without prior notice. Accounts in serious breach will be permanently suspended.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">5. Termination</h2>
          <p>
            We reserve the right to terminate access to any account at our discretion if platform rules or community standards are violated. Members may delete their accounts at any time through the dashboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">6. Governing Law</h2>
          <p>
            These Terms are governed by applicable laws. Disputes shall be resolved through good-faith negotiation before legal action is pursued.
          </p>
        </section>
      </div>
    </div>
  );
}

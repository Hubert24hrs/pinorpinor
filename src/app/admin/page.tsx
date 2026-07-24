"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Flag, Check, X, Loader2 } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [role, setRole] = useState<string>("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      const userRole = session?.user?.role || "";
      setRole(userRole);
      if (!["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(userRole)) {
        router.push("/");
        return;
      }
      setLoading(false);
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#C2446E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
          Admin & Moderation <span className="text-[#C2446E]">Dashboard</span>
        </h1>
        <p className="text-xs text-[#9C948C] mt-1">
          Review user reports and verification selfie requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Queue */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-[#1A1714] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D7A4F]" /> Verification Queue
          </h2>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] text-center text-xs text-[#9C948C]">
            No pending photo verification requests.
          </div>
        </div>

        {/* Reports Queue */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-[#1A1714] flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#B83232]" /> User Reports Queue
          </h2>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] text-center text-xs text-[#9C948C]">
            No active unhandled reports.
          </div>
        </div>
      </div>
    </div>
  );
}

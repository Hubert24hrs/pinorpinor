import React from "react";
import Link from "next/link";
import { Heart, Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F4] border border-[#F4B8CB] flex items-center justify-center mx-auto text-[#C2446E]">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="font-['Playfair_Display',serif] font-bold text-2xl text-[#1A1714]">
          Under Maintenance
        </h1>
        <p className="text-xs text-[#5C5450] leading-relaxed">
          Pinorpinor is currently undergoing scheduled maintenance to upgrade system performance and security. We'll be back online shortly!
        </p>
        <div className="pt-2">
          <Link href="/">
            <button className="btn-primary text-xs py-2.5 px-6">
              Check Again
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

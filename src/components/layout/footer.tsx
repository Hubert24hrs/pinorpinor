"use client";

import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Heart, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#141216] text-stone-300 border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C2446E] to-[#7C1D38] flex items-center justify-center text-white shadow-md">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-serif-display font-bold text-2xl text-white tracking-tight">
                pinor<span className="text-[#C2446E]">pinor</span>
              </span>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Pinorpinor is a premium women-focused social discovery and meetup platform.
              Discover approved adult women profiles, explore verified members, and connect in a safe, moderated environment.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Strictly 18+ Age Gated • Moderated Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/women" className="hover:text-white transition-colors">
                  Browse Women
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Discover Profiles
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white transition-colors">
                  Browse Cities
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-[#C2446E] font-semibold hover:underline">
                  Join as a Woman
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trust &amp; Safety</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  Safety Centre
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Pinorpinor
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety#report" className="hover:text-white transition-colors">
                  Report Abuse
                </Link>
              </li>
              <li>
                <button
                  onClick={() => alert("Pinorpinor respects your privacy. Cookies are used for essential session security.")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Pinorpinor Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
            <Link href="/safety" className="hover:text-stone-300 transition-colors">Safety</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

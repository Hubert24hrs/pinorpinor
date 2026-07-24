import Link from "next/link";
import { Sparkles, Heart, Globe, Camera, Share2 } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "Explore Creators", href: "/explore" },
    { label: "Trending", href: "/trending" },
    { label: "Categories", href: "/categories" },
    { label: "Popular Creators", href: "/creators" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Community Guidelines", href: "/guidelines" },
    { label: "Cookie Policy", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "System Status", href: "#" },
    { label: "Report an Issue", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#09090B] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top section */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF2E88] to-[#7C3AED] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-[family-name:var(--font-poppins)] font-bold text-lg text-white">
                Pinor<span className="gradient-text">pinor</span>
              </span>
            </Link>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xs mb-6">
              Where creators connect with the world. Build your audience, share your passion, and grow your digital presence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: "#", label: "Web" },
                { icon: Camera, href: "#", label: "Media" },
                { icon: Share2, href: "#", label: "Share" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#A1A1AA] hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#A1A1AA]">
            © {new Date().getFullYear()} Pinorpinor. All rights reserved.
          </p>
          <p className="text-sm text-[#A1A1AA] flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-[#FF2E88] fill-[#FF2E88]" /> for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

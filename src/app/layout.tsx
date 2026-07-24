import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Montserrat } from "next/font/google";
import "./globals.css";

// ── Font Definitions ─────────────────────────────────────────
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// ── Site Metadata ────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Pinorpinor — Where Creators Connect with the World",
    template: "%s | Pinorpinor",
  },
  description:
    "Discover and follow your favorite creators. Share photos, videos, and connect with a global community on Pinorpinor — the premium creator platform.",
  keywords: [
    "creator platform", "social media", "content creators", "photo sharing",
    "video platform", "follow creators", "pinorpinor",
  ],
  authors: [{ name: "Pinorpinor" }],
  creator: "Pinorpinor",
  publisher: "Pinorpinor",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pinorpinor",
    title: "Pinorpinor — Where Creators Connect with the World",
    description:
      "Discover and follow your favorite creators. Share photos, videos, and connect with a global community.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pinorpinor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinorpinor — Where Creators Connect with the World",
    description: "Discover and follow your favorite creators on Pinorpinor.",
    images: ["/og-image.png"],
    creator: "@pinorpinor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF2E88",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ── Root Layout ──────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#09090B] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

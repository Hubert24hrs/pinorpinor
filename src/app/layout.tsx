import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Pinorpinor — Premium Women Social & Discovery Platform",
    template: "%s | Pinorpinor",
  },
  description:
    "Pinorpinor is a premium social discovery platform where adult women present public profiles, interests, photos and videos for authentic local meetups.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Pinorpinor — Premium Women Social Platform",
    description: "Discover verified adult women profiles and authentic local meetups.",
    type: "website",
    siteName: "Pinorpinor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF8F5] text-[#1C1917] min-h-screen flex flex-col selection:bg-[#C2446E]/20 selection:text-[#C2446E]">
        <NextAuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {children}
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}

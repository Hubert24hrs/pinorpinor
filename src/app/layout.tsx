import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Pinorpinor — Premium Dating & Date-Night Meetup Platform",
  description:
    "Discover verified dates, swipe & match, plan dinner meetups, VIP events, and private dates with 18+ verified profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0C0C0F] text-white min-h-screen flex flex-col selection:bg-[#FF4458]/30 selection:text-[#FF4458]">
        <NextAuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}

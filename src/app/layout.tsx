import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Pinorpinor — Premium Nigerian & International Dating Platform",
  description:
    "Discover verified Nigerian singles in Lagos, Abuja, Port Harcourt, and beyond. Plan dinner dates, VIP meetups, and exclusive dates with 18+ verified profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAFC] text-[#111827] min-h-screen flex flex-col selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
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

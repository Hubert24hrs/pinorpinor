import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Pinorpinor — Meet Verified Ladies for Dates & Events",
  description:
    "Discover verified ladies, plan dates, connect for VIP events, dinners, and exclusive meetups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: "#FAF8F5", color: "#1A1714" }}>
        <NextAuthProvider>
          <Sidebar />
          <Header />
          <main className="md:ml-[220px] min-h-[calc(100vh-64px)] p-4 sm:p-6 bg-[#FAF8F5]">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}

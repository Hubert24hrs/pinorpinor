import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Pinorpinor — Premium Ladies Showcase & Dating Meetup Platform",
  description:
    "Discover verified ladies, plan dates, connect live, and explore exclusive profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0f] text-white">
        <Sidebar />
        <Header />
        <main className="md:ml-[220px] min-h-[calc(100vh-64px)] p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VapiProvider } from "@/context/VapiContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomePathways — Forensic Equity Audits for BC Communities",
  description:
    "Data-driven pathways to systemic change for displaced communities across British Columbia. Speak with Claire, our AI voice assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <VapiProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </VapiProvider>
      </body>
    </html>
  );
}

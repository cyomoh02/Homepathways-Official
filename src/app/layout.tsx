import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VapiProvider } from "@/context/VapiContext";
import Script from "next/script";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomePathways — Forensic Equity Audits for BC Communities",
  description:
    "Data-driven pathways to systemic change for displaced communities across British Columbia. Speak with Claire, our AI voice assistant.",
  openGraph: {
    title: "HomePathways — Forensic Equity Audits for BC",
    description: "95+ forensic audits across 8 critical hubs. Evidence-based. Action-oriented.",
    url: "https://homepathways.ca",
    siteName: "HomePathways",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <VapiProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </VapiProvider>

        {/* ── Global Vapi Web Widget ──
             Stays active across all pages without restarting.
             The VapiProvider handles programmatic calls via ClaireButton.
             This script tag loads the Vapi widget as a persistent global overlay. */}
        <Script
          id="vapi-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var vapiKey = "${process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""}";
                var assistantId = "${process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || ""}";
                if (!vapiKey || !assistantId) return;

                window.__VAPI_CONFIG__ = {
                  publicKey: vapiKey,
                  assistantId: assistantId,
                  position: "bottom-right",
                  offset: "20px",
                };
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

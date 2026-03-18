import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
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
  title: "Homepathways — Guiding Every Home Journey",
  description:
    "Supporting first-time buyers, relocating families, downsizing retirees, probate estates, and aging-in-place homeowners across British Columbia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#050b1a] text-gray-200 min-h-screen`}
      >
        <VapiProvider>
          {children}
        </VapiProvider>

        {/* Global Vapi Widget — stays active across all pages */}
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

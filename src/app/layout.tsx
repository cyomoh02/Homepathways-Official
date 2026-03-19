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

        {/* Global Vapi Widget - Stays active across all pages */}
        <Script id="vapi-widget" strategy="afterInteractive">
          {`
            var vapiInstance = null;
            const assistant = "595d847e-a102-4ea9-b1c9-3bbc5a5f59b1";
            const apiKey = "497975b8-38f7-4501-8ee9-a6c4a2462a9e";
            (function (d, t) {
              var g = document.createElement(t), s = d.getElementsByTagName(t)[0];
              g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
              g.defer = true;
              g.async = true;
              s.parentNode.insertBefore(g, s);
              g.onload = function () {
                vapiInstance = window.vapiSDK.run({
                  apiKey: apiKey,
                  assistant: assistant,
                  config: { 
                    position: "bottom-right",
                    offset: "40px",
                    width: "60px",
                    height: "60px"
                  }
                });
              };
            })(document, "script");
          `}
        </Script>
      </body>
    </html>
  );
}

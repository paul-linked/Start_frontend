import type { Metadata, Viewport } from "next";
import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import { ClientProviders } from "@/components/layout/ClientProviders";
import "@/styles/globals.css";

// ─── Fonts ───
const fontDisplay = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Exo_2({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Metadata & PWA ───
export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_GAME_TITLE || "Game",
    template: `%s | ${process.env.NEXT_PUBLIC_GAME_TITLE || "Game"}`,
  },
  description: "A web-based game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: process.env.NEXT_PUBLIC_APP_NAME || "Game App",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // important for games
  themeColor: "#00d4ff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <head>
        {/* PWA / iOS splash */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="no-select">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
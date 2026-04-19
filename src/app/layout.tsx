import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

// Limit to three weights for a smaller font payload on mobile networks.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "ChopSave - Save food, save money",
  description:
    "Discover discounted surplus meals from your favourite spots in Accra. Rescue food, enjoy more, spend less.",
  applicationName: "ChopSave",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A8A2C",
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}

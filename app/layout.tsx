import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Live Logger",
    template: "%s | Live Logger",
  },

  description:
    "Real-time logging and monitoring system to track activities, alerts, and system changes efficiently.",

  keywords: [
    "Live Logger",
    "real-time logs",
    "monitoring system",
    "activity tracking",
    "server logs",
    "debugging tool",
  ],

  authors: [{ name: "Live Logger Team" }],
  creator: "Live Logger",

  // ✅ IMPORTANT (uncomment + fix)
  metadataBase: new URL("https://live-logger-puce.vercel.app"),

  openGraph: {
    title: "Live Logger",
    description:
      "Track real-time logs, alerts, and system activities with ease.",
    url: "https://live-logger-puce.vercel.app",
    siteName: "Live Logger",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Live Logger Main Preview",
      },
      {
        url: "/og-image-1.png",
        width: 1200,
        height: 630,
        alt: "Live Logger Secondary Preview",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Live Logger",
    description: "Monitor logs and system activities in real-time",

    // best single image use karo
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

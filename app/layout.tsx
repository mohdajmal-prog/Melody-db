import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import UnhandledRejectionLogger from "./components/diagnostics/unhandled-rejection";

export const metadata: Metadata = {
  title: "Melody - Fresh Farm to Your Home",
  description:
    "Direct farm-to-customer delivery of fresh meat, milk, vegetables with 100% transparency and verified farmers",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        {/* Diagnostics: log unhandledrejection and window errors to console */}
        <UnhandledRejectionLogger />
      </body>
    </html>
  );
}

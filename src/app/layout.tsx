import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Tool Hub - Professional Online Tools",
  description: "Task Tool Hub by Taskkora - Professional web tools for image compression, resizing, cropping, format conversion, QR code generation, and text conversion.",
  keywords: ["Task Tool Hub", "Taskkora", "image tools", "QR generator", "text converter", "online tools"],
  authors: [{ name: "Taskkora" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Task Tool Hub - Professional Online Tools",
    description: "Professional web tools for image processing, QR code generation, and text conversion by Taskkora",
    siteName: "Task Tool Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Tool Hub - Professional Online Tools",
    description: "Professional web tools for image processing, QR code generation, and text conversion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

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
  title: "Task Tool Hub - Free Online Calculators & Converters",
  description: "Task Tool Hub offers 20+ free online calculators and converters. Calculate, convert, and analyze with our professional tools including calculator, unit converter, currency converter, age calculator, and more.",
  keywords: ["calculator", "converter", "online tools", "unit converter", "currency converter", "age calculator", "percentage calculator", "color converter", "data storage converter", "task tool hub", "taskkora"],
  authors: [{ name: "Taskkora" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Task Tool Hub - Free Online Calculators & Converters",
    description: "20+ professional online tools for calculations, conversions, and data analysis",
    url: "https://tasktoolhub.com",
    siteName: "Task Tool Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Tool Hub - Free Online Calculators & Converters",
    description: "20+ professional online tools for calculations, conversions, and data analysis",
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

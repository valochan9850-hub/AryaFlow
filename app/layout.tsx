import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AryaFlow - Natural Weight Loss & Wellness Webinar",
  description: "Join the 60-minute Yoga Webinar that's helping busy people lose weight, sleep better, and feel calm again. Learn scientifically-proven techniques to achieve sustainable weight loss without counting calories.",
  keywords: "yoga, weight loss, wellness, stress management, natural healing, meditation, breathing exercises",
  authors: [{ name: "AryaFlow" }],
  openGraph: {
    title: "AryaFlow - Lose Weight Naturally in 2 Weeks",
    description: "Join our wellness webinar and transform your life with yoga and natural healing techniques.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}

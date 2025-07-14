import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FactCheck AI - AI-Powered Fact Checking",
  description: "Verify claims with AI-powered fact checking. Get instant analysis with confidence scores and source citations.",
  keywords: ["fact checking", "AI", "verification", "claims", "truth", "analysis"],
  authors: [{ name: "FactCheck AI" }],
  openGraph: {
    title: "FactCheck AI - AI-Powered Fact Checking",
    description: "Verify claims with AI-powered fact checking. Get instant analysis with confidence scores and source citations.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

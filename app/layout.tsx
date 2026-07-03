import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "FilingDesk — Compliance Workspace",
    template: "%s | FilingDesk",
  },
  description:
    "FilingDesk helps environmental consultants, engineering firms, and permit managers prepare regulatory filing packages from draft to final submission.",
  keywords: [
    "compliance",
    "regulatory filing",
    "environmental consulting",
    "permit management",
    "filing workspace",
  ],
  authors: [{ name: "FilingDesk" }],
  openGraph: {
    title: "FilingDesk — Compliance Workspace",
    description:
      "Prepare regulatory filing packages from draft to final submission.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
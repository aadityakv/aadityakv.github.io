import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaditya Venkateswaran",
  description: "Software Engineer at Meta — projects, writing, and resume.",
  openGraph: {
    title: "Aaditya Venkateswaran",
    description: "Software Engineer at Meta — projects, writing, and resume.",
    type: "website",
    url: "https://aadityakv.github.io/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${serif.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Nav />
        <main className="mx-auto max-w-2xl px-6 pb-28 pt-10 sm:pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

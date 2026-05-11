import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aaditya Venkateswaran",
  description: "Software Engineer at Meta — projects, writing, and resume.",
  openGraph: {
    title: "Aaditya Venkateswaran",
    description: "Software Engineer at Meta — projects, writing, and resume.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased font-sans">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

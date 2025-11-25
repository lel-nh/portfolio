import type { Metadata } from "next";
import { Geist, Geist_Mono, Sanchez } from "next/font/google";
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
  title: "lel",
  description: "Lélian's Portfolio",
  icons: {
    icon: '/favicon.ico',
  },
};


export const SanchezFont = Sanchez({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sanchez",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${SanchezFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

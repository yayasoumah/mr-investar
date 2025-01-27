import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mr. Investar - Italian Hospitality Investment Platform",
  description: "Italy's premier equity crowdfunding platform for hospitality investments",
  icons: {
    icon: [
      {
        url: "/logo/Favicons/browser.png",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "/logo/Favicons/iPhone.png",
        type: "image/png"
      }
    ],
    shortcut: [
      {
        url: "/logo/Favicons/Android.png",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}

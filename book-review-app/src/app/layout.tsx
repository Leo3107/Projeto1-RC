import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from "@/components/ui/StoreInitializer";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bookreview.app'),
  title: {
    template: '%s | BookShelf',
    default: 'BookShelf - Your Personal Book Review App',
  },
  description: "Discover new books, track your reading journey, and connect with other book lovers.",
  keywords: ["books", "reading", "book reviews", "book tracking", "reading list", "book recommendations"],
  authors: [{ name: "Book Review App Team" }],
  category: 'books',
  openGraph: {
    title: "BookShelf - Your Personal Book Review App",
    description: "Track your reading journey and share your thoughts with a community of readers.",
    url: "https://bookreview.app",
    siteName: "BookShelf App",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookShelf App",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookShelf - Your Personal Book Review App",
    description: "Track your reading journey and share your thoughts with a community of readers.",
    images: ["/images/twitter-image.jpg"],
    creator: "@bookshelfapp",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <StoreInitializer />
        <Navigation />
        {children}
      </body>
    </html>
  );
}

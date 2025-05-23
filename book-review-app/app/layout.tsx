import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Local CSS file
import { StoreInitializer } from "@/components/ui/StoreInitializer";
import Script from "next/script";
import AuthProvider from "@/components/ui/AuthProvider"; // Added AuthProvider import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookShelf - Your Personal Book Review App",
  description:
    "Keep track of the books you've read, are reading, and want to read.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script id="dark-mode-script" strategy="beforeInteractive">
          {`
            (function() {
              // Check if dark mode is stored in localStorage
              const darkModeStored = localStorage.getItem('darkMode');
              
              if (darkModeStored === 'true') {
                document.documentElement.classList.add('dark');
              } else if (darkModeStored === null) {
                // If no preference is stored, check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  document.documentElement.classList.add('dark');
                }
              }
            })()
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <StoreInitializer />
        <AuthProvider>
          {" "}
          {/* Wrapped children with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

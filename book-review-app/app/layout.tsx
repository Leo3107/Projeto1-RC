import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Local CSS file
import { StoreInitializer } from "@/components/ui/StoreInitializer";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const darkModeCookie = cookieStore.get("darkMode");
  const isDarkMode = darkModeCookie?.value === "true";

  return (
    <html lang="en" className={`h-full ${isDarkMode ? "dark" : ""}`}>
      <head>
        {/* The inline dark-mode-script has been removed. 
            Initial dark mode class on <html> is set based on the cookie for SSR anti-FOUC.
            Client-side hydration and dynamic updates are handled by StoreInitializer and uiStore.
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}

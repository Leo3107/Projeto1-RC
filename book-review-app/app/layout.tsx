import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Local CSS file
import { StoreInitializer } from "@/components/ui/StoreInitializer";
import Script from "next/script";
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
  // Check if darkMode cookie exists to support server-side rendering
  // This prevents hydration mismatch between server and client
  let isDarkMode = false;
  try {
    const cookieStore = cookies();
    const darkModeCookie = cookieStore.get("darkMode");
    isDarkMode = darkModeCookie?.value === "true";
  } catch {
    // Fallback if cookies are not available
  }

  return (
    <html lang="en" className={`h-full ${isDarkMode ? "dark" : ""}`}>
      <head>
        {" "}
        <Script id="dark-mode-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                // Check if dark mode is stored in localStorage
                const darkModeStored = localStorage.getItem('darkMode');
                
                if (darkModeStored === 'true') {
                  document.documentElement.classList.add('dark');
                  document.cookie = "darkMode=true; path=/; max-age=31536000";
                } else if (darkModeStored === 'false') {
                  document.documentElement.classList.remove('dark');
                  document.cookie = "darkMode=false; path=/; max-age=31536000";
                } else {
                  // If no preference is stored, check system preference
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('darkMode', 'true');
                    document.cookie = "darkMode=true; path=/; max-age=31536000";
                  } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('darkMode', 'false');
                    document.cookie = "darkMode=false; path=/; max-age=31536000";
                  }
                }
              } catch (e) {
                console.error('Error setting up dark mode:', e);
              }
            })()
          `}
        </Script>
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

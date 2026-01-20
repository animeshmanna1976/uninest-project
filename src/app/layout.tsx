import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "UniNest - Student Housing & Rental Platform",
    template: "%s | UniNest",
  },
  description:
    "Find your perfect home near college. UniNest connects students with verified properties, trustworthy landlords, and potential roommates.",
  keywords: [
    "student housing",
    "pg near college",
    "student accommodation",
    "rental properties",
    "roommate finder",
    "hostel",
    "flat for students",
  ],
  authors: [{ name: "UniNest" }],
  creator: "UniNest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://uninest.com",
    siteName: "UniNest",
    title: "UniNest - Student Housing & Rental Platform",
    description:
      "Find your perfect home near college. UniNest connects students with verified properties and trustworthy landlords.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UniNest - Student Housing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniNest - Student Housing & Rental Platform",
    description: "Find your perfect home near college.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

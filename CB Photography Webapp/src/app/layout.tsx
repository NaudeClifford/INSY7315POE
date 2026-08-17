// Root Layout component defining global typography fonts, metadata, and HTML structure
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Google Serif font for editorial headings
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Google Sans-Serif font for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Mobile Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#402615",
};

// Search Engine Optimization (SEO) metadata tags & favicon icons
export const metadata: Metadata = {
  title: "Camryn Burger Photography | Luxury South African Photography",
  description: "Timeless wedding, matric dance, graduation, corporate event, and couples photography by Camryn Burger in South Africa.",
  keywords: ["Camryn Burger Photography", "South Africa Wedding Photographer", "Krugersdorp Photography", "Matric Dance Photography", "Corporate Photography"],
  icons: {
    icon: "/logos/cb-logo-brown.jpeg",
    shortcut: "/logos/cb-logo-brown.jpeg",
    apple: "/logos/cb-logo-brown.jpeg",
  },
};

// Main HTML shell wrapper enclosing all page routes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7f3ed] text-[#402615]">
        {children}
      </body>
    </html>
  );
}



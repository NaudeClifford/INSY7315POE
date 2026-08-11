// Root Layout component defining global typography fonts, metadata, and HTML structure
import type { Metadata } from "next";
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

// Search Engine Optimization (SEO) metadata tags & favicon icons
export const metadata: Metadata = {
  title: "Camryn Burger Photography | The Union Lab | Luxury South African Photography",
  description: "Timeless wedding, matric dance, graduation, corporate event, and couples photography by Camryn Burger and The Union Lab team in South Africa.",
  keywords: ["Camryn Burger Photography", "The Union Lab", "South Africa Wedding Photographer", "Krugersdorp Photography", "Matric Dance Photography", "Corporate Photography"],
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
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7f3ed] text-[#402615]">
        {children}
      </body>
    </html>
  );
}



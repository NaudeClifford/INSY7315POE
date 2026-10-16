import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeContext";
import Script from "next/script";
import "./globals.css";

// Google Serif font for editorial headlines
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2C2420",
};

export const metadata: Metadata = {
  title: "Camryn Burger Photography | Luxury South African Photography Studio",
  description: "Timeless wedding, matric dance, graduation, corporate event, and couples photography by Camryn Burger in South Africa.",
  keywords: [
    "Camryn Burger Photography",
    "South Africa Wedding Photographer",
    "Krugersdorp Photography Studio",
    "Matric Dance Photography",
    "Corporate Photography Gauteng"
  ],
  icons: {
    icon: "/logos/cb-logo-brown.jpeg",
    shortcut: "/logos/cb-logo-brown.jpeg",
    apple: "/logos/cb-logo-brown.jpeg",
  },
};

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>

        {/* Chatling AI Customer Support Chatbot */}
        <Script
          id="chtl-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.chtlConfig = {
                chatbotId: "9364244967"
              };
            `,
          }}
        />
        <Script
          id="chtl-script"
          strategy="afterInteractive"
          data-id="9364244967"
          src="https://chatling.ai/js/embed.js"
        />
      </body>
    </html>
  );
}

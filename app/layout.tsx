import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import OptimizedBackground from "@/components/optimized-background";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Decoding Seabirds",
  description: "Musical artist with sample tracks",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to SoundCloud domains for faster connection */}
        <link rel="preconnect" href="https://api-widget.soundcloud.com" />
        <link rel="preconnect" href="https://wave.sndcdn.com" />
        <link rel="preconnect" href="https://widget.sndcdn.com" />
        <link rel="preconnect" href="https://i1.sndcdn.com" />
        <link rel="dns-prefetch" href="https://w.soundcloud.com" />
      </head>
      <body
        className={` ${inter.variable}  antialiased m-auto textured-background`}
      >
        <OptimizedBackground />
        <Nav />
        {children}
        <CustomCursor />
        <Footer />

        {/* Load SoundCloud API script with defer for better performance */}
        {/* <Script
          src="https://w.soundcloud.com/player/api.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        /> */}
      </body>
    </html>
  );
}

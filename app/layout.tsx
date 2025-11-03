import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decoding Seabirds",
  description: "Musical artist with sample tracks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api-widget.soundcloud.com" />
        <link rel="preconnect" href="https://wave.sndcdn.com" />
        <link rel="preconnect" href="https://widget.sndcdn.com" />
        <link rel="preconnect" href="https://i1.sndcdn.com" />
        <script src="https://w.soundcloud.com/player/api.js" async />
      </head>
      <body
        className={` ${inter.variable}  antialiased m-auto textured-background`}
      >
        <Nav />
        {children}
        <CustomCursor />
        <Footer />
      </body>
    </html>
  );
}

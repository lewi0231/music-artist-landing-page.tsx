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
  description:
    "“Decoding Seabirds is the ambient/electronic music project of synth enthusiast Paul Lewis, based in Adelaide, Australia. With analogue and digital synths, guitars and occasional vocal samples, the music creates wide-open, atmospheric sound-scapes with subtle grooves. Originally manifested in the 2018 EP Ignition, the project has continued evolving to more recent singles such as ‘Singing Into Clouds’. ",
  icons: {
    icon: "/bird-logo.svg",
    shortcut: "/bird-logo.svg",
  },
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
        <link rel="preconnect" href="https://w.soundcloud.com" />
        <link rel="preconnect" href="https://soundcloud.com" />
      </head>
      <body
        className={` ${inter.variable}  antialiased m-auto textured-background`}
      >
        <OptimizedBackground />
        <Nav />
        {children}
        <CustomCursor />
        <Footer />
      </body>
    </html>
  );
}

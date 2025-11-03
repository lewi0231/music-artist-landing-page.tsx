"use client";

import Image from "next/image";

import ParallaxSection from "@/components/parallax-section";
import Section from "@/components/section";
import Hero from "../components/hero";

const tracks = [
  {
    title: "Corridors",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/corridors",
  },
  {
    title: "Marble Sea",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/marble-sea",
  },
  {
    title: "From Here",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/master-from-here",
  },
  {
    title: "Dark Lights",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/dark-lights",
  },
  {
    title: "Home",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/home-final-mix-003",
  },
  {
    title: "Ignition",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/ignition",
  },
  {
    title: "Singing Into Clouds",
    platform: "soundcloud" as const,
    url: "https://soundcloud.com/decodingseabirds/singing-into-clouds",
  },
];

export default function Home() {
  return (
    <div className=" mx-auto">
      <main className="mt-28 sm:mt-40">
        <Hero />
        <ParallaxSection tracks={tracks} />
        <Section
          id="music"
          weirdIdentifier="PLP828"
          title="Ignition"
          audioSrc="/ignition.mp3"
          iconName="CarFront"
        >
          <Image
            alt="Circle Space"
            src="/circle.jpg"
            width={800}
            height={500}
            className="w-full h-auto aspect-auto opacity-75 rounded-2xl"
          />
        </Section>
        <Section
          title={"Singing Into Clouds"}
          weirdIdentifier={"LEWI0231"}
          audioSrc="/singing_into_clouds.mp3"
          iconName="Speaker"
        >
          <Image
            alt="Circle Space"
            src="/clouds.jpg"
            width={1920}
            height={1080}
            className="w-full h-auto aspect-auto opacity-75 rounded-2xl"
          />
        </Section>
      </main>
    </div>
  );
}

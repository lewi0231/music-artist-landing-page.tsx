"use client";

import Image from "next/image";

import MusicSlider from "@/components/music-slider";
import Section from "@/components/section";
import Hero from "../components/hero";

export default function Home() {
  return (
    <div className=" mx-auto">
      <main className="mt-40">
        <Hero />

        <Section
          sectionIndex="01/"
          weirdIdentifier="PLP828"
          title="Ignition"
          audioSrc="/ignition.mp3"
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
          sectionIndex={"02/"}
          title={"Singing Into Clouds"}
          weirdIdentifier={"LEWI0231"}
          audioSrc="/singing_into_clouds.mp3"
        >
          <Image
            alt="Circle Space"
            src="/clouds.jpg"
            width={800}
            height={500}
            className="w-full h-auto aspect-auto opacity-75 rounded-2xl"
          />
        </Section>

        {/* Music Slider Section */}
        <MusicSlider
          sectionIndex="03/"
          weirdIdentifier="TRACKS"
          tracks={[
            {
              title: "Ignition",
              platform: "spotify",
              url: "YOUR_SPOTIFY_TRACK_ID", // Replace with actual Spotify track ID
            },
            {
              title: "Singing Into Clouds",
              platform: "soundcloud",
              url: "https://soundcloud.com/YOUR_USERNAME/YOUR_TRACK", // Replace with actual SoundCloud URL
            },
            // Add more tracks as needed
          ]}
        />
      </main>
    </div>
  );
}

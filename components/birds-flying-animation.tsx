"use client";

import animationData from "@/public/animations/birdies.json";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function BirdsFlyingAnimation({ className }: { className: string }) {
  return <Lottie animationData={animationData} className={className} />;
}

export default BirdsFlyingAnimation;

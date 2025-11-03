import animationData from "@/public/animations/birdies.json";
import Lottie from "lottie-react";

function BirdsFlyingAnimation({ className }: { className: string }) {
  return <Lottie animationData={animationData} className={className} />;
}

export default BirdsFlyingAnimation;

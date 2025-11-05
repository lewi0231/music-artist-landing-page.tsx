import Image from "next/image";

/**
 * Optimized background component that uses Next.js Image optimization
 * for responsive sizing and modern formats (AVIF/WebP) instead of CSS background-image
 */
function OptimizedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src="/seabirds-background.jpg"
        alt=""
        fill
        priority
        quality={70} // Lower quality for mobile optimization
        sizes="100vw"
        className="object-cover mix-blend-soft-light opacity-[var(--texture-opacity,0.15)] transition-opacity duration-300 ease-out"
        style={{
          willChange: "opacity",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
export default OptimizedBackground;

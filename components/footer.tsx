"use client";

import AnimatedSeparator from "./animated-separator";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="uppercase -mt-14">
      <AnimatedSeparator />
      <div className="flex justify-between items-center text-foreground/70 text-xs">
        <div className="">
          <button
            onClick={scrollToTop}
            className="hover:text-foreground transition-colors uppercase cursor-pointer"
          >
            Back To Top
          </button>
        </div>
        <div className="flex gap-6 py-10">
          <a href={""}>Mail</a>
          <a href={""}>github</a>
          <a href={""}>instagram</a>
          <a href={""}>x</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;

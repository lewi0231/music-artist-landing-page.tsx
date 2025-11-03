"use client";

import AnimatedSeparator from "./animated-separator";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="uppercase md:-mt-14 w-5/6 mx-auto">
      <AnimatedSeparator />
      <div className="flex justify-between items-center text-foreground/70 text-xs">
        <div className="">
          <button
            onClick={scrollToTop}
            data-pointer
            className="hover:text-foreground transition-colors uppercase cursor-pointer"
          >
            Back To Top
          </button>
        </div>
        <div className="flex gap-6 py-10">
          <a href={""} data-pointer>
            Mail
          </a>
          <a href={""} data-pointer>
            github
          </a>
          <a href={""} data-pointer>
            instagram
          </a>
          <a href={""} data-pointer>
            x
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;

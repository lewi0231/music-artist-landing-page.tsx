// const textLines = ["DECODING", "SEABIRDS"];

import TitlePullUp from "./title-pull-up";
import WordsPullUp from "./word-pull-up";

export default function Hero() {
  return (
    <section className="hero-section h-screen flex flex-col items-start pt-4 mb-10">
      <div className="flex-1 items-start font-inter font-semibold">
        <TitlePullUp text="DECODING SEABIRDS" />
      </div>

      <div className="w-full pb-6 mb-4">
        <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto px-4 -mt-40 font-inter font-light tracking-widest">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">
            <WordsPullUp text="Selected Tracks" delay={1} className="" />
          </div>
          <div className="col-span-1">
            <WordsPullUp text="DS-3" delay={1} className="text-right" />
          </div>
        </div>
      </div>
    </section>
  );
}

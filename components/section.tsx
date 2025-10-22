import AnimatedSeparator from "./animated-separator";
import AudioPlayWrapper from "./audio-play-wrapper";
import ImagePullUpWrapper from "./image-pull-up-wrapper";
import WordsPullUp from "./word-pull-up";

export default function Section({
  children,
  sectionIndex,
  title,
  weirdIdentifier,
  audioSrc,
}: {
  children: React.ReactNode;
  sectionIndex: string;
  title: string;
  weirdIdentifier: string;
  audioSrc: string;
}) {
  return (
    <section className="mb-40">
      <AnimatedSeparator />
      <div className="relative pt-10">
        {/* Top row: 01/ and image */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 flex flex-col items-start">
            <div className="text-8xl font-mono font-light leading-20">
              {sectionIndex}
            </div>
            <div className="grid grid-cols-3 h-full w-full">
              <div className="col-span-1 flex items-end justify-start">
                <div className="-rotate-90 whitespace-nowrap text-sm font-thin my-4">
                  <WordsPullUp text={weirdIdentifier} delay={0.75} />
                </div>
              </div>
              <div className="col-span-1 text-5xl flex items-end justify-end">
                <WordsPullUp text="&#x21B3;" delay={0.75} />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <ImagePullUpWrapper delay={0.5}>
              <AudioPlayWrapper audioSrc={audioSrc}>
                {children}
              </AudioPlayWrapper>
            </ImagePullUpWrapper>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="col-span-2"></div>
          <div className="col-span-3 text-[7rem] flex items-end leading-28 tracking-tight">
            <WordsPullUp text={title} delay={0.75} />
          </div>
        </div>
      </div>
    </section>
  );
}

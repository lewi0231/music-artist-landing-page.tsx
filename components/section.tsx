import { cn } from "@/lib/utils";
import AnimatedSeparator from "./animated-separator";
import AudioPlayWrapper from "./audio-play-wrapper";
import Icon, { IconName } from "./icon";
import ImagePullUpWrapper from "./image-pull-up-wrapper";
import WordsPullUp from "./word-pull-up";

export default function Section({
  children,
  title,
  weirdIdentifier,
  audioSrc,
  id,
  iconName,
}: {
  children: React.ReactNode;
  title: string;
  weirdIdentifier: string;
  audioSrc?: string;
  id?: string;
  iconName: IconName;
}) {
  return (
    <section className="mb-20 md:mb-40 w-5/6 mx-auto" id={id}>
      <AnimatedSeparator />
      <div className="relative md:pt-10">
        {/* Mobile: flex-col layout, Desktop: grid layout */}
        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-4">
          {/* Section Index */}
          <div className="md:col-span-2 flex flex-col items-start">
            <div className="text-5xl sm:text-7xl md:text-8xl font-mono font-light leading-16 sm:leading-24 transition-all duration-500 py-4 sm:py-2">
              <Icon
                name={iconName}
                className={cn(
                  "sm:w-40 sm:h-40 sm:-ml-6 h-24 w-24 transition-all duration-500"
                )}
                strokeWidth={0.8}
              />
            </div>
            {/* Bottom left elements (visible on desktop) */}
            <div className="hidden md:grid grid-cols-3 h-full w-full">
              <div className="col-span-1 flex items-end justify-start">
                <div className="-rotate-90 whitespace-nowrap font-thin mb-4 -ml-4 sm:text-sm text-xs transition-all duration-500">
                  <WordsPullUp text={weirdIdentifier} delay={0.75} />
                </div>
              </div>
              <div className="col-span-1 lg:text-6xl flex items-end justify-end sm:text-3xl text-2xl transition-all duration-500">
                <WordsPullUp text="&#x27B3;" delay={0.75} />
              </div>
            </div>
          </div>

          {/* Image / Content */}
          <div className="md:col-span-3">
            <ImagePullUpWrapper delay={0.5}>
              {audioSrc ? (
                <AudioPlayWrapper audioSrc={audioSrc}>
                  {children}
                </AudioPlayWrapper>
              ) : (
                children
              )}
            </ImagePullUpWrapper>
          </div>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-4 md:mt-4">
          <div className="hidden md:block md:col-span-2"></div>
          <div className="md:col-span-3 text-[3rem] sm:text-[5rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] flex items-end leading-14 sm:leading-24 md:leading-24 lg:leading-28 xl:leading-32 md:tracking-normal transition-all duration-500 tracking-wide py-4">
            <WordsPullUp text={title} delay={0.75} />
          </div>
        </div>

        {/* Bottom corner elements (visible on mobile) */}
        <div className="md:hidden grid grid-cols-2 sm:gap-4 sm:mt-4">
          <div className="flex items-end justify-start text-2xl transition-all duration-500">
            <WordsPullUp text="&#x27B3;" delay={0.75} />
          </div>
          <div className="flex items-end justify-end">
            <div className="whitespace-nowrap mb-2 font-thin text-xs transition-all duration-500">
              <WordsPullUp text={weirdIdentifier} delay={0.75} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

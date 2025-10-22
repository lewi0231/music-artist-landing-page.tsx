"use client";

import { useIsScrollAtTop } from "@/hooks/use-is-scroll-at-top";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import FlickNavItem from "./flick-nav-item";

export default function Nav({ className }: { className?: string }) {
  const isAtTop = useIsScrollAtTop();

  return (
    <AnimatePresence>
      {isAtTop && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
        >
          <div className="w-5/6 mx-auto">
            <nav className="flex flex-col ">
              <div className="flex justify-between sm:py-14 py-8 transition-all">
                <div className="text-2xl">
                  <Image
                    src="/bird-logo.svg"
                    width={32}
                    height={32}
                    alt="bird logo"
                  />
                </div>
                <div
                  className={cn(
                    "flex justify-between gap-6 text-lg font-light",
                    className
                  )}
                >
                  <FlickNavItem>About</FlickNavItem>
                  <FlickNavItem>Music</FlickNavItem>
                </div>
              </div>
              <hr></hr>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

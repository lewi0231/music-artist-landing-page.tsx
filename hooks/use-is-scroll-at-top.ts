import { useEffect, useState } from "react";

export const useIsScrollAtTop = (
  ref?: React.RefObject<HTMLElement>
): boolean => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const target = ref?.current || window;
    const handleScroll = () => {
      if (ref?.current) {
        setIsAtTop(ref.current.scrollTop === 0);
      } else {
        setIsAtTop(window.scrollY === 0);
      }
    };
    handleScroll();
    target.addEventListener("scroll", handleScroll);
    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);
  return isAtTop;
};

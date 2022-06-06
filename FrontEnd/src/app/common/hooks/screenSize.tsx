import { useLayoutEffect, useState } from 'react';

export enum SCREEN_SIZES {
  DESKTOP = 'desktop',
  TAB = 'tab',
  MOBILE = 'mobile',
}

type Hook = () => string;

export const useWindowSize: Hook = () => {
  const [screenSize, setScreenSize] = useState(SCREEN_SIZES.DESKTOP);
  useLayoutEffect(() => {
    function updateSize() {
      if (window.matchMedia('(max-width: 767px)').matches) {
        setScreenSize(SCREEN_SIZES.MOBILE);
      } else if (
        window.matchMedia('(min-width: 768px) and (max-width: 1200px)').matches
      ) {
        setScreenSize(SCREEN_SIZES.TAB);
      } else {
        setScreenSize(SCREEN_SIZES.DESKTOP);
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return screenSize;
};

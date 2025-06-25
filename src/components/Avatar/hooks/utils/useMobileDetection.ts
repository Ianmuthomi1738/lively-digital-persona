
import { useMemo, useRef } from 'react';

export const useMobileDetection = () => {
  const isMobileRef = useRef(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    isMobileRef.current = mobile;
    return mobile;
  }, []);

  return { isMobile, isMobileRef };
};

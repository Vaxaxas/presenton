import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollProgress: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollProgress: 0,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProps {
  children: React.ReactNode;
  onScrollProgress?: (progress: number) => void;
  onLenisReady?: (lenis: Lenis) => void;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  onScrollProgress,
  onLenisReady,
}) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Initialize Lenis virtual scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);
    onLenisReady?.(lenis);

    // Synchronize Lenis with GSAP ScrollTrigger
    const onScroll = () => {
      ScrollTrigger.update();
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
      setProgress(currentProgress);
      onScrollProgress?.(currentProgress);
    };

    lenis.on('scroll', onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [onScrollProgress, onLenisReady]);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollProgress: progress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

import { useState, useEffect, useRef } from 'react';

export interface PerformanceState {
  fps: number;
  isLowPerformance: boolean;
  manualOverride: boolean;
  setManualLowPerf: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function usePerformanceGuard(): PerformanceState {
  const [fps, setFps] = useState<number>(60);
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false);
  const [manualOverride, setManualOverride] = useState<boolean>(false);

  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const lowFpsDurationRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const checkPerformance = (now: number) => {
      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);

        // Track low FPS occurrences
        if (currentFps < 40) {
          lowFpsDurationRef.current += 1;
          // If low FPS lasts for 3 consecutive seconds and not manually overridden
          if (lowFpsDurationRef.current >= 3 && !manualOverride) {
            setIsLowPerformance(true);
            console.warn('[PerformanceGuard] Low FPS detected (<40 FPS for 3s). Automatically downgraded to high-compatibility mode.');
          }
        } else {
          lowFpsDurationRef.current = 0;
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(checkPerformance);
    };

    animationFrameId = requestAnimationFrame(checkPerformance);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [manualOverride]);

  const setManualLowPerf = (value: boolean | ((prev: boolean) => boolean)) => {
    setManualOverride(true);
    if (typeof value === 'function') {
      setIsLowPerformance(prev => value(prev));
    } else {
      setIsLowPerformance(value);
    }
  };

  return {
    fps,
    isLowPerformance,
    manualOverride,
    setManualLowPerf,
  };
}

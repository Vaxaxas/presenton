import React, { useState, useEffect } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Scene } from './components/canvas/Scene';
import { Overlay } from './components/dom/Overlay';
import { HeaderNav } from './components/dom/HeaderNav';
import { usePresentationControls } from './hooks/usePresentationControls';
import { usePerformanceGuard } from './hooks/usePerformanceGuard';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [lenisInstance, setLenisInstance] = useState<any>(null);
  const totalSections = 8; // Scene 0 to 7

  const { fps, isLowPerformance, setManualLowPerf } = usePerformanceGuard();

  const {
    activeSection,
    setActiveSection,
    scrollToSection,
    isFullscreen,
    toggleFullscreen,
  } = usePresentationControls({
    totalSections,
    lenisInstance,
  });

  // Calculate active section based on scroll progress
  useEffect(() => {
    const calculatedIndex = Math.min(
      totalSections - 1,
      Math.max(0, Math.round(scrollProgress * (totalSections - 1)))
    );
    setActiveSection(calculatedIndex);
  }, [scrollProgress, totalSections, setActiveSection]);

  const handleToggleLowPerformance = () => {
    setManualLowPerf((prev) => !prev);
  };

  return (
    <SmoothScroll
      onScrollProgress={setScrollProgress}
      onLenisReady={setLenisInstance}
    >
      <div className="relative min-h-screen bg-[#FBF8F6] text-[#1C1917] selection:bg-stone-200 selection:text-stone-900 font-sans">
        {/* Top Navigation HUD */}
        <HeaderNav
          activeSection={activeSection}
          totalSections={totalSections}
          onNavigate={scrollToSection}
          fps={fps}
          isLowPerformance={isLowPerformance}
          onToggleLowPerformance={handleToggleLowPerformance}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* 3D WebGL Canvas Layer (Fixed Background) */}
        <Scene
          scrollProgress={scrollProgress}
          isLowPerformance={isLowPerformance}
        />

        {/* Scrollytelling DOM Overlay (Foreground Content) */}
        <Overlay />
      </div>
    </SmoothScroll>
  );
};

export default App;

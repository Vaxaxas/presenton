import { useEffect, useState, useCallback } from 'react';

interface PresentationControlsOptions {
  totalSections: number;
  onNavigate?: (index: number) => void;
  lenisInstance?: any;
}

export function usePresentationControls({
  totalSections,
  onNavigate,
  lenisInstance,
}: PresentationControlsOptions) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const scrollToSection = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalSections - 1));
      const sectionElements = document.querySelectorAll<HTMLElement>('.scene-section');
      const targetElement = sectionElements[clampedIndex];

      if (targetElement) {
        if (lenisInstance) {
          lenisInstance.scrollTo(targetElement, {
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        setActiveSection(clampedIndex);
        onNavigate?.(clampedIndex);
      }
    },
    [totalSections, lenisInstance, onNavigate]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Space key
          e.preventDefault();
          scrollToSection(activeSection + 1);
          break;

        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(activeSection - 1);
          break;

        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;

        case 'End':
          e.preventDefault();
          scrollToSection(totalSections - 1);
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [activeSection, scrollToSection, toggleFullscreen, totalSections]);

  return {
    activeSection,
    setActiveSection,
    scrollToSection,
    isFullscreen,
    toggleFullscreen,
  };
}

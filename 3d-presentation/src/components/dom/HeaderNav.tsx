import React from 'react';
import { PRESENTATION_DATA } from '../../data/slides';
import { Printer, Maximize2, Minimize2, Cpu, ChevronDown } from 'lucide-react';

interface HeaderNavProps {
  activeSection: number;
  totalSections: number;
  onNavigate: (index: number) => void;
  fps: number;
  isLowPerformance: boolean;
  onToggleLowPerformance: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSection,
  onNavigate,
  fps,
  isLowPerformance,
  onToggleLowPerformance,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const sectionNames = [
    '扉頁',
    '團隊',
    '隱形鐵籠',
    '溝通神話',
    '符號階序',
    '命名權力',
    '直男護甲',
    '換你答',
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="curatorial-panel rounded-full px-5 py-2.5 flex items-center justify-between pointer-events-auto border border-stone-200/90 shadow-sm">
          {/* Left: Academic Meta */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-stone-800" />
            <div>
              <span className="font-serif text-xs font-bold tracking-tight text-ink block truncate max-w-[160px] sm:max-w-none">
                {PRESENTATION_DATA.meta.mainTitle}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {PRESENTATION_DATA.meta.group} ｜ {PRESENTATION_DATA.meta.instructor}
              </span>
            </div>
          </div>

          {/* Center: Curatorial Chapter Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-full border border-stone-200/60">
            {sectionNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeSection === idx
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* FPS & Performance Mode Toggle */}
            <button
              onClick={onToggleLowPerformance}
              title={`切換效能模式 (目前: ${isLowPerformance ? '相容模式' : '標準模式'})`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors border ${
                isLowPerformance
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              <span>{fps} FPS</span>
            </button>

            {/* Clicker Hint Pill */}
            <div
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] text-stone-500"
              title="簡報筆相容：按 PageDown 或 ↓ 切換下一頁"
            >
              <ChevronDown className="w-3.5 h-3.5 text-stone-600" />
              <span>PgDn / ↓</span>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              title="列印為 PDF 簡報講義"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">列印</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              title="全螢幕 (按 F 鍵)"
              className="p-1.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

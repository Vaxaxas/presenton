import React from 'react';
import { PRESENTATION_DATA, SectionContent } from '../../data/slides';
import { TeamGrid } from './TeamGrid';
import {
  ChevronDown,
  Quote,
  ArrowRight,
  HelpCircle,
  Check,
} from 'lucide-react';

export const Overlay: React.FC = () => {
  return (
    <div className="relative z-10 pointer-events-none w-full">
      {/* =======================================================================
          SCENE 0: HERO / ENTRANCE 【話語的重力】
          ======================================================================= */}
      <section className="scene-section min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          {/* Metadata Curatorial Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
            <span className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-wide">
              {PRESENTATION_DATA.meta.course}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-wide">
              授課教師：{PRESENTATION_DATA.meta.instructor}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold tracking-wide">
              {PRESENTATION_DATA.meta.group}
            </span>
          </div>

          {/* Editorial Serif Typography Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-ink mb-6 leading-tight">
            {PRESENTATION_DATA.meta.mainTitle}
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-stone-600 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
            {PRESENTATION_DATA.meta.mainSubtitle}
          </p>

          {/* Curatorial Quote Plaque */}
          <div className="curatorial-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto mb-12 text-left border-l-4 border-l-stone-900">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Quote className="w-3.5 h-3.5 text-stone-700" />
              <span>導讀文本 ｜ {PRESENTATION_DATA.meta.textbook}</span>
            </div>
            <p className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed font-normal">
              {PRESENTATION_DATA.meta.quote}
            </p>
          </div>

          {/* Scroll Down Prompt */}
          <div className="inline-flex flex-col items-center gap-2 text-stone-400 text-xs font-medium">
            <span>向下滑動探索 · 進入 3D 空間敘事</span>
            <ChevronDown className="w-4 h-4 text-stone-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* =======================================================================
          SCENE 1: TEAM BENTO GRID 【10 位解構者】
          ======================================================================= */}
      <section className="scene-section min-h-screen flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8">
        <TeamGrid />
      </section>

      {/* =======================================================================
          SCENES 2 - 6: CHAPTER SECTIONS (Awwwards Style Curatorial Plaques)
          ======================================================================= */}
      {PRESENTATION_DATA.sections.map((section: SectionContent, index: number) => (
        <section
          key={section.id}
          className="scene-section min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto w-full pointer-events-auto">
            {/* Curatorial Chapter Header */}
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-400 uppercase mb-3">
                <span className="font-mono text-stone-800 font-bold">SEC. 0{index + 1}</span>
                <span>/</span>
                <span className="text-stone-600">{section.chapter}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight mb-3">
                {section.title}
              </h2>
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed font-normal">
                {section.subtitle}
              </p>
            </div>

            {/* Clean 3-Card Curatorial Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {section.bentoCards.map((card, cardIdx) => (
                <div
                  key={cardIdx}
                  className="curatorial-card rounded-2xl p-7 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {card.tag && (
                        <span className="font-mono text-[11px] font-bold text-stone-500 tracking-wider uppercase">
                          {card.tag}
                        </span>
                      )}
                      {card.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-900 text-stone-100">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Plaque Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink mb-3 tracking-tight">
                      {card.title}
                    </h3>

                    {/* Plaque Description */}
                    <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                      {card.description}
                    </p>
                  </div>

                  {/* Plaque Highlight Bottom Footer */}
                  {card.highlight && (
                    <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-stone-800 shrink-0" />
                      <span className="text-xs font-medium text-stone-700">
                        {card.highlight}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* =======================================================================
          SCENE 7: EPILOGUE & CLASS DISCUSSION 【換你答：開放的視界】
          ======================================================================= */}
      <section className="scene-section min-h-screen flex flex-col justify-center items-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
          {/* Epilogue Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-widest uppercase mb-3">
              <span>EXHIBIT CONVERSATION ｜ 換你答</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight mb-3">
              開放的視界：看見話語的力量
            </h2>
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-normal">
              請同學們連結生活、校園或社群經驗，共同探索溝通與結構的可能突破口
            </p>
          </div>

          {/* 3 Discussion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {PRESENTATION_DATA.discussionQuestions.map((q) => (
              <div
                key={q.id}
                className="curatorial-card rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono px-2 py-0.5 rounded text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                      {q.letter}
                    </span>
                    <HelpCircle className="w-4 h-4 text-stone-400" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink mb-3 tracking-tight">
                    {q.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-normal">
                    {q.question}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  <span>歡迎於課堂現場舉手交流</span>
                </div>
              </div>
            ))}
          </div>

          {/* Final Concluding Manifesto Box */}
          <div className="curatorial-panel rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto border border-stone-200 shadow-sm">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-ink mb-3 tracking-tight">
              語言形塑認知，命名賦予權力。
            </h3>
            <p className="font-serif text-stone-600 text-base sm:text-lg mb-8 font-normal">
              理解結構的限制，開啟自由平等的溝通實踐。
            </p>
            <div className="pt-6 border-t border-stone-200/80 text-xs sm:text-sm text-stone-500 flex flex-wrap items-center justify-center gap-3">
              <span>感謝陳竹上教授與全體同學聆聽</span>
              <span>•</span>
              <span className="text-stone-900 font-semibold">高師大《性別與文化》第 3 組 敬上</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

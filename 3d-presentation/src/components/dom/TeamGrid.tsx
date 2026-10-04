import React from 'react';
import { PRESENTATION_DATA, TeamMember } from '../../data/slides';
import { Mic, BookOpen, Search, Compass, Users } from 'lucide-react';

export const TeamGrid: React.FC = () => {
  const getRoleIcon = (member: TeamMember) => {
    if (member.isSpeaker) {
      return <Mic className="w-3.5 h-3.5 text-amber-800" />;
    }
    if (member.role.includes('文獻') || member.role.includes('研討') || member.role.includes('統整')) {
      return <BookOpen className="w-3.5 h-3.5 text-stone-600" />;
    }
    if (member.role.includes('考證') || member.role.includes('研究')) {
      return <Search className="w-3.5 h-3.5 text-stone-600" />;
    }
    if (member.role.includes('視覺') || member.role.includes('架構')) {
      return <Compass className="w-3.5 h-3.5 text-stone-600" />;
    }
    return <Users className="w-3.5 h-3.5 text-stone-600" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Curatorial Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold tracking-widest uppercase mb-3">
          <span>ARCHIVE · 研究團隊名錄 ｜ 10 位解構者</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink mb-3">
          多元視角，解構話語權力
        </h2>
        <p className="text-stone-500 text-sm sm:text-base max-w-2xl mx-auto font-normal">
          結合文本精讀、文化人類學考證、法制沿革與生活觀察的 10 人協同專案
        </p>
      </div>

      {/* 5x2 Curatorial Plaque Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pointer-events-auto">
        {PRESENTATION_DATA.members.map((member) => (
          <div
            key={member.id}
            className={`curatorial-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
              member.isSpeaker
                ? 'bg-amber-50/50 border-amber-200/80 hover:border-amber-400'
                : 'hover:border-stone-400'
            }`}
          >
            {/* Top Row: Index + Role Tag */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-semibold text-stone-400">
                  #{member.id}
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    member.isSpeaker
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-300/60'
                      : 'bg-stone-100 text-stone-600 border border-stone-200/50'
                  }`}
                >
                  {getRoleIcon(member)}
                  <span>{member.role}</span>
                </div>
              </div>

              {/* Name & Speaker Badge */}
              <div className="flex items-baseline gap-2 mb-1.5">
                <h3 className="font-serif text-xl font-bold tracking-tight text-ink">
                  {member.name}
                </h3>
                {member.isSpeaker && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-900 text-stone-100 uppercase tracking-wider">
                    SPEAKER
                  </span>
                )}
              </div>
            </div>

            {/* Member Focus */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {member.focus}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Summary Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-stone-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-700" />
          <span className="font-medium text-stone-800">3 位口頭主講：</span>
          <span>廖峻毅、陳品昊、林展頡</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-stone-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-stone-400" />
          <span className="font-medium text-stone-800">7 位研究統整：</span>
          <span>李昕澤、江沂絃、林季頻、林博閎、林亨澤、郭泓佑、鄭傑尹</span>
        </div>
      </div>
    </div>
  );
};

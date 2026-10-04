---
theme: default
background: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## 話語中的權力與框架：性別視角下的語言、溝通與社會習俗
  高師大通識課程《性別與文化》第 3 組專題報告
drawings:
  persist: false
transition: slide-left
title: 話語中的權力與框架
---

<BgCanvas />

<div class="relative z-10 flex flex-col items-center justify-center h-full pt-12">
  <KineticText tag="h1" class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
    話語中的權力與框架
  </KineticText>

  <h3 class="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 tracking-wide mt-2">
    性別視角下的語言、溝通與社會習俗
  </h3>

  <div class="mt-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
    導讀文本：《臺灣性別100+問》Ch1 ~ Ch3 ｜ 授課教師：陳竹上 教授
  </div>

  <div class="mt-8 flex justify-center gap-3">
    <span class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold tracking-wider shadow-lg shadow-blue-500/25 transition-all">
      第 3 組 專題報告
    </span>
  </div>
</div>

<PacingTimer />

<!--
大家好，我們是第三組。今天我們要透過《臺灣性別100+問》這本書，從日常溝通、網路用語以及習俗體制，一起來探討隱藏在生活語言背後的權力框架。
-->

---
layout: default
---

# 小組成員名單與團隊分工

<div class="text-sm text-gray-500 mb-5">通識教育《性別與文化》課程專案 ｜ 第 3 組</div>

<div class="grid grid-cols-12 gap-5">
  <div class="col-span-5">
    <TiltCard glowColor="rgba(99, 102, 241, 0.2)">
      <div class="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white tracking-wider">簡報製作與研究</span>
            <span class="text-xs text-gray-400">4 位組員</span>
          </div>
          <div class="text-base font-bold text-indigo-950 dark:text-indigo-200 mb-3 tracking-wide">李昕澤 ｜ 江沂紘 ｜ 林展頡 ｜ 林季頻</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 mt-4">
            <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/40">
              <strong class="text-indigo-700 dark:text-indigo-300">📖 核心文獻爬梳：</strong>精讀《臺灣性別100+問》前三章與大法官釋憲文。
            </div>
            <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/40">
              <strong class="text-indigo-700 dark:text-indigo-300">🎨 Slidev 創意技術棧：</strong>導入 GSAP 彈性動效、Three.js 3D 畫布與卡片物理懸停。
            </div>
            <div class="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/40">
              <strong class="text-indigo-700 dark:text-indigo-300">🔍 論述審校與設計：</strong>整合時事案例、提煉講者備忘稿與課堂反思題。
            </div>
          </div>
        </div>
        <div class="text-[11px] text-gray-400 mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/30">
          * 簡報架構統整與幕後技術支援
        </div>
      </div>
    </TiltCard>
  </div>

  <div class="col-span-7">
    <TiltCard glowColor="rgba(59, 130, 246, 0.2)">
      <div class="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white tracking-wider">上台口頭報告</span>
            <span class="text-xs text-gray-400">5 位主講人</span>
          </div>
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200">郭泓佑</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">開場引言 ＆ Ch1 父權體制特徵分析</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200">林博閔</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Ch2 習俗文化象徵暴力 ＆ 憲政突破</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200">廖峻毅</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Ch3 破除溝通迷思 ＆ 雙性化溝通倡導</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200">陳品昊</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Ch3 髒話性別階序 ＆ 網路仇女與寒蟬效應</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/70 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200">林亨澤</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Ch3 命名即權力 ＆ 直男幹話文化剖析</span>
            </div>
          </div>
        </div>
        <div class="text-[11px] text-gray-400 mt-3 pt-2 border-t border-blue-100 dark:border-blue-900/30">
          * 5 位講者依章節脈絡接力深入解析
        </div>
      </div>
    </TiltCard>
  </div>
</div>

<PacingTimer />

<!--
在正式進入章節前，先向老師與同學介紹我們第 3 組的分工。這次簡報製作與架構由李昕澤、江沂紘、林展頡與林季頻共同完成；上台報告則由泓佑、博閔、峻毅、品昊與亨澤 5 位同學依序帶大家探討文本核心。
-->

---
layout: default
---

# 簡報架構與導讀大綱

<div class="text-sm text-gray-500 mb-6">從巨觀結構、文化儀式到微觀語言互動的完整思維路徑</div>

<div class="grid grid-cols-5 gap-3 mt-4">
  <TiltCard glowColor="rgba(59, 130, 246, 0.2)">
    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 border-t-4 border-blue-500 text-left h-full">
      <div class="text-xs font-bold text-blue-500 mb-1">PART 1</div>
      <div class="font-bold text-sm mb-2 text-slate-800 dark:text-slate-100">結構的重力</div>
      <p class="text-xs text-gray-500">Allan Johnson 父權四大特徵與「阻力最小之路」</p>
      <div class="mt-4 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">主講：郭泓佑</div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(245, 158, 11, 0.2)">
    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 border-t-4 border-amber-500 text-left h-full">
      <div class="text-xs font-bold text-amber-500 mb-1">PART 2</div>
      <div class="font-bold text-sm mb-2 text-slate-800 dark:text-slate-100">習俗與制度</div>
      <p class="text-xs text-gray-500">婚俗象徵暴力、從母姓困境與違憲平權突破</p>
      <div class="mt-4 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">主講：林博閔</div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(20, 184, 166, 0.2)">
    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 border-t-4 border-teal-500 text-left h-full">
      <div class="text-xs font-bold text-teal-500 mb-1">PART 3</div>
      <div class="font-bold text-sm mb-2 text-slate-800 dark:text-slate-100">溝通的迷思</div>
      <p class="text-xs text-gray-500">打破火星金星決定論，Julia Wood 雙性化溝通</p>
      <div class="mt-4 text-[11px] text-teal-600 dark:text-teal-400 font-semibold">主講：廖峻毅</div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(239, 68, 68, 0.2)">
    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 border-t-4 border-red-500 text-left h-full">
      <div class="text-xs font-bold text-red-500 mb-1">PART 4</div>
      <div class="font-bold text-sm mb-2 text-slate-800 dark:text-slate-100">髒話與網路</div>
      <p class="text-xs text-gray-500">生殖器官污名化、財產觀與數位空間寒蟬效應</p>
      <div class="mt-4 text-[11px] text-red-600 dark:text-red-400 font-semibold">主講：陳品昊</div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(168, 85, 247, 0.2)">
    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 border-t-4 border-purple-500 text-left h-full">
      <div class="text-xs font-bold text-purple-500 mb-1">PART 5</div>
      <div class="font-bold text-sm mb-2 text-slate-800 dark:text-slate-100">命名與直男</div>
      <p class="text-xs text-gray-500">吃豆腐到性騷擾正名、直男任務導向與幹話防禦</p>
      <div class="mt-4 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">主講：林亨澤</div>
    </div>
  </TiltCard>
</div>

<PacingTimer />

<!--
這是我們今天的報告大綱。我們將由巨觀的父權體制結構，談到文化婚俗，接著深入日常語言、髒話現象，最後剖析名詞命名權力與直男同儕互動，循序漸進解構生活中的性別框架。
-->

---
layout: two-cols
---

# 【前情回顧】父權體制與結構重力

<div class="text-xs mb-3 flex items-center gap-2">
  <SpeakerTag name="郭泓佑" color="blue" />
  <span class="text-gray-400 text-xs">文本依據：Allan Johnson《性別打結》</span>
</div>

::left::
<div class="pr-4">
  <h3 class="text-base font-semibold text-blue-600 dark:text-blue-400 mb-2">Ch1 父權體制四大核心特徵</h3>
  <div class="space-y-2 text-sm">
    <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
      <strong class="text-blue-600 dark:text-blue-400">1. 男性支配 (Male Dominated)：</strong><br/>
      <span class="text-xs text-gray-600 dark:text-gray-300">政治、經濟等權力核心位置高度男性化。</span>
    </div>
    <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
      <strong class="text-blue-600 dark:text-blue-400">2. 認同男性 (Male Identified)：</strong><br/>
      <span class="text-xs text-gray-600 dark:text-gray-300">文化將理想品質（理性、勇敢）等同於男性氣質。</span>
    </div>
    <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
      <strong class="text-blue-600 dark:text-blue-400">3. 以男性為中心 (Male Centered)：</strong><br/>
      <span class="text-xs text-gray-600 dark:text-gray-300">歷史敘事與焦點多以男性生命經驗為標準。</span>
    </div>
    <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
      <strong class="text-blue-600 dark:text-blue-400">4. 由男性控制 (Male Controlled)：</strong><br/>
      <span class="text-xs text-gray-600 dark:text-gray-300">掌握各領域規範與資源分配權力。</span>
    </div>
  </div>
</div>

::right::
<div class="pl-4 border-l border-gray-200 dark:border-gray-700 flex flex-col justify-between">
  <div>
    <h3 class="text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">關鍵洞察：我們如何身處其中？</h3>
    <TiltCard glowColor="rgba(59, 130, 246, 0.25)">
      <div class="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        <strong class="text-blue-600 dark:text-blue-400 text-sm block mb-1">「阻力最小的路 (Path of Least Resistance)」</strong>
        父權體制不是某個人的個別惡意，而是一套現成的「社會遊戲規則」。我們日常不加思索地順應既有規範，只是因為那是一條最輕鬆、最少社會壓力的路徑。
      </div>
    </TiltCard>
    <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-gray-600 dark:text-gray-400 mt-2">
      💡 <strong>報告意識：</strong> 唯有看清「重力」的存在，我們才能有意識地選擇反思與抵抗。
    </div>
  </div>
</div>

<PacingTimer />

<!--
（郭泓佑）大家好，第一部分由我來為大家回顧 Ch1。Allan Johnson 指出，父權不等於個別男性的壓迫，而是一個巨大的結構體系。我們每個人日常在做的，往往只是順著「阻力最小的路」走。接下來請博閔帶我們看習俗中的具體體現。
-->

---
layout: two-cols
---

# 【習俗制度】文化儀式中的象徵排擠與法制

<div class="text-xs mb-3 flex items-center gap-2">
  <SpeakerTag name="林博閔" color="amber" />
  <span class="text-gray-400 text-xs">文本依據：《臺灣性別100+問》Ch2 習俗文化</span>
</div>

::left::
<div class="pr-4">
  <h3 class="text-base font-semibold text-amber-600 dark:text-amber-400 mb-2">日常婚俗中的象徵暴力</h3>
  <div class="space-y-3 text-sm">
    <div class="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg">
      <strong class="text-amber-800 dark:text-amber-200">儀式中的排除隱喻：</strong>
      <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
        <strong>丟扇子、踩瓦片、跨火爐</strong>：象徵將新娘視為「帶來壞脾氣的外人」與「潑出去的水」，儀式不斷強化「出嫁即斷絕本家」的父系邏輯。
      </p>
    </div>
    <div class="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg">
      <strong class="text-amber-800 dark:text-amber-200">從姓制度的父系焦慮：</strong>
      <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
        民法雖已修改為子女姓氏可由雙方協商，但在現實社會壓力下，台灣「從母姓」比例仍<strong>低於 5%</strong>，「傳香火」仍牢固附著於父姓。
      </p>
    </div>
  </div>
</div>

::right::
<div class="pl-4 border-l border-gray-200 dark:border-gray-700">
  <h3 class="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-2">憲政平權的重大突破</h3>
  <TiltCard glowColor="rgba(16, 185, 129, 0.2)">
    <div class="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-3">
      <div class="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-1">
        🏛️ 111 年憲判字第 4 號判決（2022）
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        原住民身分法曾規定「非原住民父親與原住民母親所生子女，必須從母姓才能取得原民身分」。
      </p>
      <div class="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
        ➔ 憲法法庭宣告違憲：認同權不應受到父系漢姓綁架！
      </div>
    </div>
  </TiltCard>
  <p class="text-xs text-gray-400">
    從習俗到法制，我們能看到傳統透過文化符號進行排擠，但現代法治正逐步鬆動這些歷史枷鎖。
  </p>
</div>

<PacingTimer />

<!--
（林博閔）大家好，我是博閔。延續前面提到的父權體制，婚俗就是最直接的「儀式象徵暴力」。踩瓦片、丟扇子表面上是祝福，本質卻是把女性客體化為外人。雖然法律逐步推動從母姓與違憲平權判決，文化慣性依然強大。接下來交給峻毅探討語言溝通。
-->

---
layout: two-cols
---

# Q1：男女溝通真的來自不同星球嗎？

<div class="text-xs mb-3 flex items-center gap-2">
  <SpeakerTag name="廖峻毅" color="teal" />
  <span class="text-gray-400 text-xs">文本依據：《臺灣性別100+問》Ch3 語言溝通</span>
</div>

::left::
<div class="pr-4">
  <div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900 mb-3">
    <h3 class="text-red-600 dark:text-red-400 font-bold text-sm mb-1">通俗迷思：生理本質決定論</h3>
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
      《男人來自火星，女人來自金星》將男女溝通差異絕對化，主張「男性大腦天生理性、女性大腦天生情緒化」。
    </p>
  </div>
  <div class="text-sm space-y-2">
    <p class="font-semibold text-gray-700 dark:text-gray-200 text-xs">現代神經科學反思：</p>
    <ul class="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 space-y-1">
      <li>大腦具備終身神經可塑性（Plasticity）。</li>
      <li>「同性別個體間的差異」遠大於「兩性平均差異」。</li>
      <li>不能將複雜的社會溝通簡化為染色體決定。</li>
    </ul>
  </div>
</div>

::right::
<div class="pl-4 border-l border-gray-200 dark:border-gray-700">
  <div class="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-900 mb-3">
    <h3 class="text-teal-600 dark:text-teal-400 font-bold text-sm mb-1">學術實證：後天性別社會化建構</h3>
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
      學者 Julia Wood 指出，溝通風格來自童年遊戲與同儕文化的社會期待。
    </p>
  </div>
  <div class="grid grid-cols-2 gap-2 text-xs">
    <div class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
      <strong class="text-teal-600 dark:text-teal-400">女性：關係型 (Rapport)</strong><br/>
      <span class="text-gray-500 dark:text-gray-400">扮家家酒、重視維持群體關係與同理支持。</span>
    </div>
    <div class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
      <strong class="text-blue-600 dark:text-blue-400">男性：報告型 (Report)</strong><br/>
      <span class="text-gray-500 dark:text-gray-400">競技運動、目標導向、確立位階與掌控力。</span>
    </div>
  </div>
  <div class="mt-3 p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-center shadow-sm">
    💡 倡導「雙性化（Androgynous）溝通」：兼具直率果斷與同理傾聽！
  </div>
</div>

<PacingTimer />

<!--
（廖峻毅）我是峻毅。很多人以為男女講話合不來是天生的「火星金星」，但 Julia Wood 告訴我們，這完全是從小被玩遊戲的模式社會化出來的。解方不是去扮演刻板性別角色，而是發展雙性化溝通，學會兼具果斷與同理。下一頁由品昊解析語言暴力。
-->

---
layout: two-cols
---

# Q2：髒話問候與網路流行語的性別階序

<div class="text-xs mb-3 flex items-center gap-2">
  <SpeakerTag name="陳品昊" color="red" />
  <span class="text-gray-400 text-xs">文本依據：《臺灣性別100+問》Ch3 語言暴力</span>
</div>

::left::
<div class="pr-4">
  <h3 class="text-base font-bold text-red-500 mb-2">為什麼髒話總是在「問候女性」？</h3>
  <div class="space-y-3 text-sm">
    <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <strong class="text-slate-800 dark:text-slate-200">1. 女性身體器官的污名化：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed block mt-1">
        辱罵核心多針對女性生殖器與性羞辱，將女性生理結構客體化為卑劣、可供凌辱的代名詞。
      </span>
    </div>
    <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <strong class="text-slate-800 dark:text-slate-200">2. 父權交換社會下的財產觀：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed block mt-1">
        辱罵對方的女性親屬（母、姊、妹），實質是「透過玷污對方的女性附屬品，來擊潰該男性的家庭尊嚴」。
      </span>
    </div>
  </div>
</div>

::right::
<div class="pl-4 border-l border-gray-200 dark:border-gray-700">
  <h3 class="text-base font-bold text-amber-500 mb-2">網路流行語「只是打嘴砲開玩笑」？</h3>
  <div class="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs mb-3">
    <span class="font-bold text-amber-700 dark:text-amber-400">PTT / Dcard 常見標籤：</span>
    <span class="text-gray-600 dark:text-gray-300">台女、母豬、女拳、三寶、綠茶婊</span>
  </div>
  <ul class="text-sm space-y-2.5 list-disc list-inside text-gray-700 dark:text-gray-300">
    <li>
      <strong>以偏概全的集體貶抑：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 pl-4 block">
        將少數個案的負面行為擴大為對整體女性群體的羞辱標籤。
      </span>
    </li>
    <li>
      <strong>實質的寒蟬效應 (Chilling Effect)：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 pl-4 block">
        長期的數位性別敵意環境，迫使女性提高防衛、自我審查發言，甚至全面退出網路公共討論。
      </span>
    </li>
  </ul>
</div>

<PacingTimer />

<!--
（陳品昊）我是品昊。當我們罵三字經，或在網路上嘲諷「台女、母豬」時，很多人以為這只是無傷大雅的玩笑。但社會學告訴我們，這是在利用女性身體作為財產來互相羞辱，並在網路上形成強大的寒蟬效應。接下來交給亨澤剖析「命名」與直男文化。
-->

---
layout: default
---

# Q3：命名即權力——從「吃豆腐」到「性騷擾」

<div class="text-xs mb-4 flex items-center gap-2">
  <SpeakerTag name="林亨澤" color="purple" />
  <span class="text-gray-400 text-xs">文本依據：《臺灣性別100+問》Ch3 概念正名工程</span>
</div>

<div class="grid grid-cols-2 gap-6">
  <TiltCard glowColor="rgba(239, 68, 68, 0.2)">
    <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm h-full">
      <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">歷史脈絡：模糊責任的修辭</div>
      <div class="text-xl font-bold text-red-500 mb-3">「吃豆腐、鹹豬手、毛手毛腳」</div>
      <ul class="text-sm space-y-2.5 text-gray-600 dark:text-gray-300">
        <li><strong>語意淡化：</strong> 隱含「風流、幽默、無傷大雅」的情境修辭。</li>
        <li><strong>責任錯置：</strong> 將侵犯身體界線的行為輕描淡寫為私人社交摩擦。</li>
        <li><strong>缺乏法源：</strong> 受害者難以具體指證，無法在體制內主張權利救濟。</li>
      </ul>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(59, 130, 246, 0.2)">
    <div class="p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-slate-900 shadow-sm h-full">
      <div class="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">現代法制：確立權力本質</div>
      <div class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">「性騷擾 (Sexual Harassment)」</div>
      <ul class="text-sm space-y-2.5 text-gray-600 dark:text-gray-300">
        <li><strong>權力本質化：</strong> 1970 年代確立名詞，指出這是「不對等權力關係下的壓迫」。</li>
        <li>
          <strong>進一步的正名工程：</strong>
          <ul class="list-disc list-inside ml-2 text-xs mt-1.5 space-y-1 text-gray-500 dark:text-gray-400">
            <li>「復仇式色情」 ➔ <strong class="text-emerald-600 dark:text-emerald-400">未經同意散布私密影像</strong>（移除檢討被害人語意）</li>
            <li>「兩性平等」 ➔ <strong class="text-emerald-600 dark:text-emerald-400">性別平等</strong>（擴充至性傾向與性別認同多元光譜）</li>
          </ul>
        </li>
      </ul>
    </div>
  </TiltCard>
</div>

<PacingTimer />

<!--
（林亨澤）我是亨澤。語言最強大的地方在於「命名」。在「性騷擾」這個法律名詞出現前，所有侵害都被淡化成「吃豆腐」的玩笑。近年將「復仇式色情」正名為「未經同意散布私密影像」，也是為了把責任歸還給加害者。
-->

---
layout: two-cols
---

# Q4：直男為什麼不聊心事？反而常互虧、講幹話？

<div class="text-xs mb-3 flex items-center gap-2">
  <SpeakerTag name="林亨澤" color="purple" />
  <span class="text-gray-400 text-xs">文本依據：《臺灣性別100+問》Ch3 男性同儕互動</span>
</div>

::left::
<div class="pr-4">
  <div class="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-900 mb-4">
    <h3 class="text-indigo-600 dark:text-indigo-400 font-bold mb-1 text-sm">男性同儕的「任務導向 (Task-oriented)」</h3>
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
      相約打球、打電動、喝酒；社交聚焦於「一起完成某個外部活動」，而非深入向內探索情感。
    </p>
  </div>
  <div class="text-sm space-y-2">
    <div class="border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-r">
      <strong class="text-indigo-700 dark:text-indigo-300">脆弱是男子氣概的禁忌：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
        傳統陽剛規範要求「堅毅、忍耐、解決問題」，示弱常被視為無能與失去男子氣概。
      </span>
    </div>
  </div>
</div>

::right::
<div class="pl-4 border-l border-gray-200 dark:border-gray-700">
  <div class="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900 mb-4">
    <h3 class="text-purple-600 dark:text-purple-400 font-bold mb-1 text-sm">恐同焦慮與「幹話互虧 (Bullshitting)」</h3>
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
      為了防禦被同儕貼上非典型男性或同性戀標籤，發展出獨特的邊界防護機制。
    </p>
  </div>
  <div class="text-sm space-y-2">
    <div class="border-l-4 border-purple-500 pl-3 py-1 bg-purple-50/30 dark:bg-purple-950/20 rounded-r">
      <strong class="text-purple-700 dark:text-purple-300">替代性的情感連結：</strong><br/>
      <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
        藉由互相調侃、講幹話與看似粗魯的打鬧，在「不越過親密界線」的安全距離下確認兄弟間的信任。
      </span>
    </div>
  </div>
</div>

<PacingTimer />

<!--
（林亨澤）最後看直男相處文化。男生聚在一起只講幹話，不是缺乏情緒，而是父權社會對陽剛特質的規訓讓人不敢暴露脆弱，加上「恐同焦慮」，導致男生必須透過幹話和互虧這種看似粗魯的形式，來安全地維持親密友情。
-->

---
layout: default
---

# 課堂反思與討論：「換你答」

<div class="text-xs mb-4 flex items-center gap-2">
  <span class="px-2.5 py-1 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
    主持導引：第 3 組全體
  </span>
  <span class="text-gray-400 text-xs">請同學們連結生活體驗進行小組交流</span>
</div>

<div class="grid grid-cols-3 gap-5 mt-2">
  <TiltCard glowColor="rgba(245, 158, 11, 0.2)">
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left flex flex-col justify-between h-full">
      <div>
        <div class="text-amber-600 dark:text-amber-400 font-bold mb-2 text-sm flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          問題 A：發言權力與期待
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          在大學課堂或公開會議中，踴躍舉手發言的往往是男性還是女性？背後可能有哪些從小被鼓勵或壓抑的社會化機制？
        </p>
      </div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(59, 130, 246, 0.2)">
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left flex flex-col justify-between h-full">
      <div>
        <div class="text-blue-600 dark:text-blue-400 font-bold mb-2 text-sm flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          問題 B：婚俗與姓氏自主
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          如果未來你有下一代，你會傾向堅持傳統父系姓氏與婚俗規矩，還是支持抽籤、從母姓或自創新平權儀式？考量點是什麼？
        </p>
      </div>
    </div>
  </TiltCard>

  <TiltCard glowColor="rgba(16, 185, 129, 0.2)">
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left flex flex-col justify-between h-full">
      <div>
        <div class="text-emerald-600 dark:text-emerald-400 font-bold mb-2 text-sm flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          問題 C：解構有毒男子氣概
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          我們該如何創造一個允許男性坦然展示脆弱、允許女性果斷展現領導力的友善校園溝通環境？
        </p>
      </div>
    </div>
  </TiltCard>
</div>

<PacingTimer />

<!--
（林亨澤）這三題是我們小組準備給全班討論的「換你答」題目，大家可以從自身在校園、家庭或網路上的生活經驗來切入思考，歡迎大家發表看法！
-->

---
layout: statement
---

<BgCanvas />

<div class="relative z-10 flex flex-col items-center justify-center h-full">
  <KineticText tag="h1" class="text-3xl md:text-5xl font-black mb-4 tracking-tight">
    語言形塑認知，命名賦予權力。
  </KineticText>

  <h3 class="text-lg md:text-xl text-slate-300 font-medium tracking-wide">
    理解結構的限制，開啟自由平等的溝通實踐。
  </h3>

  <div class="mt-8 text-sm text-gray-400 font-normal">
    感謝陳竹上教授與全班同學的聆聽 ｜ 第 3 組 敬上
  </div>
</div>

<PacingTimer />

<!--
總結來說，語言不只是溝通工具，更承載著文化與權力。唯有看見背後的結構，我們才能真正走出二元框架，實踐平等的雙性化溝通。謝謝大家！
-->

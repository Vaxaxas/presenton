const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Prepare Presentation Custom Styles: Editorial Minimalist Architecture
const presentationStyles = `
<style id="presentation-editorial-styles">
  :root {
    --color-paper: #FBF8F6;
    --color-ink: #1C1917;
    --color-ink-muted: rgba(28, 25, 23, 0.68);
    --color-ink-light: rgba(28, 25, 23, 0.42);
    --color-ink-faint: rgba(28, 25, 23, 0.08);
    --color-hairline: rgba(28, 25, 23, 0.12);
    --color-hairline-strong: rgba(28, 25, 23, 0.28);
    --color-surface-faint: rgba(28, 25, 23, 0.025);
    --color-accent-terracotta: #9A3412;
    --color-accent-forest: #2A5F45;
    --color-accent-slate: #1E3A8A;
    --font-heading: "Songti TC", "Noto Serif TC", "Source Han Serif TC", "STSong", serif, system-ui;
    --font-ui: "General Sans", -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", sans-serif;
    --font-mono: "Space Mono", "Montiac Mono", monospace;
  }

  html, body {
    background-color: var(--color-paper) !important;
    color: var(--color-ink) !important;
    font-family: var(--font-ui) !important;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    scroll-snap-type: y mandatory !important;
    scroll-behavior: smooth !important;
    overflow-y: auto !important;
  }

  /* 3D WebGL Canvas Fixed Background */
  .webgl-scene, canvas {
    position: fixed !important;
    inset: 0 !important;
    z-index: 0 !important;
    pointer-events: auto !important;
  }

  body.is-preloading :is(.header, main, .footer, .bottom-bar),
  body :is(.header, main, .footer, .bottom-bar),
  main#main,
  #main {
    opacity: 1 !important;
    visibility: visible !important;
    transition: none !important;
    position: relative !important;
    z-index: 5 !important;
  }

  .presentation-slide[data-chapter] {
    min-height: 100vh !important;
    height: 100vh !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    scroll-snap-align: start !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .presentation-slide > .container,
  [data-chapter]:not([data-flow]) > .container,
  [data-chapter]:not([data-flow]):not([data-active]) > .container,
  [data-chapter] > .container {
    position: relative !important;
    inset: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    content-visibility: visible !important;
    pointer-events: auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100vw !important;
    height: 100% !important;
    max-width: 100vw !important;
    padding: clamp(60px, 8vh, 100px) clamp(28px, 5vw, 80px) clamp(50px, 7vh, 80px) !important;
    box-sizing: border-box !important;
    z-index: 10 !important;
  }

  .slide-stage-wrapper {
    max-width: 1420px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .slide-eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
  }

  .badge-index {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 3px 10px;
    border-radius: 4px;
    background: var(--color-ink-faint);
    color: var(--color-ink);
    border: 1px solid var(--color-hairline);
  }

  .badge-topic {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-accent-terracotta);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .slide-title {
    font-size: clamp(2rem, 3.4vw, 3.1rem);
    font-weight: 800;
    line-height: 1.22;
    color: var(--color-ink);
    letter-spacing: -0.015em;
    margin: 0 0 10px 0;
    text-wrap: balance;
  }

  .slide-subtitle {
    font-size: clamp(0.98rem, 1.28vw, 1.18rem);
    color: var(--color-ink-muted);
    line-height: 1.62;
    margin: 0 0 24px 0;
    max-width: 960px;
  }

  /* Horizontal Stepper Row */
  .editorial-stepper-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(24px, 3.5vw, 48px);
    width: 100%;
    position: relative;
    margin-top: 8px;
  }

  .editorial-step-col {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 18px;
    border-top: 1.5px solid var(--color-hairline);
    transition: border-color 0.25s ease;
  }

  .editorial-step-col:hover {
    border-top-color: var(--color-ink);
  }

  .step-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .step-num {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--color-accent-terracotta);
    letter-spacing: 0.08em;
  }

  .step-tag {
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--color-ink-light);
    letter-spacing: 0.04em;
  }

  .step-title {
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-ink);
    margin: 0 0 14px 0;
  }

  /* Editorial Pure List */
  .editorial-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .editorial-list li {
    font-size: 0.94rem;
    line-height: 1.6;
    color: var(--color-ink-muted);
    position: relative;
    padding-left: 18px;
  }

  .editorial-list li::before {
    content: "—";
    position: absolute;
    left: 0;
    top: 0;
    color: var(--color-hairline-strong);
    font-family: var(--font-mono);
  }

  .editorial-list strong {
    color: var(--color-ink);
    font-weight: 700;
  }

  /* Tension Split Row */
  .tension-split-row {
    display: grid;
    grid-template-columns: 1.05fr 1.35fr;
    gap: clamp(32px, 5vw, 64px);
    width: 100%;
    align-items: start;
    margin-top: 10px;
  }

  .tension-split-equal {
    grid-template-columns: 1fr 1fr;
  }

  .tension-column {
    display: flex;
    flex-direction: column;
  }

  .tension-column-bordered {
    padding-left: clamp(24px, 4vw, 48px);
    border-left: 1px solid var(--color-hairline);
  }

  /* Monument Statement */
  .monument-statement {
    padding: 20px 0;
    border-top: 2px solid var(--color-ink);
    border-bottom: 1px solid var(--color-hairline);
    margin: 18px 0 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .monument-quote {
    font-family: var(--font-ui);
    font-size: clamp(1.15rem, 1.8vw, 1.55rem);
    font-weight: 600;
    line-height: 1.5;
    color: var(--color-ink);
    letter-spacing: -0.01em;
  }

  .monument-author {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-accent-terracotta);
    letter-spacing: 0.06em;
  }

  /* Contrast Parallel */
  .contrast-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    width: 100%;
    border-top: 1.5px solid var(--color-ink);
    border-bottom: 1px solid var(--color-hairline);
    margin-top: 14px;
  }

  .contrast-side {
    padding: 24px clamp(20px, 3vw, 40px);
    display: flex;
    flex-direction: column;
  }

  .contrast-side:first-child {
    border-right: 1px solid var(--color-hairline);
    background: rgba(28, 25, 23, 0.018);
  }

  .contrast-side:last-child {
    background: rgba(42, 95, 69, 0.035);
  }

  .contrast-badge {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .contrast-term {
    font-size: clamp(1.6rem, 2.4vw, 2.2rem);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 16px 0;
  }

  /* Team Cards Grid (10 人雙排網格排版：2 排 × 5 欄) */
  .team-cards-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
    margin-top: 8px;
  }

  .team-card {
    padding: 13px 14px;
    border: 1px solid var(--color-hairline);
    border-radius: 6px;
    background: rgba(28, 25, 23, 0.015);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all 0.2s ease;
  }

  .team-card:hover {
    border-color: var(--color-ink);
    background: rgba(28, 25, 23, 0.035);
  }

  .team-card.speaker-card {
    border: 1.5px solid var(--color-accent-terracotta);
    background: rgba(154, 52, 18, 0.03);
  }

  .team-card.speaker-card-forest {
    border: 1.5px solid var(--color-accent-forest);
    background: rgba(42, 95, 69, 0.03);
  }

  .team-card.speaker-card-slate {
    border: 1.5px solid var(--color-accent-slate);
    background: rgba(30, 58, 138, 0.03);
  }

  .team-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-bottom: 5px;
    color: var(--color-ink-light);
  }

  .team-name {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--color-ink);
    margin: 0 0 5px 0;
  }

  .team-role {
    font-size: 0.78rem;
    line-height: 1.46;
    color: var(--color-ink-muted);
  }

  .team-summary-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--color-hairline);
    font-size: 0.82rem;
  }

  /* Speaker Notes Drawer */
  .speaker-notes-drawer {
    margin-top: 20px;
    width: 100%;
  }

  .notes-summary {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--color-ink-muted);
    padding: 5px 14px;
    background: var(--color-ink-faint);
    border: 1px solid var(--color-hairline);
    border-radius: 99px;
    transition: all 0.2s;
    user-select: none;
    letter-spacing: 0.04em;
  }

  .notes-summary:hover {
    color: var(--color-ink);
    background: rgba(28, 25, 23, 0.09);
    border-color: var(--color-ink);
  }

  .notes-body {
    margin-top: 10px;
    padding: 16px 22px;
    background: rgba(251, 248, 246, 0.95);
    border-left: 2.5px solid var(--color-accent-forest);
    border-radius: 4px;
    font-size: 0.88rem;
    line-height: 1.72;
    color: var(--color-ink);
    backdrop-filter: blur(14px);
    border-top: 1px solid var(--color-hairline);
    border-right: 1px solid var(--color-hairline);
    border-bottom: 1px solid var(--color-hairline);
  }

  .notes-body strong {
    color: var(--color-accent-forest);
    font-weight: 700;
  }

  /* Floating Prompter Window */
  .prompter-modal {
    position: fixed;
    bottom: 80px;
    left: 24px;
    width: min(560px, calc(100vw - 48px));
    max-height: 400px;
    overflow-y: auto;
    background: rgba(251, 248, 246, 0.98);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid var(--color-hairline-strong);
    border-radius: 12px;
    padding: 22px 26px;
    box-shadow: 0 20px 50px rgba(28, 25, 23, 0.16);
    z-index: 2000;
    display: none;
  }

  .prompter-modal.is-open {
    display: block;
    animation: prompterFade 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes prompterFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .prompter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-hairline);
  }

  .prompter-title {
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--color-accent-forest);
    letter-spacing: 0.04em;
  }

  .prompter-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--color-ink-muted);
    line-height: 1;
    padding: 4px;
  }

  .prompter-close:hover {
    color: var(--color-ink);
  }

  .prompter-text {
    font-size: 0.94rem;
    line-height: 1.72;
    color: var(--color-ink);
  }

  /* Presenter Dock */
  .slide-dock {
    position: fixed;
    bottom: 22px;
    left: 24px;
    z-index: 120;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(251, 248, 246, 0.94);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--color-hairline);
    border-radius: 99px;
    padding: 6px 14px;
    box-shadow: 0 6px 24px rgba(28, 25, 23, 0.06);
  }

  .dock-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--color-ink);
    border-radius: 99px;
    transition: background 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .dock-btn:hover {
    background: rgba(28, 25, 23, 0.08);
  }

  .dock-counter {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--color-ink);
    padding: 0 4px;
  }

  .presentation-footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 80;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 28px;
    font-size: 0.76rem;
    font-family: var(--font-mono);
    color: var(--color-ink-light);
    pointer-events: none;
    letter-spacing: 0.04em;
  }

  /* Responsive Rules */
  @media (max-width: 1100px) {
    .team-cards-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 960px) {
    .editorial-stepper-row,
    .tension-split-row,
    .tension-split-equal,
    .contrast-grid {
      grid-template-columns: 1fr !important;
      gap: 24px;
    }
    .tension-column-bordered {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid var(--color-hairline);
      padding-top: 20px;
    }
    .contrast-side:first-child {
      border-right: none;
      border-bottom: 1px solid var(--color-hairline);
    }
    .presentation-slide > .container {
      justify-content: flex-start !important;
      padding-top: 85px !important;
    }
  }

  @media (max-width: 720px) {
    .team-cards-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  .header .chapters ol {
    gap: 2px !important;
  }
  .header .chapters li a {
    font-size: 0.72rem !important;
    width: 26px !important;
    height: 26px !important;
    font-weight: 700 !important;
  }
</style>
`;

// Inject custom styles into <head>
if (html.includes('id="presentation-editorial-styles"')) {
  html = html.replace(/<style id="presentation-editorial-styles">[\s\S]*?<\/style>/, presentationStyles.trim());
} else {
  html = html.replace('</head>', `${presentationStyles}\n</head>`);
}

// 2. Prepare 12 Slides HTML: Faithful, De-AI-ified, Humanized
const slidesHtml = `
<!-- ==================== SLIDE 1: 封面頁 ==================== -->
<section class="presentation-slide hero" id="slide-1" data-chapter="pin" data-shape="orb" data-astro-cid-pp7d62ca>
  <div class="container" data-astro-cid-pp7d62ca>
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 01 / 12</span>
        <span class="badge-topic">國立高雄師範大學 通識教育課程｜性別與文化導讀報告</span>
      </div>

      <div class="tension-split-row" style="margin-top: 6px;">
        <div class="tension-column">
          <h1 class="slide-title" style="font-family: var(--font-heading); font-size: clamp(2.3rem, 4.2vw, 3.6rem); line-height: 1.18; margin-bottom: 16px;">
            話語即權力：<br>日常語言與網路文化中的性別密碼
          </h1>
          <p class="slide-subtitle" style="font-size: clamp(1.02rem, 1.3vw, 1.2rem); line-height: 1.68;">
            為什麼我們習慣這樣說話？從日常幹話、網路流行語到體制常規的性別觀察<br>
            <span style="color: var(--color-accent-terracotta); font-weight: 600;">經典導讀文本：《臺灣性別100+問》（專題研讀：第一章至第三章）</span>
          </p>
        </div>

        <div class="tension-column tension-column-bordered" style="justify-content: center;">
          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 12px;">
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-ink-light); letter-spacing: 0.08em; margin-bottom: 4px;">INSTRUCTOR 指導教授</div>
              <div style="font-size: 1.22rem; font-weight: 800; color: var(--color-ink);">陳竹上 教授</div>
              <div style="font-size: 0.84rem; color: var(--color-ink-muted); margin-top: 2px;">國立高雄師範大學 通識教育中心</div>
            </div>

            <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 12px;">
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 4px;">PRESENTATION TEAM 報告團隊</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--color-ink); line-height: 1.45;">
                口頭主講代表：廖峻毅、陳品昊、林展頡<br>
                <span style="font-size: 0.86rem; font-weight: 600; color: var(--color-ink-muted);">專案研究統整：李昕澤、江沂絃、林季頻、林博閎、林亨澤、郭泓佑、鄭傑尹</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--color-ink-light); margin-top: 4px;">全組 10 位組員分工研討製作</div>
            </div>

            <div>
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 4px;">CORE PERSPECTIVE 核心提問</div>
              <div style="font-size: 0.92rem; line-height: 1.6; color: var(--color-ink); font-weight: 500;">
                脫口而出的口頭禪和網路迷因，是在開玩笑，還是默默替誰決定了高低順序？
              </div>
            </div>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【廖峻毅提示】</strong>「老師、各位同學好，我們是第 3 組。這次報告由全組 10 位同學一起分工完成，從文獻、網路案例到法條都有深入整理，今天由我和品昊、展頡代表上台。我們讀《臺灣性別100+問》時很有共鳴：大家平常互嗆、在論壇推文，第一反應都是『笑笑就好、幹嘛那麼認真』。但很多我們講得極順口的習慣，背後其實都在替某種權力秩序護航。今天我們就從大家每天最常脫口而出的話開始聊。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 2: 團隊陣容與專案分工 ==================== -->
<section class="presentation-slide concept" id="slide-2" data-chapter="pin" data-shape="clarity">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 02 / 12</span>
        <span class="badge-topic">團隊陣容與專案分工 ｜ 全組 10 人精準配置</span>
      </div>
      <h2 class="slide-title">團隊分工與報告藍圖</h2>
      <p class="slide-subtitle">文獻、習俗、網路田野到法律條文，全體 10 位組員共同協作完成</p>

      <!-- 2 排 × 5 欄卡片式網格 -->
      <div class="team-cards-grid">
        <!-- 上排：專案研究統整組 (5 人) -->
        <div class="team-card">
          <div class="team-badge">#01 專案研討</div>
          <div class="team-name">李昕澤</div>
          <div class="team-role">文獻研讀與論述協調，梳理《臺灣性別100+問》核心章節學術脈絡。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#02 文化考證</div>
          <div class="team-name">江沂絃</div>
          <div class="team-role">習俗儀式象徵分析，考證婚俗丟扇、踩瓦與潑水出嫁之性別寓意。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#03 案例研究</div>
          <div class="team-name">林季頻</div>
          <div class="team-role">語言客體化現象蒐集，整理論壇厭女標籤與日常性別粗口案例。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#04 資料統整</div>
          <div class="team-name">林博閎</div>
          <div class="team-role">性平法制演進爬梳，對照民法從母姓現況、憲判字第 4 號與刑法 319-3 條。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#05 問卷反思</div>
          <div class="team-name">林亨澤</div>
          <div class="team-role">課堂討論題目設計，聚焦同儕互動經驗與現場換你答思辨題型。</div>
        </div>

        <!-- 下排：口頭主講與架構綜理組 (5 人) -->
        <div class="team-card speaker-card">
          <div class="team-badge" style="color: var(--color-accent-terracotta);">#06 🎙️ SPEAKER 1</div>
          <div class="team-name">廖峻毅</div>
          <div class="team-role">導讀、生理迷思與雙性化溝通；串聯體制結構至 Julia Wood 社會化理論。</div>
        </div>
        <div class="team-card speaker-card speaker-card-forest">
          <div class="team-badge" style="color: var(--color-accent-forest);">#07 🎙️ SPEAKER 2</div>
          <div class="team-name">陳品昊</div>
          <div class="team-role">性別辱罵、網路流行語與寒蟬效應；剖析器官污名與數位論壇雙標。</div>
        </div>
        <div class="team-card speaker-card speaker-card-slate">
          <div class="team-badge" style="color: var(--color-accent-slate);">#08 🎙️ SPEAKER 3</div>
          <div class="team-name">林展頡</div>
          <div class="team-role">概念命名史與男性幹話文化剖析；拆解吃豆腐到性騷擾與直男防衛機制。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#09 視覺架構</div>
          <div class="team-name">郭泓佑</div>
          <div class="team-role">投影片邏輯架構協調，維持編輯社論風層次與視覺節奏。</div>
        </div>
        <div class="team-card">
          <div class="team-badge">#10 提問綜理</div>
          <div class="team-name">鄭傑尹</div>
          <div class="team-role">性別盲點與結語收束，統整討論回饋與平權實踐落實方向。</div>
        </div>
      </div>

      <div class="team-summary-strip">
        <span class="badge-index" style="background: rgba(154,52,18,0.08); color: var(--color-accent-terracotta); border-color: rgba(154,52,18,0.2);">
          🟠 3 位口頭主講：廖峻毅、陳品昊、林展頡
        </span>
        <span class="badge-index" style="background: rgba(28,25,23,0.04); color: var(--color-ink-muted); border-color: var(--color-hairline);">
          ⚪ 7 位研究統整：李昕澤、江沂絃、林季頻、林博閎、林亨澤、郭泓佑、鄭傑尹
        </span>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【廖峻毅提示】</strong>「我們第 3 組採取嚴謹的專案分工：由昕澤研讀文獻、沂絃考證習俗、季頻蒐集網路案例、博閎整理法制修法、亨澤設計現場討論題，並由泓佑與傑尹協調投影片邏輯與收尾。上台部分分為三個段落：我先負責導讀並破除男女溝通迷思；接著品昊會剖析髒話與論壇流行語裡的權力階序與寒蟬效應；最後展頡會說明法律正名歷史與男性幹話防衛機制，並主持現場討論。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 3: 體制盲點與前情回顧 ==================== -->
<section class="presentation-slide needs" id="slide-3" data-chapter="pin" data-shape="musicalDna">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 03 / 12</span>
        <span class="badge-topic">體制盲點與前情回顧 ｜ Ch1 & Ch2 精華串聯</span>
      </div>
      <h2 class="slide-title">體制盲點：說話的習慣，往往是制度教出來的</h2>
      <p class="slide-subtitle">話不是憑空冒出來的，它背後連著父權結構與從小看到的習俗規矩</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            [CH1 體制結構]
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; margin: 0 0 14px 0; color: var(--color-ink);">
            Allan Johnson 父權體制四大特徵
          </h3>
          <ul class="editorial-list" style="gap: 12px;">
            <li><strong>男性支配（Male-Dominated）：</strong>政治、經濟與重要決策權力長年集中在男性手中。</li>
            <li><strong>認同男性（Male-Identified）：</strong>文化核心把果斷、理性等陽剛特質預設為唯一標準。</li>
            <li><strong>以男性為中心（Male-Centered）：</strong>歷史敘事與焦點圍繞男性經驗，女性視角常淪為陪襯。</li>
            <li><strong>由男性控制（Obsession with Control）：</strong>高度強調支配感，包含對他人、情感與弱勢群體的控制。</li>
          </ul>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 16px; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 6px;">
              [CH2 習俗規範] 婚俗中的文化暴力
            </div>
            <p style="font-size: 0.92rem; line-height: 1.62; color: var(--color-ink-muted); margin: 0;">
              <strong>丟扇子、踩瓦片、跨火爐、潑水出嫁：</strong>表面是討吉利、避邪除煞，實際上卻把新娘當成「帶有壞脾氣與晦氣的外人」，在儀式上切斷她和原生家庭的連結。
            </p>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-slate); letter-spacing: 0.08em; margin-bottom: 6px;">
              [法制演進] 體制框架的鬆動與限制
            </div>
            <p style="font-size: 0.92rem; line-height: 1.62; color: var(--color-ink-muted); margin: 0;">
              <strong>從母姓與身分認同：</strong>民法雖然已經允許子女從母姓，但現在登記從母姓的比例依然只有大約 5%；2022 年憲判字第 4 號也宣告「原住民身分綁漢人父姓」違憲。法律雖然在修，但父系宗族的約束力在日常生活裡還是很強。
            </p>
          </div>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: 1.15rem; font-family: var(--font-ui); font-weight: 600;">
          法律修了，習俗卻根深蒂固：從 Allan Johnson 說的男性支配，到婚禮上踩瓦片把新娘當帶晦氣的外人，父權邏輯就是這樣悄悄變成了大家的反射動作。
        </div>
        <div class="monument-author">階梯進程：體制結構（Ch1）➔ 習俗規範（Ch2）➔ 語言日常（Ch3）</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【廖峻毅提示】</strong>「在進入第三章語言討論之前，我們先把前兩章的概念串起來。我們每天講的話不是憑空出現的，它是背後體制與傳統習俗的投射。社會學家 Allan Johnson 指出，父權體制有四個核心特徵：男性支配、認同男性、以男性為中心與渴望控制；而第二章提到的丟扇子、踩瓦片，表面是討喜氣，實際上把出嫁女性當成帶晦氣的外人。就連民法修法允許從母姓，至今也只有約 5% 的人登記從母姓。有了這層結構概念，我們就能看清日常語言是怎麼替這些舊觀念護航的。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 4: 破除刻板印象 (男女溝通真的不同星球嗎？) ==================== -->
<section class="presentation-slide science" id="slide-4" data-chapter="pin" data-shape="cymatics">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 04 / 12</span>
        <span class="badge-topic">Ch3 Q1 ｜ 破除刻板印象</span>
      </div>
      <h2 class="slide-title">破除刻板印象：男女溝通真的不同星球嗎？</h2>
      <p class="slide-subtitle">別再拿「男女天生大腦不同」當藉口：溝通方式是從小學來的，既能聽懂對方、又能清楚表達，人人都能練習。</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div class="monument-statement" style="margin-top: 0; border-top: none; padding-top: 0;">
            <div class="monument-quote" style="font-size: clamp(1.3rem, 2.1vw, 1.85rem);">
              「神經科學實證：人腦具有高度可塑性。同性別內部的個體差異，遠大於性別之間的平均差異。」
            </div>
            <div class="monument-author">DEBUNKING THE BIOLOGICAL DETERMINISM</div>
          </div>
          <p style="font-size: 0.94rem; line-height: 1.68; color: var(--color-ink-muted);">
            坊間暢銷書常宣稱男女大腦天生不同，這往往成了拒絕溝通的藉口（例如「男生本來就不擅長聽別人講話」）。科學研究早已指出：大腦隨經驗不斷重組，溝通模式主要來自後天學習。
          </p>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 16px; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 6px;">
              [JULIA WOOD 社會化理論]
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 8px 0; color: var(--color-ink);">童年遊戲形塑說話風格</h4>
            <ul class="editorial-list" style="gap: 10px;">
              <li><strong>男童群體（競爭型遊戲）：</strong>常玩球類、競賽，重視輸贏與規則階層，練出以傳遞資訊為主的「報告型風格（Report Talk）」。</li>
              <li><strong>女童群體（關係型遊戲）：</strong>常玩扮家家酒、聊天，重視輪流、感受與同理，練出以建立連結為主的「關係連網型風格（Rapport Talk）」。</li>
            </ul>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 6px;">
              [平權實踐] 突破二元標籤
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 8px 0; color: var(--color-ink);">雙性化溝通（Androgynous Communication）</h4>
            <p style="font-size: 0.92rem; line-height: 1.6; color: var(--color-ink-muted); margin: 0;">
              跳脫「男要果斷、女要溫柔」的框架。該劃清界線時把話講清楚，該同理時好好聽對方說，兩者都是後天可以學會的對話能力，不是天生性格。
            </p>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【廖峻毅提示】</strong>「每次情侶吵架，大家最愛搬出《男人來自火星，女人來自金星》，好像講一句『男女大腦天生不同』，就可以兩手一攤不解決問題。但 Julia Wood 跟現代神經科學都打臉這件事：大腦可塑性很高，同一群男生或同一群女生之間的個別差異，遠遠大過男女平均值。那為什麼溝通風格看起來差很多？因為小時候玩的遊戲不同：男生常玩比輸贏的球賽，習慣『只講重點、爭主導權』的報告型說話；女生常玩扮家家酒，習慣『照顧感受、維持關係』的連網型說話。這都是練出來的技能。既然是後天學的，男生也能學會同理，女生也能堅定劃清界線。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 5: 辱罵語的性別階序 ==================== -->
<section class="presentation-slide testimonials" id="slide-5" data-chapter="pin" data-shape="waveform">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 05 / 12</span>
        <span class="badge-topic">Ch3 Q2 (上) ｜ 語言辱罵階序</span>
      </div>
      <h2 class="slide-title">辱罵語的性別階序：為什麼髒話總在「問候」女性？</h2>
      <p class="slide-subtitle">日常髒話很少問候爸爸，幾乎都在罵女性器官與母親。這不是巧合，背後是一整套男尊女卑與財產從屬的權力順序。</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num">[01]</span>
            <span class="step-tag">身體器官污名化</span>
          </div>
          <h3 class="step-title">生殖詞彙的雙重標準</h3>
          <ul class="editorial-list">
            <li><strong>精準鎖定：</strong>日常辱罵用詞絕大多數直接指向女性生殖器官與性徵。</li>
            <li><strong>雙重標準：</strong>誇獎男性時用「很屌、有種」，侮辱別人時卻全拿女性器官與親屬當武器。</li>
            <li><strong>降格為羞辱工具：</strong>把女性身體特徵等同於骯髒、下流、可隨意踐踏的字眼。</li>
            <li><strong>語言物化：</strong>把特定性別的尊嚴直接當成排泄與發洩對象。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-forest);">[02]</span>
            <span class="step-tag">父權交換體系</span>
          </div>
          <h3 class="step-title">歷史財產附庸性</h3>
          <ul class="editorial-list">
            <li><strong>名譽綁定：</strong>傳統父系宗族體系曾將女性視為屬於男性的從屬與家族名譽。</li>
            <li><strong>羞辱母姊的本質：</strong>宣稱玷污對方的母親或姐妹，藉以重擊該男性的陽剛自尊。</li>
            <li><strong>私有財產爭奪：</strong>問候對方的女性親屬，本質是男人向另一個男人挑釁私有財產。</li>
            <li><strong>女性主體被消音：</strong>在男性的口頭決鬥中，女性只是毫無主體性的受害符號。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-slate);">[03]</span>
            <span class="step-tag">習慣性遮蔽</span>
          </div>
          <h3 class="step-title">隱形暴力的日常化</h3>
          <ul class="editorial-list">
            <li><strong>口頭禪脫罪：</strong>很多人會辯解「只是習慣發洩、沒有那個意思」來合理化脫口而出。</li>
            <li><strong>權力秩序複製：</strong>每一次無意識的使用，其實都在幫這套男尊女卑的說話環境背書。</li>
            <li><strong>同儕認同測試：</strong>在部分男性圈子裡，講粗口甚至成了證明男子氣概的通行證。</li>
            <li><strong>批判性覺察：</strong>停止把壓迫性詞彙當成理所當然的日常背景音。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: clamp(1.1rem, 1.6vw, 1.35rem); font-family: var(--font-ui); font-weight: 600;">
          髒話很少問候對方的父親，絕大多數都在罵女性器官與母親。在傳統父權邏輯裡，女性曾被當作男性的從屬與家族名譽——想要重擊一個男人的尊嚴，最快的方法就是公開踐踏屬於他的女性親屬。
        </div>
        <div class="monument-author">從表層洩憤到深層權力階序</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【陳品昊提示】</strong>「接下來由我陳品昊報告。大家有沒有想過：為什麼我們聽到的三字經、五字經，幾乎都在問候別人的媽媽或女性生殖器，很少聽到有人問候爸爸？社會學分析指出：在過去宗族社會裡，女性曾被視為男人的附屬品和家族名譽；當一個男人要徹底羞辱另一個男人，最快的方式就是羞辱對方的母親或姊妹。當我們平時把這些話當作口頭禪時，我們其實是在無意識地替這套歧視結構背書。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 6: 數位性別暴力 ==================== -->
<section class="presentation-slide faq" id="slide-6" data-chapter="pin" data-shape="freeFlow">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 06 / 12</span>
        <span class="badge-topic">Ch3 Q2 (下) ｜ 數位性別暴力</span>
      </div>
      <h2 class="slide-title">數位性別暴力：網路流行語只是「開玩笑」？</h2>
      <p class="slide-subtitle">在推文底下大家常說「嘴砲而已認真什麼」，但雙重標準與網路圍攻，正在讓許多女性被迫在公共看板上安靜。</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            [標籤化現象：論壇常見詞彙]
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
            <div style="border-left: 2px solid var(--color-accent-terracotta); padding-left: 12px;">
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--color-ink);">「台女」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.5;">從客觀地域稱謂，變質為眼高手低、拜金自私的貶抑標籤。</div>
            </div>
            <div style="border-left: 2px solid var(--color-ink); padding-left: 12px;">
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--color-ink);">「母豬、女拳、三寶、綠茶婊」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.5;">人為劃分好女人與劣等女人，將個別負面事件無限上綱為全體性別原罪。</div>
            </div>
            <div style="border-left: 2px solid var(--color-accent-forest); padding-left: 12px;">
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--color-ink);">「ㄈㄈ尺（CCr）」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.5;">跨文化交往中的性別雙標，極度貶抑女性與外籍人士交往為崇洋賣台。</div>
            </div>
          </div>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 16px; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-ink); letter-spacing: 0.08em; margin-bottom: 6px;">
              [赤裸的性別雙標]
            </div>
            <ul class="editorial-list" style="gap: 8px;">
              <li><strong>經濟追求：</strong>男生談薪水被誇「務實上進」；女生在乎經濟條件就被酸「拜金吸血、台女」。</li>
              <li><strong>情慾探索：</strong>男生情史豐富被捧為「情聖、勝利組」；女生大方聊性就被羞辱為「破麻、公車」。</li>
              <li><strong>同儕激化：</strong>在推文集體嘲弄弱勢，藉由抱團取暖建構優越感。</li>
            </ul>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 6px;">
              [實質傷害] 數位寒蟬效應（Chilling Effect）
            </div>
            <p style="font-size: 0.94rem; line-height: 1.62; color: var(--color-ink); font-weight: 500; margin: 0;">
              在 PTT、Dcard 上，只要女性發言逆風，隨之而來的就是人身攻擊、人肉搜索甚至騷擾私訊。許多人受不了選擇刪文、隱藏性別或退出看板。這不只是螢幕上的嘴砲，這是在用集體霸凌把特定群體實質趕出公共討論空間。
            </p>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【陳品昊提示】</strong>「換到網路論壇，這類攻擊換了包裝，變成『台女、母豬、女拳、三寶』這些流行詞。大家在推文底下一人一句，常覺得『只是嘴砲好玩』。但標準往往很不一樣：男生在乎薪水被誇上進，女生在乎條件就變拜金。更嚴重的是，很多女生看到這些留言，會直接選擇不發文、不留言，甚至隱藏性別或退出看板。這不是開玩笑，這是在讓特定的聲音慢慢在公共討論裡消失。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 7: 命名即權力 ==================== -->
<section class="presentation-slide services" id="slide-7" data-chapter="pin" data-shape="ripples">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 07 / 12</span>
        <span class="badge-topic">Ch3 Q3 (上) ｜ 概念賦權</span>
      </div>
      <h2 class="slide-title">命名即權力：從「吃豆腐」到「性騷擾」</h2>
      <p class="slide-subtitle">傷害如果沒有名字，受害者只能自己懷疑自己。有了法律正式名稱，界線與責任才算真正確立。</p>

      <div class="contrast-grid">
        <div class="contrast-side">
          <div class="contrast-badge" style="color: var(--color-ink-light);">舊時代語彙（除罪與輕浮化）</div>
          <div class="contrast-term" style="color: var(--color-ink-muted); text-decoration: line-through decoration-1;">「吃豆腐、鹹豬手」</div>
          <ul class="editorial-list" style="gap: 12px;">
            <li><strong>語境特徵：</strong>調侃輕佻，把身體越界大事化小、視為風流玩笑。</li>
            <li><strong>權力遮蔽：</strong>淡化支配本質，暗示受害者「別小題大做、開不起玩笑」。</li>
            <li><strong>自責陷阱：</strong>受害者常被反過來檢討「是不是自己舉止不莊重惹人誤會」。</li>
            <li><strong>加害者免責：</strong>缺乏法律名稱與究責依據，受害者只能被迫隱忍。</li>
          </ul>
        </div>

        <div class="contrast-side">
          <div class="contrast-badge" style="color: var(--color-accent-forest);">現代法制概念（法律與權力界定）</div>
          <div class="contrast-term" style="color: var(--color-accent-forest);">「性騷擾（Sexual Harassment）」</div>
          <ul class="editorial-list" style="gap: 12px;">
            <li><strong>法律定性：</strong>明確界定為違反個人意願、帶有性或性別意涵之侵犯。</li>
            <li><strong>以尊嚴為核心：</strong>確立權力不對等本質，以受害者的主觀感受與尊嚴為判準。</li>
            <li><strong>翻轉主體性：</strong>從被動配合翻轉為具有法律依據的正當合法申訴。</li>
            <li><strong>制度保障：</strong>催生台灣性平三法，建立專屬通報、調查與懲戒救濟機制。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement" style="border-top: none; margin-top: 14px;">
        <div class="monument-quote" style="font-size: clamp(1.1rem, 1.5vw, 1.35rem); font-family: var(--font-ui); font-weight: 600;">
          如果一個傷害沒有名字，受害者連求救都會懷疑自己太敏感。把「吃豆腐」正式定名為「性騷擾」，就是撕掉「開玩笑」的遮羞布，讓界線與法律責任清清楚楚。
        </div>
        <div class="monument-author">權力天平對比：擁有命名權，才能確立保護界線</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林展頡提示】</strong>「大家好，我是林展頡。大家請看這一頁的強烈對比：過去長輩如果被鹹豬手摸一把，只能吞忍說『被吃豆腐』，這個詞把侵犯行為包裝成輕佻的玩笑，受害者甚至會被責怪開不起玩笑。直到 1970 年代女性主義者將它正式命名為『性騷擾』，並推動法律制定，受害者才終於有了合法的武器。這就是社會學講的『命名即賦權』——有了名字，才能把傷害看清楚。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 8: 概念的當代進化 ==================== -->
<section class="presentation-slide contact" id="slide-8" data-chapter="pin" data-shape="orb">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 08 / 12</span>
        <span class="badge-topic">Ch3 Q3 (下) ｜ 概念當代進化</span>
      </div>
      <h2 class="slide-title">概念的當代進化：語言如何推動平權？</h2>
      <p class="slide-subtitle">把焦點從「檢討被害人」移回「未經同意散布」的侵權犯罪，語言精準，法律保護才能到位。</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num">[BEFORE]</span>
            <span class="step-tag">舊名盲點</span>
          </div>
          <h3 class="step-title">「復仇式色情」之弊</h3>
          <ul class="editorial-list">
            <li><strong>誤導焦點：</strong>「復仇」兩字過度聚焦加害者動機，彷彿受害者欠了對方什麼。</li>
            <li><strong>檢討被害人：</strong>「色情」字眼暗示受害者私生活不檢點，帶來嚴重道德審判。</li>
            <li><strong>排除廣泛情境：</strong>無法涵蓋駭客盜取、牟利販售等非報復性質的數位犯罪。</li>
            <li><strong>二次傷害：</strong>讓被害人陷於自責，難以啟齒對外尋求法律求助。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-forest);">[EVOLUTION]</span>
            <span class="step-tag">正名價值</span>
          </div>
          <h3 class="step-title">未經同意散布私密性影像</h3>
          <ul class="editorial-list">
            <li><strong>回歸侵權本質：</strong>核心在於「違反知情同意與隱私自主權」，無關私生活道德。</li>
            <li><strong>撕下色情標籤：</strong>明確宣告非自願私密影像不是娛樂，而是嚴重數位性別暴力。</li>
            <li><strong>受害者不必再自責：</strong>不是受害者做錯了什麼，是散布者犯了法。</li>
            <li><strong>法律視角拓寬：</strong>從只管男女的「兩性平等」，進步到保障多元氣質與認同的「性別平等」。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-slate);">[STATUTE]</span>
            <span class="step-tag">刑法正面回應</span>
          </div>
          <h3 class="step-title">台灣刑法實質立法</h3>
          <ul class="editorial-list">
            <li><strong>刑法第 319-3 條：</strong>未經同意散布性影像罪，處三年以下有期徒刑。</li>
            <li><strong>意圖營利加重：</strong>若意圖營利散布，處五年以下有期徒刑。</li>
            <li><strong>平台下架機制：</strong>建立被害人保護防護網，要求網路平台限期移除與封網。</li>
            <li><strong>法制指引力：</strong>語言概念的精準度，直接決定了司法的保護防線。</li>
          </ul>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林展頡提示】</strong>「我們再看一個當代最重要的例子：過去媒體報導外流私密照，總愛用『復仇式色情』這種聳動字眼。但這個詞隱含了檢討被害人，好像女生有把柄欠別人一樣。現在法律界與社會正名為『未經同意散布私密性影像』，重點在於『未經同意』！台灣刑法也在第 319-3 條正式入罪。另外，從『兩性』拓展到『性別平等』，也是語言進步推動多元保障的實例。語言越精準，法律才能保護得越周全。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 9: 直男行為學 ==================== -->
<section class="presentation-slide" id="slide-9" data-chapter="pin" data-shape="clarity">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 09 / 12</span>
        <span class="badge-topic">Ch3 Q4 ｜ 直男行為學</span>
      </div>
      <h2 class="slide-title">直男行為學：為什麼男生只講幹話、不聊心事？</h2>
      <p class="slide-subtitle">男生聚在一起好像只能聊打球、打遊戲、講垃圾話？拆解直男社交背後的「男子氣概包袱」與恐同焦慮。</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num">[I]</span>
            <span class="step-tag">任務導向</span>
          </div>
          <h3 class="step-title">缺乏情感腳本</h3>
          <ul class="editorial-list">
            <li><strong>活動圍繞具體事物：</strong>男性社交大多圍繞打球、打遊戲、比拼輸贏。</li>
            <li><strong>男子氣概包袱：</strong>從小被灌輸「男兒有淚不輕彈」，傾訴脆弱常被同儕視為軟弱。</li>
            <li><strong>缺乏練習情境：</strong>成長過程中缺少練習坦露情感的語言腳本，習慣壓抑感受。</li>
            <li><strong>情感孤立：</strong>外表看似團結熱鬧，內心卻缺少可以放心示弱的傾訴管道。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-forest);">[II]</span>
            <span class="step-tag">隱形審查</span>
          </div>
          <h3 class="step-title">恐同焦慮（Homophobia）</h3>
          <ul class="editorial-list">
            <li><strong>同儕性別審查：</strong>男性之間過度細膩的關懷，容易引起同儕質疑「很娘、很甲」。</li>
            <li><strong>防衛性疏離：</strong>害怕被貼上不夠陽剛的標籤，刻意用粗魯語言拉開情感安全距離。</li>
            <li><strong>陽剛證明儀式：</strong>透過聊黃腔、互嗆、爭強好勝，反覆自我證明異性戀身分。</li>
            <li><strong>深層阻隔：</strong>友誼維持在活動層面，難以觸及真實的生命困境與心理脆弱。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-slate);">[III]</span>
            <span class="step-tag">防禦機制</span>
          </div>
          <h3 class="step-title">幹話的替代性親密</h3>
          <ul class="editorial-list">
            <li><strong>安全防護罩：</strong>幹話是男生的防彈背心。透過互嗆互酸，在低風險中維持兄弟情誼。</li>
            <li><strong>包裝真實關心：</strong>明明想問「你最近還好嗎？」，嘴巴講出來卻變成「你怎麼還沒死」。</li>
            <li><strong>避險代價：</strong>用幹話包裝真心，既能維持交情，又不必承擔展露脆弱被嘲笑的風險。</li>
            <li><strong>深層反思：</strong>父權體制不只限制女性，也剝奪了男性自由表達脆弱的權利。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: clamp(1.1rem, 1.6vw, 1.35rem); font-family: var(--font-ui); font-weight: 600;">
          男生聚在一起狂講幹話，不是真的沒心沒肺；而是在「男生不能哭、不能示弱」的社會期待下，這是他們唯一學會、不會被同儕嘲笑的陪伴方式。
        </div>
        <div class="monument-author">解構有毒男子氣概：給男性一個允許哭泣與坦誠的安全空間</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林展頡提示】</strong>「我們身為男生，真的只會打遊戲、講幹話嗎？很多人問：為什麼男生聚在一起不能好好聊心事？社會學點出關鍵在於『恐同焦慮』與『男子氣概壓力』。在男生圈子裡，認真聊情緒很容易被同儕笑說很娘、很甲；所以大家發明了『幹話互虧』作為替代性親密。表面上很熱絡，其實是在逃避真實的脆弱。父權體制不只壓迫女性，也同樣剝奪了男性示弱與好好表達感受的權利。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 10: 課堂交流與現場思辨 ==================== -->
<section class="presentation-slide" id="slide-10" data-chapter="pin" data-shape="cymatics">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 10 / 12</span>
        <span class="badge-topic">課堂交流與現場思辨 ｜ 換你答 Interactive Discussion</span>
      </div>
      <h2 class="slide-title">課堂交流與現場思辨：換你答！</h2>
      <p class="slide-subtitle">三個貼近日常生活的開放思考題，預留 3–5 分鐘邀請全班同學共同對話</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-terracotta);">QUESTION 01</span>
            <span class="step-tag">校園現場</span>
          </div>
          <h3 class="step-title" style="font-size: 1.22rem; line-height: 1.45;">
            在大學分組或社團幹部中，主動爭取發言與領導的通常是男生還是女生？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：我們對男女發言風格有什麼不同的評價？是否仍存在「男有魄力、女強勢挑剔」的刻板標籤？
          </p>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-forest);">QUESTION 02</span>
            <span class="step-tag">婚俗與家庭</span>
          </div>
          <h3 class="step-title" style="font-size: 1.22rem; line-height: 1.45;">
            如果未來你（或好友）結婚，會堅持拿掉哪些傳統儀式？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：丟扇、踩瓦、潑水、從母姓選擇，以及面對長輩宗族傳統期待時，可以如何開啟跨世代對話？
          </p>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-slate);">QUESTION 03</span>
            <span class="step-tag">同儕支持</span>
          </div>
          <h3 class="step-title" style="font-size: 1.22rem; line-height: 1.45;">
            身邊的男性朋友陷入情緒低潮時，除了「走啦喝一杯」，我們還能怎麼陪伴？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：如何卸下男子氣概防衛機制，打造一個允許對方放心示弱、說說真心話的非評判環境？
          </p>
        </div>
      </div>

      <div class="monument-statement" style="text-align: center; justify-content: center; align-items: center;">
        <div class="monument-quote" style="font-size: 1.15rem; font-weight: 600;">
          這三題沒有標準答案，大家這學期在學校、在宿舍一定遇過，換大家分享！
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林展頡提示】</strong>「現在把麥克風交給全班。這三道題沒有標準答案，但都深深刻在我們的生活裡。第一題是校園分組的發言經驗；第二題是大家對未來婚俗的想像；第三題是我們身為朋友，怎麼讓男生也能放心講心事。請大家花三十秒想想看，等等我們開放兩到三位同學分享您的觀察。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 11: 總結——邁向雙性化的平權未來 ==================== -->
<section class="presentation-slide faq" id="slide-11" data-chapter="pin" data-shape="freeFlow">
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 11 / 12</span>
        <span class="badge-topic">總結收束 ｜ 邁向雙性化的平權未來</span>
      </div>
      <h2 class="slide-title">總結：邁向雙性化的平權未來</h2>
      <p class="slide-subtitle">語言從來不是中立的。看清結構對男女雙方的束縛，從每天說話的習慣開始改變。</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-terracotta);">PILLAR 01</span>
            <span class="step-tag">日常自覺</span>
          </div>
          <h3 class="step-title">覺察話語習慣</h3>
          <ul class="editorial-list">
            <li><strong>語言非中立：</strong>隨時反思脫口而出的口頭禪與網路流行語背後隱含的權力架構。</li>
            <li><strong>停止日常遮蔽：</strong>不再以「只是開玩笑」替性別辱罵與刻板標籤脫罪。</li>
            <li><strong>用詞精準化：</strong>支持正名，讓隱蔽的受害經驗能被看見與救濟。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-forest);">PILLAR 02</span>
            <span class="step-tag">超越對立</span>
          </div>
          <h3 class="step-title">看見結構性束縛</h3>
          <ul class="editorial-list">
            <li><strong>跳脫二元思維：</strong>不把性別議題簡化為男女個人對立，看見結構對所有人的傷害。</li>
            <li><strong>看見雙向限制：</strong>女性承受了身體物化與數位寒蟬；男性則背負著壓抑脆弱的包袱。</li>
            <li><strong>鬆動宗族體制：</strong>在日常生活與儀式中，主動打破父系中心思維。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="step-header">
            <span class="step-num" style="color: var(--color-accent-slate);">PILLAR 03</span>
            <span class="step-tag">生活實踐</span>
          </div>
          <h3 class="step-title">實踐雙性化溝通</h3>
          <ul class="editorial-list">
            <li><strong>靈活轉換風格：</strong>男性可以坦率溫柔示弱，女性可以果斷捍衛個人界線。</li>
            <li><strong>打造安全空間：</strong>在同儕之間建立允許分享真實感受、互相承接的信任關係。</li>
            <li><strong>生活化落實：</strong>讓溝通回歸真誠互動，人人都能自在做自己。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: 1.18rem; font-family: var(--font-ui); font-weight: 600;">
          話語不是工具，話語本身就是權力。退回那些習慣成自然的歧視髒話、在朋友想哭時別急著叫他「喝一杯就好」，我們平常怎麼跟身邊的人說話，決定了我們活在什麼樣的社會。
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【廖峻毅提示】</strong>「今天報告的最後，我們想說的是：語言不是客觀中立的。女生在網路上被貼標籤、罵髒話時承受的寒蟬效應，跟男生在現實裡被壓抑、只能靠講幹話防衛的情感孤立，其實都是同一套父權框架造成的傷害。破除刻板印象，不是要男女互相對立指責，而是讓我們都能卸下防衛：想說真話的時候能勇敢劃清界線，想示弱的時候能被溫柔接住。謝謝大家。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 12: 參考文獻與致謝 ==================== -->
<section class="presentation-slide faq" id="slide-12" data-chapter="pin" data-shape="ripples" data-flow>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="slide-eyebrow">
        <span class="badge-index">SLIDE 12 / 12</span>
        <span class="badge-topic">專案總結 ｜ 參考文獻與致謝</span>
      </div>
      <h2 class="slide-title">參考文獻與報告致謝</h2>
      <p class="slide-subtitle">感謝 陳竹上 教授 悉心指導 ｜ 第 3 組全體 10 位組員敬上</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            [學術文獻與司法裁判依據]
          </div>
          <ul class="editorial-list" style="font-size: 0.88rem; gap: 8px;">
            <li>陳竹上教授等（2023）。《臺灣性別100+問》（Ch1 黃長玲、李佩雯；Ch2 姜貞吟；Ch3 李佩雯）。巨流圖書公司。</li>
            <li>Allan G. Johnson（2008）。《見樹又見林：社會學作為一種生活、實踐與承諾》。成令方等譯。群學。</li>
            <li>Julia T. Wood（2011）。《性別化的人生：傳播、性別與文化》。五南。</li>
            <li>司法院憲法法庭 111 年憲判字第 4 號判決（原住民身分與姓氏規範案）。</li>
            <li>中華民國刑法第 319-3 條（未經同意散布性影像罪）。</li>
          </ul>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 8px;">
            [報告團隊 10 位組員全名]
          </div>
          <div style="font-size: 0.94rem; line-height: 1.7; color: var(--color-ink);">
            <strong>口頭主講代表：</strong>廖峻毅 ｜ 陳品昊 ｜ 林展頡<br>
            <strong>專案研究統整：</strong>李昕澤 ｜ 江沂絃 ｜ 林季頻 ｜ 林博閎 ｜ 林亨澤 ｜ 郭泓佑 ｜ 鄭傑尹
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-hairline); display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--color-ink);">國立高雄師範大學 通識教育中心</div>
              <div style="font-size: 0.82rem; color: var(--color-ink-muted); margin-top: 2px;">《性別與文化》專案報告完畢</div>
            </div>
            <span class="badge-index" style="background: rgba(42,95,69,0.08); color: var(--color-accent-forest); border: none;">
              Q & A 提問交流
            </span>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【全組致謝】</strong>「非常感謝陳竹上教授的指導與全體同學的聆聽。我們第 3 組全體 10 位組員的報告到這裡告一段落。接下來開放現場 Q&A 提問與老師講評指導，謝謝大家！」
        </div>
      </details>
    </div>
  </div>
</section>
`;

// 3. Replace <main> Content
const mainRegex = /<main[^>]*id="main"[^>]*>[\s\S]*?<\/main>/;
const match = html.match(mainRegex);
if (match) {
  const openTagMatch = match[0].match(/<main[^>]*id="main"[^>]*>/);
  const openTag = openTagMatch ? openTagMatch[0] : '<main id="main">';
  const sectionsBuilderScript = '<script type="module" src="./_astro/SectionsBuilder.astro_astro_type_script_index_0_lang.bRAIUHcx.js"></script>';
  const newMainContent = `${openTag}\n${slidesHtml}\n${sectionsBuilderScript}\n</main>`;
  html = html.replace(mainRegex, newMainContent);
  console.log('Successfully replaced <main> sections with 12 editorial slides');
} else {
  console.error('ERROR: Could not find <main id="main"> tag in index.html!');
  process.exit(1);
}

// 4. Update Header Chapters to 12
const newHeaderChapters = `
<div class="chapters" style="--chapter-count: 12" data-astro-cid-ywwchgwn><ol aria-label="Sections" data-astro-cid-ywwchgwn><li class="caps-small-bold" data-label="封面" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-1" aria-label="Slide 01 封面" data-astro-cid-ywwchgwn>01</a></li><li class="caps-small-bold" data-label="分工" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-2" aria-label="Slide 02 分工" data-astro-cid-ywwchgwn>02</a></li><li class="caps-small-bold" data-label="體制" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-3" aria-label="Slide 03 體制" data-astro-cid-ywwchgwn>03</a></li><li class="caps-small-bold" data-label="迷思" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-4" aria-label="Slide 04 迷思" data-astro-cid-ywwchgwn>04</a></li><li class="caps-small-bold" data-label="辱罵" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-5" aria-label="Slide 05 辱罵" data-astro-cid-ywwchgwn>05</a></li><li class="caps-small-bold" data-label="數位" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-6" aria-label="Slide 06 數位" data-astro-cid-ywwchgwn>06</a></li><li class="caps-small-bold" data-label="命名" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-7" aria-label="Slide 07 命名" data-astro-cid-ywwchgwn>07</a></li><li class="caps-small-bold" data-label="進化" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-8" aria-label="Slide 08 進化" data-astro-cid-ywwchgwn>08</a></li><li class="caps-small-bold" data-label="直男" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-9" aria-label="Slide 09 直男" data-astro-cid-ywwchgwn>09</a></li><li class="caps-small-bold" data-label="思辨" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-10" aria-label="Slide 10 現場思辨" data-astro-cid-ywwchgwn>10</a></li><li class="caps-small-bold" data-label="總結" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-11" aria-label="Slide 11 總結" data-astro-cid-ywwchgwn>11</a></li><li class="caps-small-bold" data-label="致謝" data-astro-cid-ywwchgwn><a class="caps-med-bold" href="#slide-12" aria-label="Slide 12 參考文獻" data-astro-cid-ywwchgwn>12</a></li></ol></div>
`;
html = html.replace(/<div class="chapters" style="--chapter-count: \d+"[\s\S]*?<\/div>/, newHeaderChapters.trim());

// Clean header utility links
const newHeaderPages = `
<ul class="pages caps-med-bold" data-astro-cid-ywwchgwn>
  <li data-astro-cid-ywwchgwn><button id="btn-prompter-toggle" class="dock-btn" style="background:var(--color-ink-faint);padding:6px 14px;border-radius:99px;font-size:0.8rem;border:1px solid var(--color-hairline);">🎙️ 講稿提示</button></li>
</ul>
`;
html = html.replace(/<ul class="pages caps-med-bold" data-astro-cid-ywwchgwn>[\s\S]*?<\/ul>/, newHeaderPages.trim());

// 5. Update Header Logo
const oldLogoMatch = html.match(/<a href="[^"]*" class="logo is-header svelte-ciedsx"[\s\S]*?<\/a>/);
if (oldLogoMatch) {
  const newLogo = `<a href="#slide-1" class="logo is-header svelte-ciedsx" data-astro-cid-ywwchgwn="true" style="text-decoration:none;"><span style="font-family:var(--font-heading);font-weight:800;font-size:1.15rem;letter-spacing:0.02em;color:var(--color-ink);">話語即權力</span><span style="font-size:0.75rem;color:var(--color-ink-muted);margin-left:8px;font-weight:600;">第 3 組 ｜ 性別與文化</span></a>`;
  html = html.replace(oldLogoMatch[0], newLogo);
}

// 6. Clean Overlays & Scripts
const webglSceneScriptTag = '<script type="module" src="./_astro/WebglScene.astro_astro_type_script_index_0_lang.CWPYA6Qw.js"></script>';
const scriptPos = html.indexOf(webglSceneScriptTag);
if (scriptPos !== -1) {
  html = html.substring(0, scriptPos + webglSceneScriptTag.length);
}

// 7. Inject Presenter Controls, Prompter, and Footer
const presenterScript = `
<!-- Floating Prompter Modal -->
<div class="prompter-modal" id="prompter-modal" role="dialog" aria-label="講者提示視窗">
  <div class="prompter-header">
    <span class="prompter-title" id="prompter-speaker-tag">🎙️ 講者口語逐字稿提示</span>
    <button class="prompter-close" id="prompter-close-btn" aria-label="關閉提示">✕</button>
  </div>
  <div class="prompter-text" id="prompter-content">
    正在載入講稿...
  </div>
</div>

<!-- Bottom Navigation Dock -->
<nav class="slide-dock" id="slide-dock" aria-label="Presentation controls">
  <button class="dock-btn" id="dock-prev-btn" aria-label="上一頁">▲ 前一頁</button>
  <span class="dock-counter" id="dock-counter">01 / 12</span>
  <button class="dock-btn" id="dock-next-btn" aria-label="下一頁">▼ 下一頁</button>
  <button class="dock-btn" id="dock-notes-toggle" style="margin-left:6px;border-left:1px solid var(--color-hairline);padding-left:10px;">🎙️ 講稿提示</button>
</nav>

<!-- Clean Footer Bar -->
<div class="presentation-footer-bar">
  <span>高師大通識教育《性別與文化》 ｜ 第 3 組全體 10 位組員</span>
</div>

<script>
  (function() {
    document.body.classList.remove('is-preloading');
    document.body.classList.add('is-ready');

    const slides = Array.from(document.querySelectorAll('.presentation-slide'));
    const counter = document.getElementById('dock-counter');
    const prevBtn = document.getElementById('dock-prev-btn');
    const nextBtn = document.getElementById('dock-next-btn');
    const notesToggle = document.getElementById('dock-notes-toggle');
    const headerPrompterBtn = document.getElementById('btn-prompter-toggle');
    const prompterModal = document.getElementById('prompter-modal');
    const prompterClose = document.getElementById('prompter-close-btn');
    const prompterContent = document.getElementById('prompter-content');

    function getCurrentSlideIndex() {
      const activeIdx = slides.findIndex(s => s.hasAttribute('data-active'));
      if (activeIdx !== -1) return activeIdx;
      const scrollMid = window.scrollY + window.innerHeight / 2;
      for (let i = slides.length - 1; i >= 0; i--) {
        const rect = slides[i].getBoundingClientRect();
        if (rect.top + window.scrollY <= scrollMid) return i;
      }
      return 0;
    }

    function updateCounterAndPrompter() {
      const idx = getCurrentSlideIndex();
      if (counter) {
        counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      }
      if (prompterModal && prompterModal.classList.contains('is-open')) {
        const curSlide = slides[idx];
        if (curSlide) {
          const noteEl = curSlide.querySelector('[data-speaker-note]');
          if (noteEl && prompterContent) {
            prompterContent.innerHTML = noteEl.innerHTML;
          }
        }
      }
    }

    function goToSlide(targetIdx) {
      if (targetIdx < 0 || targetIdx >= slides.length) return;
      slides.forEach((s, i) => {
        if (i === targetIdx) {
          s.setAttribute('data-active', '');
          s.style.setProperty('--fade', '1');
        } else {
          s.removeAttribute('data-active');
        }
      });
      slides[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#slide-' + (targetIdx + 1));
      setTimeout(updateCounterAndPrompter, 150);
    }

    document.querySelectorAll('.header .chapters a').forEach((a, idx) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    if (window.location.hash) {
      const match = window.location.hash.match(/slide-(\d+)/);
      if (match) {
        const sIdx = parseInt(match[1], 10) - 1;
        if (sIdx >= 0 && sIdx < slides.length) {
          setTimeout(() => goToSlide(sIdx), 80);
        }
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(getCurrentSlideIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(getCurrentSlideIndex() + 1));

    function togglePrompter() {
      if (!prompterModal) return;
      prompterModal.classList.toggle('is-open');
      updateCounterAndPrompter();
    }

    if (notesToggle) notesToggle.addEventListener('click', togglePrompter);
    if (headerPrompterBtn) headerPrompterBtn.addEventListener('click', togglePrompter);

    if (prompterClose && prompterModal) {
      prompterClose.addEventListener('click', () => {
        prompterModal.classList.remove('is-open');
      });
    }

    window.addEventListener('scroll', updateCounterAndPrompter, { passive: true });
    updateCounterAndPrompter();

    window.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          goToSlide(getCurrentSlideIndex() + 1);
        }
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          goToSlide(getCurrentSlideIndex() - 1);
        }
      }
    });
  })();
</script>
</body>
</html>
`;

html += '\n' + presenterScript.trim();

// 8. Update Page Title and strip is-preloading class
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>話語即權力：日常語言與網路文化中的性別密碼 ｜ 高師大《性別與文化》第 3 組專題簡報</title>');
html = html.replace(/<body[^>]*class="([^"]*)"/i, (match, classes) => {
  const cleaned = classes.replace(/\\bis-preloading\\b/g, '').trim();
  return match.replace(classes, cleaned);
});

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully completed full presentation overhaul with 10 team members and humanized editorial design!');

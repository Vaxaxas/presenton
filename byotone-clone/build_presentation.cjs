const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Prepare Presentation Custom Styles: Editorial Minimalist with True Progressive Blur (漸層微霧化，零界線)
const presentationStyles = `
<style id="presentation-editorial-styles">
  :root {
    --color-paper: #FBF8F6;
    --color-ink: #141211;
    --color-ink-muted: rgba(20, 18, 17, 0.78);
    --color-ink-light: rgba(20, 18, 17, 0.52);
    --color-ink-faint: rgba(20, 18, 17, 0.05);
    --color-hairline: rgba(20, 18, 17, 0.12);
    --color-hairline-strong: rgba(20, 18, 17, 0.28);
    --color-accent-terracotta: #9A3412;
    --color-accent-forest: #2A5F45;
    --color-accent-slate: #1E3A8A;
    --font-heading: "Songti TC", "Noto Serif TC", "Source Han Serif TC", "STSong", Georgia, serif, system-ui;
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
    overscroll-behavior-y: none !important;
    -webkit-overflow-scrolling: touch !important;
  }

  /* 3D WebGL Canvas Fixed in Fullscreen Background (GPU hardware promoted) */
  .webgl-scene, canvas {
    position: fixed !important;
    inset: 0 !important;
    z-index: 0 !important;
    pointer-events: auto !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    will-change: transform !important;
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
    scroll-snap-stop: always !important;
    overflow: hidden !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* ========================================================
     核心：全螢幕漸層微霧化層 (Progressive Blur Layer)
     絕無死板方框、無突兀硬界線，由中央向四周平滑羽化過渡，
     中心文字清晰通透，邊緣 100% 融入 3D 動態粒子背景
     ======================================================== */
  .slide-atmosphere-gradient {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    /* 極輕微霧化，保證絲滑 60/120fps，並啟用行動端 GPU 合成層 */
    backdrop-filter: blur(3.5px);
    -webkit-backdrop-filter: blur(3.5px);
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    /* 雙向羽化遮罩：中心 100% 遮罩平滑衰減至四周 0%，無邊界切角 */
    mask-image: radial-gradient(
      ellipse 82% 76% at 50% 50%,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.9) 25%,
      rgba(0, 0, 0, 0.48) 55%,
      rgba(0, 0, 0, 0.1) 78%,
      transparent 95%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 82% 76% at 50% 50%,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.9) 25%,
      rgba(0, 0, 0, 0.48) 55%,
      rgba(0, 0, 0, 0.1) 78%,
      transparent 95%
    );
    /* 柔和溫潤的微透底色，同樣平滑羽化至 transparent */
    background: radial-gradient(
      ellipse 82% 76% at 50% 50%,
      rgba(251, 248, 246, 0.84) 0%,
      rgba(251, 248, 246, 0.68) 25%,
      rgba(251, 248, 246, 0.32) 55%,
      rgba(251, 248, 246, 0.06) 78%,
      transparent 95%
    );
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
    padding: clamp(52px, 7vh, 88px) clamp(24px, 4vw, 64px) clamp(40px, 5.5vh, 68px) !important;
    box-sizing: border-box !important;
    z-index: 10 !important;
  }

  /* 排版容器：徹底解構死框，無任何邊框、無死板方塊背景 */
  .slide-stage-wrapper {
    max-width: 1360px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 10;
    padding: clamp(14px, 2.2vh, 28px) clamp(20px, 3vw, 42px);
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  /* Editorial Kicker (告別 AI 味十足的灰色 SLIDE 01/12 方塊徽章) */
  .editorial-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .kicker-num {
    font-family: var(--font-mono);
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--color-accent-terracotta);
    letter-spacing: 0.08em;
  }

  .kicker-slash {
    color: var(--color-hairline-strong);
    font-size: 0.82rem;
    font-weight: 300;
  }

  .kicker-label {
    font-family: var(--font-ui);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--color-ink-muted);
    letter-spacing: 0.06em;
  }

  .slide-title {
    font-family: var(--font-heading);
    font-size: clamp(2.1rem, 3.4vw, 3.15rem);
    font-weight: 800;
    line-height: 1.2;
    color: var(--color-ink);
    letter-spacing: -0.02em;
    margin: 0 0 10px 0;
    text-wrap: balance;
  }

  .slide-subtitle {
    font-size: clamp(0.98rem, 1.25vw, 1.15rem);
    color: var(--color-ink-muted);
    line-height: 1.62;
    margin: 0 0 24px 0;
    max-width: 1020px;
  }

  /* 無卡片框線之純排版三欄 (De-containerized Editorial Grid) */
  .editorial-stepper-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(24px, 3.5vw, 44px);
    width: 100%;
    position: relative;
    margin-top: 6px;
  }

  .editorial-step-col {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 18px;
    border-top: 1.5px solid var(--color-hairline);
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transition: border-color 0.25s ease;
  }

  .editorial-step-col:hover {
    border-top-color: var(--color-ink);
  }

  .col-lead {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
  }

  .col-num {
    font-family: var(--font-mono);
    font-size: 1.12rem;
    font-weight: 800;
    color: var(--color-accent-terracotta);
    line-height: 1;
    letter-spacing: 0.04em;
  }

  .col-num.forest {
    color: var(--color-accent-forest);
  }

  .col-num.slate {
    color: var(--color-accent-slate);
  }

  .col-tag {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--color-ink-light);
    letter-spacing: 0.04em;
  }

  .col-title {
    font-family: var(--font-heading);
    font-size: 1.28rem;
    font-weight: 800;
    line-height: 1.32;
    color: var(--color-ink);
    margin: 0 0 12px 0;
  }

  /* Editorial Pure List */
  .editorial-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .editorial-list li {
    font-size: 0.94rem;
    line-height: 1.62;
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
    font-weight: 700;
  }

  .editorial-list strong {
    color: var(--color-ink);
    font-weight: 700;
  }

  /* Tension Split Row */
  .tension-split-row {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: clamp(24px, 4vw, 54px);
    width: 100%;
    align-items: stretch;
  }

  .tension-column {
    display: flex;
    flex-direction: column;
  }

  .tension-column-bordered {
    border-left: 1px solid var(--color-hairline);
    padding-left: clamp(20px, 3vw, 42px);
  }

  /* Monument Statement */
  .monument-statement {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1.5px solid var(--color-ink);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .monument-quote {
    font-family: var(--font-heading);
    font-size: clamp(1.15rem, 1.6vw, 1.45rem);
    font-weight: 700;
    line-height: 1.48;
    color: var(--color-ink);
  }

  .monument-author {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
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
    margin-top: 12px;
  }

  .contrast-side {
    padding: 22px clamp(18px, 2.5vw, 36px);
    display: flex;
    flex-direction: column;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .contrast-side:first-child {
    border-right: 1px solid var(--color-hairline);
    background: rgba(20, 18, 17, 0.015) !important;
  }

  .contrast-side:last-child {
    background: rgba(42, 95, 69, 0.025) !important;
  }

  .contrast-badge {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .contrast-term {
    font-family: var(--font-heading);
    font-size: clamp(1.55rem, 2.3vw, 2.1rem);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 14px 0;
  }

  /* Team Roster Layout (精緻社論名冊架構，徹底揮別死板 AI 卡片網格) */
  .team-roster-layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 8px;
  }

  .speakers-trio-row,
  .speakers-quad-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    width: 100%;
  }

  .speaker-trio-item,
  .speaker-quad-item {
    border-top: 2.5px solid var(--color-accent-terracotta);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    background: rgba(154, 52, 18, 0.035);
    padding: 14px 16px;
    border-radius: 4px;
  }

  .speaker-trio-item.forest,
  .speaker-quad-item.forest {
    border-top-color: var(--color-accent-forest);
    background: rgba(42, 95, 69, 0.035);
  }

  .speaker-trio-item.slate,
  .speaker-quad-item.slate {
    border-top-color: var(--color-accent-slate);
    background: rgba(30, 58, 138, 0.035);
  }

  .speaker-trio-item.amber,
  .speaker-quad-item.amber {
    border-top-color: #B45309;
    background: rgba(180, 83, 9, 0.035);
  }

  .speaker-trio-badge,
  .speaker-quad-badge {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-accent-terracotta);
    margin-bottom: 5px;
  }

  .speaker-trio-badge.forest,
  .speaker-quad-badge.forest {
    color: var(--color-accent-forest);
  }

  .speaker-trio-badge.slate,
  .speaker-quad-badge.slate {
    color: var(--color-accent-slate);
  }

  .speaker-trio-badge.amber,
  .speaker-quad-badge.amber {
    color: #B45309;
  }

  .speaker-trio-name,
  .speaker-quad-name {
    font-family: var(--font-heading);
    font-size: 1.28rem;
    font-weight: 800;
    color: var(--color-ink);
    margin: 0 0 5px 0;
  }

  .speaker-trio-role,
  .speaker-quad-role {
    font-size: 0.81rem;
    line-height: 1.46;
    color: var(--color-ink-muted);
  }

  .research-roster-strip {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
    border-top: 1px solid var(--color-hairline);
    padding-top: 16px;
  }

  .research-member-cell {
    display: flex;
    flex-direction: column;
    border-left: 2px solid var(--color-hairline);
    padding-left: 10px;
  }

  .research-tag {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--color-ink-light);
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }

  .research-name {
    font-size: 0.96rem;
    font-weight: 800;
    color: var(--color-ink);
    margin-bottom: 4px;
  }

  .research-desc {
    font-size: 0.73rem;
    line-height: 1.42;
    color: var(--color-ink-muted);
  }

  .team-summary-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--color-hairline);
    font-size: 0.82rem;
  }

  /* Speaker Notes Drawer */
  .speaker-notes-drawer {
    margin-top: 16px;
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
    background: rgba(20, 18, 17, 0.08);
    border-color: var(--color-ink);
  }

  .notes-body {
    margin-top: 10px;
    padding: 14px 20px;
    background: rgba(251, 248, 246, 0.94);
    border-left: 2.5px solid var(--color-accent-forest);
    border-radius: 4px;
    font-size: 0.88rem;
    line-height: 1.72;
    color: var(--color-ink);
    backdrop-filter: blur(8px);
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
    bottom: 74px;
    left: 24px;
    width: min(540px, calc(100vw - 48px));
    max-height: 380px;
    overflow-y: auto;
    background: rgba(251, 248, 246, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--color-hairline-strong);
    border-radius: 12px;
    padding: 20px 24px;
    box-shadow: 0 16px 42px rgba(20, 18, 17, 0.14);
    z-index: 2000;
    display: none;
  }

  .prompter-modal.is-open {
    display: block;
    animation: prompterFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes prompterFade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .prompter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
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

  /* Clean Presenter Dock */
  .slide-dock {
    position: fixed;
    bottom: 20px;
    left: 24px;
    z-index: 120;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(251, 248, 246, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--color-hairline);
    border-radius: 99px;
    padding: 6px 14px;
    box-shadow: 0 6px 20px rgba(20, 18, 17, 0.06);
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
    background: rgba(20, 18, 17, 0.08);
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
    .research-roster-strip {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 14px;
    }
  }

  @media (max-width: 960px) {
    .editorial-stepper-row,
    .tension-split-row,
    .tension-split-equal,
    .contrast-grid,
    .speakers-trio-row,
    .speakers-quad-row {
      grid-template-columns: 1fr !important;
      gap: 22px;
    }
    .tension-column-bordered {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid var(--color-hairline);
      padding-top: 18px;
    }
    .contrast-side:first-child {
      border-right: none;
      border-bottom: 1px solid var(--color-hairline);
    }
    .presentation-slide > .container {
      justify-content: flex-start !important;
      padding-top: 80px !important;
    }
  }

  @media (max-width: 720px) {
    .research-roster-strip {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .presentation-slide {
      scroll-snap-stop: normal !important;
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

  /* Slide 12 Immersive Holographic View */
  #slide-12 .slide-title,
  #slide-12 .slide-subtitle,
  #slide-12 .tension-split-row,
  #slide-12 .speaker-notes-drawer,
  #slide-12 #slide12-toggle-view {
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  #slide-12.is-immersed .slide-title,
  #slide-12.is-immersed .slide-subtitle,
  #slide-12.is-immersed .tension-split-row,
  #slide-12.is-immersed .speaker-notes-drawer,
  #slide-12.is-immersed #slide12-toggle-view {
    opacity: 0 !important;
    pointer-events: none !important;
    transform: translateY(12px);
  }
  #slide-12.is-immersed .immersed-hint {
    display: block !important;
    animation: fadeInHint 0.4s ease forwards;
  }
  @keyframes fadeInHint {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
</style>
`;

// Inject custom styles into <head>
if (html.includes('id="presentation-editorial-styles"')) {
  html = html.replace(/<style id="presentation-editorial-styles">[\s\S]*?<\/style>/, presentationStyles.trim());
} else {
  html = html.replace('</head>', `${presentationStyles}\n</head>`);
}

// 2. Prepare 12 Slides HTML: Professor 蔡孟哲 教授, 10 Members, True Gradient Blur
const slidesHtml = `
<!-- ==================== SLIDE 1: 封面頁 ==================== -->
<section class="presentation-slide hero" id="slide-1" data-chapter="pin" data-shape="orb" data-video="./assets/dancers-pingpong-720p.mp4?v=20261005_2" data-astro-cid-pp7d62ca>
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container" data-astro-cid-pp7d62ca>
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">01</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">國立高雄師範大學 通識教育課程 ｜ 性別與文化導讀報告</span>
      </div>

      <div class="tension-split-row" style="margin-top: 6px;">
        <div class="tension-column">
          <h1 class="slide-title" style="font-size: clamp(2.3rem, 4.2vw, 3.6rem); line-height: 1.18; margin-bottom: 16px;">
            話語即權力：<br>日常語言與網路文化中的性別密碼
          </h1>
          <p class="slide-subtitle" style="font-size: clamp(1.02rem, 1.3vw, 1.2rem); line-height: 1.68;">
            從流行語、幹話互動到體制常規的性別反思<br>
            <span style="color: var(--color-accent-terracotta); font-weight: 600;">經典導讀文本：《臺灣性別100+問》（專題研讀：第一章至第三章）</span>
          </p>
        </div>

        <div class="tension-column tension-column-bordered" style="justify-content: center;">
          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 12px;">
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-ink-light); letter-spacing: 0.08em; margin-bottom: 4px;">INSTRUCTOR 指導教授</div>
              <div style="font-size: 1.22rem; font-weight: 800; color: var(--color-ink);">蔡孟哲 教授</div>
              <div style="font-size: 0.84rem; color: var(--color-ink-muted); margin-top: 2px;">國立高雄師範大學 通識教育中心</div>
            </div>

            <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 12px;">
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 6px;">PRESENTATION TEAM 報告團隊</div>
              <div style="font-size: 0.98rem; font-weight: 700; color: var(--color-ink); line-height: 1.75;">
                <div>口頭主講代表：郭泓佑、林博閎、林亨澤、陳品昊</div>
                <div>報告簡報製作：林季頫</div>
                <div>專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹</div>
              </div>
              <div style="font-size: 0.8rem; color: var(--color-ink-light); margin-top: 6px;">全組 10 位組員分工研討製作</div>
            </div>

            <div>
              <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 4px;">CORE PERSPECTIVE 核心提問</div>
              <div style="font-size: 0.92rem; line-height: 1.6; color: var(--color-ink); font-weight: 500;">
                脫口而出的口頭禪與社群迷因，究竟反映並維繫了什麼樣的性別權力關係？
              </div>
            </div>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【郭泓佑提示】</strong>「蔡老師、各位同學好，我們是第 3 組。這次專題由我們全組 10 位組員共同研討完成，文獻考證、時事語料蒐集與法規爬梳由峻毅、昕澤、沂絃、展頡與傑尹負責，簡報由季頫統整視覺架構，今天由我、博閎、亨澤與品昊 4 位代表上台主講分享。我們讀《臺灣性別100+問》時發現一個很有感的現象：大家平時講話、滑手機發廢文，常覺得『只是嘴砲、好玩而已』。但很多說話習慣，其實已經把性別框架講成了理所當然。今天我們就從大家每天聽到的日常對話聊起。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 2: 團隊陣容與專案分工 ==================== -->
<section class="presentation-slide concept" id="slide-2" data-chapter="pin" data-shape="clarity">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">02</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">團隊陣容與專案分工 ｜ 全組 10 人精準配置</span>
      </div>
      <h2 class="slide-title">全體 10 位組員研究配置與報告藍圖</h2>
      <p class="slide-subtitle">結合文獻研析、習俗考證、網路田野與法規爬梳，全組協同協作</p>

      <div class="team-roster-layout">
        <!-- 上層：4 位口頭主講代表 (Featured 4 Speakers) -->
        <div class="speakers-quad-row">
          <div class="speaker-quad-item">
            <div class="speaker-quad-badge">#01 🎙️ SPEAKER 1</div>
            <div class="speaker-quad-name">郭泓佑</div>
            <div class="speaker-quad-role"><strong>主講章節（P.01–P.03）：</strong>導讀開場、全組分工、父權體制盲點與前情回顧（Allan Johnson 體制結構與婚俗法規）。</div>
          </div>

          <div class="speaker-quad-item forest">
            <div class="speaker-quad-badge forest">#02 🎙️ SPEAKER 2</div>
            <div class="speaker-quad-name">林博閎</div>
            <div class="speaker-quad-role"><strong>主講章節（P.04–P.05）：</strong>破除生理決定論（Julia Wood 雙性化溝通）、日常三字經髒話與器官污名批判。</div>
          </div>

          <div class="speaker-quad-item slate">
            <div class="speaker-quad-badge slate">#03 🎙️ SPEAKER 3</div>
            <div class="speaker-quad-name">林亨澤</div>
            <div class="speaker-quad-role"><strong>主講章節（P.06–P.08）：</strong>網路論壇標籤與寒蟬效應、從吃豆腐到性騷擾的命名賦權、私密影像刑法正名。</div>
          </div>

          <div class="speaker-quad-item amber">
            <div class="speaker-quad-badge amber">#04 🎙️ SPEAKER 4</div>
            <div class="speaker-quad-name">陳品昊</div>
            <div class="speaker-quad-role"><strong>主講章節（P.09–P.12）：</strong>男性同儕「幹話文化」與恐同焦慮、主持現場三大互動思辨題、話語即權力總結與謝幕。</div>
          </div>
        </div>

        <!-- 下層：6 位研究與製作專責組員 (Design & Research Specialists) -->
        <div class="research-roster-strip">
          <div class="research-member-cell">
            <div class="research-tag">#01 報告簡報製作</div>
            <div class="research-name">林季頫</div>
            <div class="research-desc">簡報架構製作與視覺排版，統整全體 10 位組員研究成果。</div>
          </div>

          <div class="research-member-cell">
            <div class="research-tag">#02 文獻研讀</div>
            <div class="research-name">廖峻毅</div>
            <div class="research-desc">文獻研析與架構梳理，爬梳 Allan Johnson 社會學論述。</div>
          </div>

          <div class="research-member-cell">
            <div class="research-tag">#03 專案研討</div>
            <div class="research-name">李昕澤</div>
            <div class="research-desc">核心論述整合與資料考據，協調章節主題銜接。</div>
          </div>

          <div class="research-member-cell">
            <div class="research-tag">#04 文化考證</div>
            <div class="research-name">江沂絃</div>
            <div class="research-desc">習俗儀式象徵分析，考證丟扇、踩瓦寓意。</div>
          </div>

          <div class="research-member-cell">
            <div class="research-tag">#05 法規爬梳</div>
            <div class="research-name">林展頡</div>
            <div class="research-desc">法制演進爬梳，對照性別平等與司法判決。</div>
          </div>

          <div class="research-member-cell">
            <div class="research-tag">#06 提問綜理</div>
            <div class="research-name">鄭傑尹</div>
            <div class="research-desc">性別盲點與結語收束，統整平權落實方向。</div>
          </div>
        </div>
      </div>

      <div class="team-summary-strip">
        <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta);">
          🟠 4 位口頭主講代表：郭泓佑 ｜ 林博閎 ｜ 林亨澤 ｜ 陳品昊
        </span>
        <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-ink-muted);">
          ⚪ 1 位報告簡報製作：林季頫
        </span>
        <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-ink-muted);">
          ⚪ 5 位專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹
        </span>
        <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-ink-light); margin-left: auto;">
          蔡孟哲 教授 指導 ｜ 國立高雄師範大學
        </span>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【郭泓佑提示】</strong>「我們第 3 組採取嚴謹的專案分工，全組 10 位組員全員到位：簡報由季頫統整視覺架構排版，研究統整由峻毅、昕澤、沂絃、展頡與傑尹深究田野資料。上台部分由 4 位組員分工接力：我先負責第 1 至 3 頁的前情導讀與體制拆解；接著博閎主講第 4 至 5 頁的溝通生理迷思與日常髒話批判；亨澤主講第 6 至 8 頁的網路標籤雙標與法律命名正名歷史；最後由品昊主講第 9 至 12 頁的男性幹話文化剖析、主持現場同學互動並作平權結語。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 3: 體制盲點與前情回顧 ==================== -->
<section class="presentation-slide needs" id="slide-3" data-chapter="pin" data-shape="musicalDna">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">03</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">體制盲點與前情回顧 ｜ CH1 & CH2 精華串聯</span>
      </div>
      <h2 class="slide-title">體制盲點：語言背後是結構的投射</h2>
      <p class="slide-subtitle">日常話語並非孤立存在，脫口而出的偏見常是深層體制與傳統習俗的延伸</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            CH1 體制結構 ｜ Allan Johnson 父權體制特徵
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0 0 14px 0; color: var(--color-ink);">
            父權體制四大特徵
          </h3>
          <ul class="editorial-list" style="gap: 12px;">
            <li><strong>男性支配 (Male-Dominated)：</strong>政治、經濟與重要決策權力長年集中在男性手中。</li>
            <li><strong>認同男性 (Male-Identified)：</strong>文化核心把果斷、理性等陽剛特質預設為唯一標準。</li>
            <li><strong>以男性為中心 (Male-Centered)：</strong>歷史敘事與焦點圍繞男性經驗，女性視角常淪為陪襯。</li>
            <li><strong>由男性控制 (Obsession with Control)：</strong>高度強調支配感，包含對他人、情感與弱勢群體的控制。</li>
          </ul>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 16px; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 6px;">
              CH2 習俗規範 ｜ 婚俗中的文化暴力
            </div>
            <p style="font-size: 0.92rem; line-height: 1.62; color: var(--color-ink-muted); margin: 0;">
              <strong>丟扇子、踩瓦片、跨火爐、潑水出嫁：</strong>表面是祈求吉利與除煞，深層卻將出嫁女性象徵化為「帶有壞脾氣與晦氣的外人」，並在儀式中切斷她與原生家庭的平權連結。
            </p>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-slate); letter-spacing: 0.08em; margin-bottom: 6px;">
              法制演進 ｜ 體制框架的鬆動與限制
            </div>
            <p style="font-size: 0.92rem; line-height: 1.62; color: var(--color-ink-muted); margin: 0;">
              <strong>從母姓與身分認同：</strong>民法雖已修法允許子女從母姓，但實務上登記從母姓的比例仍只有約 5%；2022 年憲判字第 4 號宣告「原住民身分綁漢人父姓」違憲。法律在前進，但父系宗族約束力依然強固。
            </p>
          </div>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: 1.15rem; font-family: var(--font-ui); font-weight: 600;">
          制度不是只寫在法條裡：從社會結構（男性支配、認同男性）、傳統習俗（踩瓦片視女性為外人），到日常說話習慣，父權邏輯是一步步內化成生活直覺的。
        </div>
        <div class="monument-author">階梯進程：體制結構 (Ch1) ➔ 習俗規範 (Ch2) ➔ 語言日常 (Ch3)</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【郭泓佑提示】</strong>「在進入第三章語言討論之前，我們先把前兩章的概念串起來。我們每天講的話不是憑空出現的，它是背後體制與傳統習俗的投射。社會學家 Allan Johnson 指出，父權體制有四個核心特徵：男性支配、認同男性、以男性為中心與渴望控制；而第二章提到的丟扇子、踩瓦片，表面是討喜氣，實際上把出嫁女性當成帶晦氣的外人。就連民法修法允許從母姓，至今也只有約 5% 的人登記從母姓。有了這層結構概念，我們就能看清日常語言是怎麼替這些舊觀念護航的。接下來把麥克風交給博閎，為大家拆解男女溝通風格與髒話背後的階序。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 4: 破除刻板印象 (男女溝通真的不同星球嗎？) ==================== -->
<section class="presentation-slide science" id="slide-4" data-chapter="pin" data-shape="cymatics">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">04</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q1 ｜ 破除刻板印象與生理決定論</span>
      </div>
      <h2 class="slide-title">破除刻板印象：男女溝通真的不同星球嗎？</h2>
      <p class="slide-subtitle">質疑生理宿命論，拒絕溝通怠惰，邁向同理與果斷並存的雙性化溝通</p>

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
              JULIA WOOD 社會化理論
            </div>
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; margin: 0 0 8px 0; color: var(--color-ink);">童年遊戲形塑說話風格</h4>
            <ul class="editorial-list" style="gap: 10px;">
              <li><strong>男童群體（競爭型遊戲）：</strong>常玩球類、競賽，重視輸贏與規則階層，練出以傳遞資訊為主的「報告型風格 (Report Talk)」。</li>
              <li><strong>女童群體（關係型遊戲）：</strong>常玩扮家家酒、聊天，重視輪流、感受與同理，練出以建立連結為主的「關係連網型風格 (Rapport Talk)」。</li>
            </ul>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 6px;">
              平權實踐 ｜ 突破二元標籤
            </div>
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; margin: 0 0 8px 0; color: var(--color-ink);">雙性化溝通 (Androgynous Communication)</h4>
            <p style="font-size: 0.92rem; line-height: 1.6; color: var(--color-ink-muted); margin: 0;">
              跳脫「男要果斷、女要溫柔」的框架。該劃清界線時把話講清楚，該同理時好好聽對方說，兩者都是後天可以學會的對話能力，不是天生性格。
            </p>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林博閎提示】</strong>「蔡老師、各位同學好，我是博閎。很多人常拿《男人來自火星，女人來自金星》來解釋男女吵架，說『男生天生理性、女生天生感性，本來就講不通』。但學者 Julia Wood 與現代腦科學告訴我們：大腦有很強的可塑性，同一個性別內部的個人差異，其實比男女平均差大得多。講話方式大多是小時候玩遊戲被教出來的：男生玩比勝負的遊戲，學會講究輸贏的報告型說話；女生店家家酒，學會照顧感受的關係型說話。這都是後天技能。追求雙性化溝通，就是既能溫暖傾聽、又能堅定表達，任何人都可以練習。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 5: 辱罵語的性別階序 ==================== -->
<section class="presentation-slide testimonials" id="slide-5" data-chapter="pin" data-shape="waveform">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">05</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q2 (上) ｜ 語言辱罵階序剖析</span>
      </div>
      <h2 class="slide-title">辱罵語的性別階序：為什麼髒話總在「問候」女性？</h2>
      <p class="slide-subtitle">解構日常髒話背後對女性身體器官的污名，以及傳統父權交換體系中的財產附庸性</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num">01</span>
            <span class="col-tag">身體器官污名化</span>
          </div>
          <h3 class="col-title">器官符號的非對稱降格</h3>
          <ul class="editorial-list">
            <li><strong>精準鎖定：</strong>日常辱罵用詞絕大多數直接指向女性生殖器官與性徵。</li>
            <li><strong>降格為羞辱工具：</strong>將女性身體特徵等同於骯髒、下流、可隨意踐踏的字眼。</li>
            <li><strong>雙標象徵：</strong>男性生殖詞彙常被挪用為強大象徵（如「很屌」），女性詞彙則為侮辱。</li>
            <li><strong>語言物化：</strong>透過語言攻擊，將特定性別的尊嚴降格為排泄與發洩對象。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num forest">02</span>
            <span class="col-tag">父權交換體系</span>
          </div>
          <h3 class="col-title">歷史財產附庸性</h3>
          <ul class="editorial-list">
            <li><strong>名譽綁定：</strong>傳統父系宗族體系曾將女性視為屬於男性的從屬與家族名譽。</li>
            <li><strong>羞辱母姊的本質：</strong>宣稱玷污對方的母親或姐妹，藉以重擊該男性的陽剛自尊。</li>
            <li><strong>私有財產爭奪：</strong>問候對方的女性親屬，本質是男人向另一個男人挑釁私有財產。</li>
            <li><strong>女性主體被消音：</strong>在男性的口頭決鬥中，女性只是毫無主體性的受害符號。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num slate">03</span>
            <span class="col-tag">習慣性遮蔽</span>
          </div>
          <h3 class="col-title">隱形暴力的日常化</h3>
          <ul class="editorial-list">
            <li><strong>口頭禪脫罪：</strong>說話者常以「只是習慣發洩、沒有惡意」來合理化脫口而出。</li>
            <li><strong>權力秩序複製：</strong>每一次無意識的使用，都在反覆強化男尊女卑的語言環境。</li>
            <li><strong>同儕認同測試：</strong>在部分男性圈子裡，講粗口甚至成了證明男子氣概的通行證。</li>
            <li><strong>批判性覺察：</strong>停止把壓迫性詞彙當成理所當然的日常背景音。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: clamp(1.1rem, 1.6vw, 1.35rem); font-family: var(--font-ui); font-weight: 600;">
          日常髒話大多在罵女性器官和媽媽，不是巧合。在傳統宗族體系裡，攻擊一個男人的女性親屬，本來就是最快打擊他尊言的方式。
        </div>
        <div class="monument-author">從表層洩憤到深層權力階序</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林博閎提示】</strong>「接下來我們看日常口頭禪。大家有沒有想過：為什麼我們聽到的三字經、五字經，幾乎都在問候別人的媽媽或女性生殖器，很少聽到有人問候爸爸？社會學分析指出：在過去宗族社會裡，女性曾被視為男人的附屬品和家族名譽；當一個男人要徹底羞辱另一個男人，最快的方式就是羞辱對方的母親或姊妹。當我們平時把這些話當作口頭禪時，我們其實是在無意識地替這套歧視結構背書。下一段網路文化與概念正名，交給亨澤繼續說明。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 6: 數位性別暴力 ==================== -->
<section class="presentation-slide faq" id="slide-6" data-chapter="pin" data-shape="freeFlow">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">06</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q2 (下) ｜ 數位性別暴力與網路文化</span>
      </div>
      <h2 class="slide-title">數位性別暴力：網路流行語只是「開玩笑」？</h2>
      <p class="slide-subtitle">匿名看板上的標籤化獵巫、雙重標準，以及被嚴重忽視的真實寒蟬效應</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            標籤化現象 ｜ 論壇常見流行語
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
            <div style="border-left: 2.5px solid var(--color-accent-terracotta); padding-left: 14px;">
              <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; color: var(--color-ink);">「台女」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.55;">從客觀地域稱謂，變質為眼高手低、拜金自私的貶抑標籤。</div>
            </div>
            <div style="border-left: 2.5px solid var(--color-ink); padding-left: 14px;">
              <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; color: var(--color-ink);">「母豬、女拳、三寶、綠茶婊」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.55;">人為劃分好女人與劣等女人，將個別負面事件無限上綱為全體性別原罪。</div>
            </div>
            <div style="border-left: 2.5px solid var(--color-accent-forest); padding-left: 14px;">
              <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; color: var(--color-ink);">「ㄈㄈ尺 (CCr)」</div>
              <div style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.55;">跨文化交往中的性別雙標，極度貶抑女性與外籍人士交往為崇洋賣台。</div>
            </div>
          </div>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="border-bottom: 1px solid var(--color-hairline); padding-bottom: 16px; margin-bottom: 16px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-ink); letter-spacing: 0.08em; margin-bottom: 6px;">
              赤裸的性別雙標
            </div>
            <ul class="editorial-list" style="gap: 8px;">
              <li><strong>經濟追求：</strong>男在乎薪水被讚「務實上進」；女在乎經濟被酸「拜金吸血」。</li>
              <li><strong>情慾探索：</strong>男情史豐富被封「勝利組情聖」；女大方談性被罵「破麻公車」。</li>
              <li><strong>同儕激化：</strong>在推文集體嘲弄弱勢，藉由抱團取暖建構優越感。</li>
            </ul>
          </div>

          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 6px;">
              實質傷害 ｜ 數位寒蟬效應 (Chilling Effect)
            </div>
            <p style="font-size: 0.94rem; line-height: 1.62; color: var(--color-ink); font-weight: 500; margin: 0;">
              女性在論壇表達觀點極易遭人肉搜索與性羞辱，被迫選擇噤聲或隱藏性別。這種網路狂歡不是單純嘴砲，而是正在實質剝奪特定群體在公共論壇的發言權。
            </p>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林亨澤提示】</strong>「蔡老師、各位同學好，我是亨澤。換到網路論壇，這類語言攻擊換了包裝，變成『台女、母豬、女拳、三寶』這些流行詞。大家在推文底下一人一句，常覺得『只是嘴砲好玩』。但標準往往很不一樣：男生在乎薪水被誇上進，女生在乎條件就變拜金。更嚴重的是，很多女生看到這些留言，會直接選擇不發文、不留言，甚至隱藏性別或退出看板。這不是開玩笑，這是在讓特定的聲音慢慢在公共討論裡消失。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 7: 命名即權力 ==================== -->
<section class="presentation-slide services" id="slide-7" data-chapter="pin" data-shape="ripples">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">07</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q3 (上) ｜ 概念賦權與正名歷史</span>
      </div>
      <h2 class="slide-title">命名即權力：從「吃豆腐」到「性騷擾」</h2>
      <p class="slide-subtitle">擁有命名的權力，才能讓隱蔽的受害經驗重見天日；正名歷史就是受害者的平權爭取史</p>

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
          <div class="contrast-term" style="color: var(--color-accent-forest);">「性騷擾 (Sexual Harassment)」</div>
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
          一個行為如果沒有精準的名字，受害者就很難向外求助。當「吃豆腐」被正名為「性騷擾」，模糊的玩笑就變成了法律上有責任歸屬的侵權行為。
        </div>
        <div class="monument-author">權力天平對比：擁有命名權，才能確立保護界線</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【林亨澤提示】</strong>「大家請看這一頁的強烈對比：過去長輩如果被鹹豬手摸一把，只能吞忍說『被吃豆腐』，這個詞把侵犯行為包裝成輕佻的玩笑，受害者甚至會被責怪開不起玩笑。直到 1970 年代女性主義者將它正式命名為『性騷擾』，並推動法律制定，受害者才終於有了合法的武器。這就是社會學講的『命名即賦權』——有了名字，才能把傷害看清楚。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 8: 概念的當代進化 ==================== -->
<section class="presentation-slide contact" id="slide-8" data-chapter="pin" data-shape="orb">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">08</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q3 (下) ｜ 概念當代進化與法制建構</span>
      </div>
      <h2 class="slide-title">概念的當代進化：語言如何推動平權？</h2>
      <p class="slide-subtitle">撕下道德污名標籤，直指侵權本質，建立數位與多元性別的法律防護網</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num">01</span>
            <span class="col-tag">舊名盲點</span>
          </div>
          <h3 class="col-title">「復仇式色情」之弊</h3>
          <ul class="editorial-list">
            <li><strong>誤導焦點：</strong>「復仇」兩字過度聚焦加害者動機，彷彿受害者欠了對方什麼。</li>
            <li><strong>檢討被害人：</strong>「色情」字眼暗示受害者私生活不檢點，帶來嚴重道德審判。</li>
            <li><strong>排除廣泛情境：</strong>無法涵蓋駭客盜取、牟利販售等非報復性質的數位犯罪。</li>
            <li><strong>二次傷害：</strong>讓被害人陷於自責，難以啟齒對外尋求法律求助。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num forest">02</span>
            <span class="col-tag">正名價值</span>
          </div>
          <h3 class="col-title">未經同意散布私密影像</h3>
          <ul class="editorial-list">
            <li><strong>回歸侵權本質：</strong>核心在於「違反知情同意與隱私自主權」，無關私生活道德。</li>
            <li><strong>撕下色情標籤：</strong>明確宣告非自願私密影像不是娛樂，而是嚴重數位性別暴力。</li>
            <li><strong>受害主體免責：</strong>賦予受害者無道德負擔的求助正當性與司法防護。</li>
            <li><strong>延伸：</strong>從「兩性平等」走向「性別平等」，全面納入多元性別與氣質保障。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num slate">03</span>
            <span class="col-tag">刑法正面回應</span>
          </div>
          <h3 class="col-title">台灣刑法實質立法</h3>
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
          <strong>【林亨澤提示】</strong>「我們再看一個當代最重要的例子：過去媒體報導外流私密照，總愛用『復仇式色情』這種聳動字眼。但這個詞隱含了檢討被害人，好像女生有把柄欠別人一樣。現在法律界與社會正名為『未經同意散布私密性影像』，重點在於『未經同意』！台灣刑法也在第 319-3 條正式入罪。另外，從『兩性』拓展到『性別平等』，也是語言進步推動多元保障的實例。語言越精準，法律才能保護得越周全。接下來把時間交給品昊，為大家剖析男性的幹話文化與主持現場思辨討論。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 9: 直男行為學 ==================== -->
<section class="presentation-slide" id="slide-9" data-chapter="pin" data-shape="clarity">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">09</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">CH3 Q4 ｜ 直男行為學與情感防衛</span>
      </div>
      <h2 class="slide-title">直男行為學：為什麼男生只講幹話、不聊心事？</h2>
      <p class="slide-subtitle">解構直男社交中的任務導向、恐同焦慮，以及男子氣概的情感防衛機制</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num">01</span>
            <span class="col-tag">任務導向</span>
          </div>
          <h3 class="col-title">缺乏情感腳本</h3>
          <ul class="editorial-list">
            <li><strong>活動圍繞具體事物：</strong>男性社交大多圍繞打球、打遊戲、比拼輸贏。</li>
            <li><strong>有毒男子氣概制約：</strong>從小被要求「不許示弱、要剛強」，傾訴脆弱常被視為軟弱。</li>
            <li><strong>詞彙匱乏：</strong>成長過程中缺少練習坦露情感的語言環境，習慣壓抑感受。</li>
            <li><strong>情感孤立：</strong>外表看似團結熱鬧，內心卻缺少可以放心示弱的傾訴管道。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num forest">02</span>
            <span class="col-tag">隱形審查</span>
          </div>
          <h3 class="col-title">恐同焦慮 (Homophobia)</h3>
          <ul class="editorial-list">
            <li><strong>同儕性別審查：</strong>男性之間過度細膩的關懷，容易引起同儕質疑性傾向。</li>
            <li><strong>防衛性疏離：</strong>害怕被貼上不夠陽剛的標籤，刻意用粗魯語言拉開情感安全距離。</li>
            <li><strong>陽剛證明儀式：</strong>透過聊黃腔、互嗆、爭強好勝，反覆自我證明異性戀身分。</li>
            <li><strong>深層阻隔：</strong>友誼維持在活動層面，難以觸及真實的生命困境與心理脆弱。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num slate">03</span>
            <span class="col-tag">防禦機制</span>
          </div>
          <h3 class="col-title">幹話的替代性親密</h3>
          <ul class="editorial-list">
            <li><strong>安全防護罩：</strong>透過打嘴砲、互嗆，在低風險中維持兄弟情誼。</li>
            <li><strong>包裝真實關心：</strong>用調侃替代真心話（如用「你怎麼還沒死」來代替關心掛念）。</li>
            <li><strong>避險代價：</strong>既獲得了歸屬感，又不必承擔展露脆弱被嘲笑的風險。</li>
            <li><strong>解方：</strong>父權體制不只限制女性，也剝奪了男性自由表達脆弱的權利。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: clamp(1.1rem, 1.6vw, 1.35rem); font-family: var(--font-ui); font-weight: 600;">
          直男聚在一起互嘴講幹話，往往是為了在「不能示弱」的男子氣概壓力下，維持一種不被同儕嘲笑的安全連結。
        </div>
        <div class="monument-author">解構有毒男子氣概：給男性一個允許哭泣與坦誠的安全空間</div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【陳品昊提示】</strong>「大家好，我是陳品昊。我們身為男生，真的只會打遊戲、講幹話嗎？很多人問：為什麼男生聚在一起不能好好聊心事？社會學點出關鍵在於『恐同焦慮』與『男子氣概壓力』。在男生圈子裡，認真聊情緒很容易被同儕笑說很娘、很甲；所以大家發明了『幹話互虧』作為替代性親密。表面上很熱絡，其實是在逃避真實的脆弱。父權體制不只壓迫女性，也同樣剝奪了男性示弱與好好表達感受的權利。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 10: 課堂交流與現場思辨 ==================== -->
<section class="presentation-slide" id="slide-10" data-chapter="pin" data-shape="cymatics">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">10</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">課堂交流與現場思辨 ｜ 換你答 Interactive Discussion</span>
      </div>
      <h2 class="slide-title">課堂交流與現場思辨：換你答！</h2>
      <p class="slide-subtitle">三個貼近日常生活的開放思考題，預留 3–5 分鐘邀請蔡孟哲教授與全班同學共同對話</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num">01</span>
            <span class="col-tag">校園現場</span>
          </div>
          <h3 class="col-title" style="font-size: 1.22rem; line-height: 1.45;">
            在大學分組或社團幹部中，主動爭取發言與領導的通常是男生還是女生？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：我們對男女發言風格有什麼不同的評價？是否仍存在「男有魄力、女強勢挑剔」的刻板標籤？
          </p>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num forest">02</span>
            <span class="col-tag">婚俗與家庭</span>
          </div>
          <h3 class="col-title" style="font-size: 1.22rem; line-height: 1.45;">
            如果未來你（或好友）結婚，會堅持拿掉哪些傳統儀式？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：丟扇、踩瓦、潑水、從母姓選擇，以及面對長輩宗族傳統期待時，可以如何開啟跨世代對話？
          </p>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num slate">03</span>
            <span class="col-tag">同儕支持</span>
          </div>
          <h3 class="col-title" style="font-size: 1.22rem; line-height: 1.45;">
            身邊的男性朋友陷入情緒低潮時，除了「走啦喝一杯」，我們還能怎麼陪伴？
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-ink-muted); line-height: 1.6; margin: 0;">
            思考方向：如何卸下男子氣概防衛機制，打造一個允許對方放心示弱、說真心話的非評判環境？
          </p>
        </div>
      </div>

      <div class="monument-statement" style="text-align: center; justify-content: center; align-items: center;">
        <div class="monument-quote" style="font-size: 1.15rem; font-weight: 600;">
          歡迎現場舉手分享您的切身經驗，也可以在課堂留言板即時分享想法
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【陳品昊提示】</strong>「現在由我把麥克風交給全班。這三道題沒有標準答案，但都深深刻在我們的生活裡。第一題是校園分組的發言經驗；第二題是大家對未來婚俗的想像；第三題是我們身為朋友，怎麼讓男生也能放心講心事。請大家花三十秒想想看，等等我們開放兩到三位同學分享您的觀察。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 11: 總結——邁向雙性化的平權未來 ==================== -->
<section class="presentation-slide faq" id="slide-11" data-chapter="pin" data-shape="freeFlow">
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div class="editorial-kicker">
        <span class="kicker-num">11</span>
        <span class="kicker-slash">/</span>
        <span class="kicker-label">總結收束 ｜ 邁向雙性化的平權未來</span>
      </div>
      <h2 class="slide-title">總結：邁向雙性化的平權未來</h2>
      <p class="slide-subtitle">覺察話語隱含的權力，看見體制對所有人的限制，在日常生活中實踐解放</p>

      <div class="editorial-stepper-row">
        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num">01</span>
            <span class="col-tag">日常自覺</span>
          </div>
          <h3 class="col-title">覺察話語習慣</h3>
          <ul class="editorial-list">
            <li><strong>語言非中立：</strong>隨時反思脫口而出的口頭禪與網路流行語背後隱含的權力架構。</li>
            <li><strong>停止日常遮蔽：</strong>不再以「只是開玩笑」替性別辱罵與刻板標籤脫罪。</li>
            <li><strong>用詞精準化：</strong>支持正名，讓隱蔽的受害經驗能被看見與救濟。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num forest">02</span>
            <span class="col-tag">超越對立</span>
          </div>
          <h3 class="col-title">看見結構性束縛</h3>
          <ul class="editorial-list">
            <li><strong>跳脫二元思維：</strong>不把性別議題簡化為男女個人對立，看見結構對所有人的傷害。</li>
            <li><strong>看見雙向限制：</strong>女性承受了身體物化與數位寒蟬；男性則背負著壓抑脆弱的包袱。</li>
            <li><strong>鬆動宗族體制：</strong>在日常生活與儀式中，主動打破父系中心思維。</li>
          </ul>
        </div>

        <div class="editorial-step-col">
          <div class="col-lead">
            <span class="col-num slate">03</span>
            <span class="col-tag">生活實踐</span>
          </div>
          <h3 class="col-title">實踐雙性化溝通</h3>
          <ul class="editorial-list">
            <li><strong>靈活轉換風格：</strong>男性可以坦率溫柔示弱，女性可以果斷捍衛個人界線。</li>
            <li><strong>打造安全空間：</strong>在同儕之間建立允許分享真實感受、互相承接的信任關係。</li>
            <li><strong>生活化落實：</strong>讓溝通回歸真誠互動，人人都能自在做自己。</li>
          </ul>
        </div>
      </div>

      <div class="monument-statement">
        <div class="monument-quote" style="font-size: 1.18rem; font-family: var(--font-ui); font-weight: 600;">
          改變社會不需要驚天動地的大口號：當我們在日常對話中停下來多想一秒，願意用尊重的詞彙說話，我們就已經在鬆動舊有的權力框架。
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【陳品昊提示】</strong>「最後為大家總結我們第 3 組今天的報告核心：話語就是權力。第一，隨時覺察自己脫口而出的詞彙；第二，跳脫男女對立，看見父權體制對所有人的限制——女性受到身體物化和寒蟬效應，男性則被剝奪了哭泣和示弱的自由；第三，練習雙性化溝通，該堅定時把界線劃清楚，該同理時好好聽對方說話。平權不是口號，就從我們平時怎麼跟身邊的人講話開始。」
        </div>
      </details>
    </div>
  </div>
</section>

<!-- ==================== SLIDE 12: 參考文獻與致謝 ==================== -->
<section class="presentation-slide faq" id="slide-12" data-chapter="pin" data-shape="ripples" data-video="./assets/nailong-pingpong-720p.mp4?v=20261005_2" data-flow>
  <div class="slide-atmosphere-gradient" aria-hidden="true"></div>
  <div class="container">
    <div class="slide-stage-wrapper">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="editorial-kicker" style="margin-bottom: 0;">
          <span class="kicker-num">12</span>
          <span class="kicker-slash">/</span>
          <span class="kicker-label">專案總結 ｜ 參考文獻與致謝</span>
        </div>
        <button id="slide12-toggle-view" class="caps-small-bold" style="cursor: pointer; background: rgba(42,95,69,0.09); border: 1px solid rgba(42,95,69,0.22); color: var(--color-accent-forest); border-radius: 99px; padding: 4px 14px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
          ✨ 全像視角 (查看純淨 3D 奶龍動畫)
        </button>
      </div>
      <h2 class="slide-title">參考文獻與報告致謝</h2>
      <p class="slide-subtitle">感謝 蔡孟哲 教授 悉心指導 ｜ 第 3 組全體 10 位組員敬上</p>

      <div class="tension-split-row">
        <div class="tension-column">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-terracotta); letter-spacing: 0.08em; margin-bottom: 8px;">
            學術文獻與司法裁判依據
          </div>
          <ul class="editorial-list" style="font-size: 0.88rem; gap: 8px;">
            <li>蔡孟哲教授等（2023）。《臺灣性別100+問》（Ch1 黃長玲、李佩雯；Ch2 姜貞吟；Ch3 李佩雯）。巨流圖書公司。</li>
            <li>Allan G. Johnson（2008）。《見樹又見林：社會學作為一種生活、實踐與承諾》。成令方等譯。群學。</li>
            <li>Julia T. Wood（2011）。《性別化的人生：傳播、性別與文化》。五南。</li>
            <li>司法院憲法法庭 111 年憲判字第 4 號判決（原住民身分與姓氏規範案）。</li>
            <li>中華民國刑法第 319-3 條（未經同意散布性影像罪）。</li>
          </ul>
        </div>

        <div class="tension-column tension-column-bordered">
          <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); letter-spacing: 0.08em; margin-bottom: 8px;">
            報告團隊 10 位組員全名
          </div>
          <div style="font-size: 0.94rem; line-height: 1.7; color: var(--color-ink);">
            <strong>口頭主講代表：</strong>郭泓佑 ｜ 林博閎 ｜ 林亨澤 ｜ 陳品昊<br>
            <strong>報告簡報製作：</strong>林季頫<br>
            <strong>專案研究統整：</strong>廖峻毅 ｜ 李昕澤 ｜ 江沂絃 ｜ 林展頡 ｜ 鄭傑尹
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-hairline); display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--color-ink);">國立高雄師範大學 通識教育中心</div>
              <div style="font-size: 0.82rem; color: var(--color-ink-muted); margin-top: 2px;">《性別與文化》專案報告完畢</div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--color-accent-forest); background: rgba(42,95,69,0.08); padding: 4px 12px; border-radius: 99px;">
              Q & A 提問交流
            </span>
          </div>
        </div>
      </div>

      <details class="speaker-notes-drawer">
        <summary class="notes-summary">🎙️ 講者口語逐字提示 (Speaker Notes)</summary>
        <div class="notes-body" data-speaker-note="true">
          <strong>【全組致謝（由陳品昊結尾）】</strong>「非常感謝蔡孟哲教授的指導與全體同學的聆聽。我們第 3 組全體 10 位組員的報告到這裡告一段落。接下來開放現場 Q&A 提問與老師講評指導，謝謝大家！」
        </div>
      </details>
    </div>
  </div>
  <div class="immersed-hint" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(28,25,23,0.85);color:#fff;padding:8px 20px;border-radius:99px;font-size:0.82rem;backdrop-filter:blur(8px);cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.18);">
    ✨ 點擊任意處或按 ESC 恢復致謝資訊
  </div>
</section>
`;

// 2.5 Clean Preloader Script if preloader element is absent
html = html.replace(/<script type="module" src="\.\/_astro\/Preloader\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');

// 3. Replace <main> Content
const mainRegex = /<main[^>]*id="main"[^>]*>[\s\S]*?<\/main>/;
const match = html.match(mainRegex);
if (match) {
  const openTagMatch = match[0].match(/<main[^>]*id="main"[^>]*>/);
  const openTag = openTagMatch ? openTagMatch[0] : '<main id="main">';
  const newMainContent = `${openTag}\n${slidesHtml}\n</main>`;
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
html = html.replace(/<ul class="pages caps-med-bold"[^>]*>[\s\S]*?<\/ul>/, '');

// 5. Update Header Logo
const oldLogoMatch = html.match(/<a href="[^"]*" class="logo is-header svelte-ciedsx"[\s\S]*?<\/a>/);
if (oldLogoMatch) {
  const newLogo = `<a href="#slide-1" class="logo is-header svelte-ciedsx" data-astro-cid-ywwchgwn="true" style="text-decoration:none;"><span style="font-family:var(--font-heading);font-weight:800;font-size:1.15rem;letter-spacing:0.02em;color:var(--color-ink);">話語即權力</span><span style="font-size:0.75rem;color:var(--color-ink-muted);margin-left:8px;font-weight:600;">第 3 組 ｜ 蔡孟哲 教授 指導</span></a>`;
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

<!-- Clean Bottom Navigation Dock -->
<nav class="slide-dock" id="slide-dock" aria-label="Presentation controls">
  <button class="dock-btn" id="dock-prev-btn" aria-label="上一頁">▲ 前一頁</button>
  <span class="dock-counter" id="dock-counter">01 / 12</span>
  <button class="dock-btn" id="dock-next-btn" aria-label="下一頁">▼ 下一頁</button>
</nav>

<!-- Clean Footer Bar -->
<div class="presentation-footer-bar">
  <span>高師大通識教育《性別與文化》 ｜ 第 3 組全體 10 位組員 ｜ 指導教授：蔡孟哲 教授</span>
</div>

<script>
  (function() {
    document.body.classList.remove('is-preloading');
    document.body.classList.add('is-ready');

    const slides = Array.from(document.querySelectorAll('.presentation-slide'));
    const counter = document.getElementById('dock-counter');
    const prevBtn = document.getElementById('dock-prev-btn');
    const nextBtn = document.getElementById('dock-next-btn');
    const prompterModal = document.getElementById('prompter-modal');
    const prompterClose = document.getElementById('prompter-close-btn');
    const prompterContent = document.getElementById('prompter-content');
    const slide12 = document.getElementById('slide-12');

    let currentIdx = 0;
    let isNavigating = false;
    let navTimer = null;
    window.__presentationControlsVideo = true;

    // Attach videos directly to the DOM to ensure high-priority GPU video decoding pipeline in Chromium
    const videoHost = document.createElement('div');
    videoHost.id = 'presentation-videos-host';
    videoHost.setAttribute('aria-hidden', 'true');
    videoHost.style.cssText = 'position:fixed;bottom:0;right:0;width:160px;height:90px;opacity:0.01;pointer-events:none;z-index:0;overflow:hidden;';

    const videoDancers = document.createElement('video');
    videoDancers.src = './assets/dancers-pingpong-720p.mp4?v=20261005_2';
    videoDancers.muted = true;
    videoDancers.defaultMuted = true;
    videoDancers.loop = true;
    videoDancers.playsInline = true;
    videoDancers.crossOrigin = 'anonymous';
    videoDancers.preload = 'auto';
    videoDancers.setAttribute('muted', '');
    videoDancers.setAttribute('playsinline', '');

    const videoNailong = document.createElement('video');
    videoNailong.src = './assets/nailong-pingpong-720p.mp4?v=20261005_2';
    videoNailong.muted = true;
    videoNailong.defaultMuted = true;
    videoNailong.loop = true;
    videoNailong.playsInline = true;
    videoNailong.crossOrigin = 'anonymous';
    videoNailong.preload = 'auto';
    videoNailong.setAttribute('muted', '');
    videoNailong.setAttribute('playsinline', '');

    videoHost.appendChild(videoDancers);
    videoHost.appendChild(videoNailong);
    document.body.appendChild(videoHost);

    videoDancers.addEventListener('ended', () => {
      videoDancers.currentTime = 0;
      if (currentIdx === 0) videoDancers.play().catch(() => {});
    });
    videoNailong.addEventListener('ended', () => {
      videoNailong.currentTime = 0;
      if (currentIdx === 11) videoNailong.play().catch(() => {});
    });

    videoDancers.addEventListener('canplay', () => {
      if (currentIdx === 0 && videoDancers.paused) videoDancers.play().catch(() => {});
    });
    videoNailong.addEventListener('canplay', () => {
      if (currentIdx === 11 && videoNailong.paused) videoNailong.play().catch(() => {});
    });

    videoDancers.load();
    videoNailong.load();
    // Only play videoDancers initially on Slide 1; videoNailong plays when Slide 12 is reached
    videoDancers.play().catch(() => {});

    function updateActiveState(idx) {
      if (idx < 0 || idx >= slides.length) return;
      const prevIdx = currentIdx;
      currentIdx = idx;
      const direction = idx >= prevIdx ? 1 : -1;

      if (counter) {
        counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      }

      document.querySelectorAll('.header .chapters li').forEach((li, i) => {
        if (i === idx) {
          li.setAttribute('data-active', '');
        } else {
          li.removeAttribute('data-active');
        }
      });

      slides.forEach((s, i) => {
        if (i === idx) {
          s.setAttribute('data-active', '');
          s.style.setProperty('--fade', '1');
        } else {
          s.removeAttribute('data-active');
        }
      });

      if (prompterModal && prompterModal.classList.contains('is-open')) {
        const curSlide = slides[idx];
        if (curSlide) {
          const noteEl = curSlide.querySelector('[data-speaker-note]');
          if (noteEl && prompterContent) {
            prompterContent.innerHTML = noteEl.innerHTML;
          }
        }
      }

      if (window.webglExperience) {
        const shapeProgressMap = [0, 1, 2.5, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const targetProgress = shapeProgressMap[idx] !== undefined ? shapeProgressMap[idx] : idx;

        // 3D 粒子場彈簧物理形狀過渡 (Spring interpolation between 3D particle shapes)
        window.webglExperience.setProgress(targetProgress);

        if (idx === 0) {
          // Slide 1 (第一頁): 雙人舞者人體深度影片粒子 (正放完畢即順暢倒放，循環往復)
          if (!videoNailong.paused) videoNailong.pause();
          if (videoDancers.paused) videoDancers.play().catch(() => {});
          if (typeof window.webglExperience.switchVideo === 'function') {
            window.webglExperience.switchVideo(videoDancers);
          } else if (window.webglExperience.videoLayer) {
            window.webglExperience.videoLayer.video = videoDancers;
            if (window.webglExperience.videoLayer.texture) {
              window.webglExperience.videoLayer.texture.image = videoDancers;
              window.webglExperience.videoLayer.texture.needsUpdate = true;
            }
          }
          if (window.webglExperience.videoLayer && typeof window.webglExperience.videoLayer.setLook === 'function') {
            window.webglExperience.videoLayer.setLook({
              brightness: 1.05,
              highlights: 0.50,
              density: 0.04,
              scale: 1.08,
              motion: 1.0
            });
          }
          if (typeof window.webglExperience.setVideoReveal === 'function') {
            window.webglExperience.setVideoReveal(1.0, direction, false);
          }
        } else if (idx === 11) {
          // Slide 12 (最後一頁): 奶龍 67 影片 (活潑流暢 13s 雙向彈性循環，高解析度清爽全像粒子)
          if (!videoDancers.paused) videoDancers.pause();
          if (videoNailong.paused) videoNailong.play().catch(() => {});
          if (typeof window.webglExperience.switchVideo === 'function') {
            window.webglExperience.switchVideo(videoNailong);
          } else if (window.webglExperience.videoLayer) {
            window.webglExperience.videoLayer.video = videoNailong;
            if (window.webglExperience.videoLayer.texture) {
              window.webglExperience.videoLayer.texture.image = videoNailong;
              window.webglExperience.videoLayer.texture.needsUpdate = true;
            }
          }
          if (window.webglExperience.videoLayer && typeof window.webglExperience.videoLayer.setLook === 'function') {
            window.webglExperience.videoLayer.setLook({
              brightness: 1.15,
              highlights: 0.65,
              density: -0.01,
              scale: 0.82,
              motion: 1.0
            });
          }
          if (typeof window.webglExperience.setVideoReveal === 'function') {
            window.webglExperience.setVideoReveal(1.0, direction, false);
          }
        } else {
          // Slide 2 ~ 11: 純 3D 粒子場（無影片遮罩），深度影片粒子滑順錯位散逸，水墨渦流融入 3D 星雲
          if (!videoDancers.paused) videoDancers.pause();
          if (!videoNailong.paused) videoNailong.pause();
          if (typeof window.webglExperience.setVideoReveal === 'function') {
            window.webglExperience.setVideoReveal(0.0, direction, false);
          }
        }
      }
    }

    function goToSlide(targetIdx) {
      if (targetIdx < 0 || targetIdx >= slides.length) return;
      isNavigating = true;
      clearTimeout(navTimer);
      currentIdx = targetIdx;
      updateActiveState(targetIdx);
      slides[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      navTimer = setTimeout(() => {
        isNavigating = false;
      }, 750);
    }

    const observer = new IntersectionObserver((entries) => {
      if (isNavigating) return;
      let maxRatio = 0;
      let targetIdx = -1;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          targetIdx = slides.indexOf(entry.target);
        }
      });
      if (targetIdx !== -1 && maxRatio >= 0.45 && targetIdx !== currentIdx) {
        updateActiveState(targetIdx);
      }
    }, {
      threshold: [0.2, 0.45, 0.7, 0.9]
    });

    slides.forEach(slide => observer.observe(slide));

    window.addEventListener('scroll', () => {
      if (isNavigating) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const innerH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      if (scrollY + innerH >= docH - 45) {
        if (currentIdx !== slides.length - 1) {
          updateActiveState(slides.length - 1);
        }
      } else if (scrollY <= 45) {
        if (currentIdx !== 0) {
          updateActiveState(0);
        }
      }
    }, { passive: true });

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
          currentIdx = sIdx;
          setTimeout(() => goToSlide(sIdx), 80);
        }
      }
    } else {
      updateActiveState(0);
    }

    let hasInitializedFirstReveal = false;
    function syncWhenReady(attempts = 0) {
      if (window.webglExperience) {
        if (!hasInitializedFirstReveal) {
          hasInitializedFirstReveal = true;
          if (currentIdx === 0) {
            if (typeof window.webglExperience.switchVideo === 'function') {
              window.webglExperience.switchVideo(videoDancers);
            }
            if (videoDancers.paused) videoDancers.play().catch(() => {});
            if (typeof window.webglExperience.setVideoReveal === 'function') {
              window.webglExperience.setVideoReveal(1.0, 1, true);
            }
          } else if (currentIdx === 11) {
            if (typeof window.webglExperience.switchVideo === 'function') {
              window.webglExperience.switchVideo(videoNailong);
            }
            if (videoNailong.paused) videoNailong.play().catch(() => {});
            if (typeof window.webglExperience.setVideoReveal === 'function') {
              window.webglExperience.setVideoReveal(1.0, 1, true);
            }
          }
        }
        updateActiveState(currentIdx);
      } else if (attempts < 50) {
        setTimeout(() => syncWhenReady(attempts + 1), 80);
      }
    }
    syncWhenReady();

    const toggleViewBtn = document.getElementById('slide12-toggle-view');
    const immersedHint = slide12 ? slide12.querySelector('.immersed-hint') : null;
    if (toggleViewBtn && slide12) {
      toggleViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        slide12.classList.toggle('is-immersed');
      });
    }
    if (immersedHint && slide12) {
      immersedHint.addEventListener('click', (e) => {
        e.stopPropagation();
        slide12.classList.remove('is-immersed');
      });
    }
    if (slide12) {
      slide12.addEventListener('click', (e) => {
        if (slide12.classList.contains('is-immersed')) {
          slide12.classList.remove('is-immersed');
        }
      });
    }

    const resumeOnInteraction = () => {
      if (currentIdx === 0 && videoDancers && videoDancers.paused) videoDancers.play().catch(() => {});
      if (currentIdx === 11 && videoNailong && videoNailong.paused) videoNailong.play().catch(() => {});
    };
    ['pointerdown', 'click', 'wheel', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, resumeOnInteraction, { passive: true });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));

    function togglePrompter() {
      if (!prompterModal) return;
      prompterModal.classList.toggle('is-open');
      updateActiveState(currentIdx);
    }

    if (prompterClose && prompterModal) {
      prompterClose.addEventListener('click', () => {
        prompterModal.classList.remove('is-open');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toLowerCase();
      if (key === 'escape' && slide12 && slide12.classList.contains('is-immersed')) {
        slide12.classList.remove('is-immersed');
        return;
      }
      if (['arrowdown', 'arrowright', 'pagedown', ' '].includes(key)) {
        e.preventDefault();
        goToSlide(currentIdx + 1);
      } else if (['arrowup', 'arrowleft', 'pageup'].includes(key)) {
        e.preventDefault();
        goToSlide(currentIdx - 1);
      } else if (key === 'n') {
        e.preventDefault();
        togglePrompter();
      }
    });
  })();
</script>
</body>
</html>
`;

html += '\n' + presenterScript.trim();

// 8. Update Page Title, Head Meta Tags, and strip is-preloading class
const updatedMetaBlock = `<title>話語即權力：日常語言與網路文化中的性別密碼 ｜ 高師大《性別與文化》蔡孟哲教授 指導</title>
<meta name="description" content="國立高雄師範大學通識教育《性別與文化》專案報告。指導教授：蔡孟哲 教授。口頭主講代表：郭泓佑、林博閎、林亨澤、陳品昊；報告簡報製作：林季頫；專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹。全組 10 位組員共同研討製作。">
<meta property="og:title" content="話語即權力：日常語言與網路文化中的性別密碼 ｜ 高師大《性別與文化》專案報告">
<meta name="twitter:title" content="話語即權力：日常語言與網路文化中的性別密碼 ｜ 高師大《性別與文化》專案報告">
<meta property="og:description" content="國立高雄師範大學通識教育《性別與文化》專案報告。指導教授：蔡孟哲 教授。口頭主講代表：郭泓佑、林博閎、林亨澤、陳品昊；報告簡報製作：林季頫；專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹。全組 10 位組員共同研討製作。">
<meta name="twitter:description" content="國立高雄師範大學通識教育《性別與文化》專案報告。指導教授：蔡孟哲 教授。口頭主講代表：郭泓佑、林博閎、林亨澤、陳品昊；報告簡報製作：林季頫；專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹。全組 10 位組員共同研討製作。">
<meta property="og:type" content="website">
<meta property="og:site_name" content="高師大《性別與文化》專案報告">
<meta property="og:locale" content="zh_TW">
<meta property="og:image" content="./images/og-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="報告團隊 10 位組員全名與分工權責一覽：口頭主講代表 郭泓佑、林博閎、林亨澤、陳品昊；簡報製作 林季頫；專案研究統整 廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹">
<meta name="twitter:image" content="./images/og-preview.png">
<meta name="twitter:image:alt" content="報告團隊 10 位組員全名與分工權責一覽：口頭主講代表 郭泓佑、林博閎、林亨澤、陳品昊；簡報製作 林季頫；專案研究統整 廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"PresentationDigitalDocument","name":"話語即權力：日常語言與網路文化中的性別密碼","headline":"話語即權力：日常語言與網路文化中的性別密碼","description":"國立高雄師範大學通識教育《性別與文化》專案報告。指導教授：蔡孟哲 教授。口頭主講代表：郭泓佑、林博閎、林亨澤、陳品昊；報告簡報製作：林季頫；專案研究統整：廖峻毅、李昕澤、江沂絃、林展頡、鄭傑尹。全組 10 位組員共同研討製作。","inLanguage":"zh-TW","image":"./images/og-preview.png","author":{"@type":"Organization","name":"高師大《性別與文化》第 3 組全體 10 位組員"},"educationalLevel":"University"}</script>`;

html = html.replace(/<title>[\s\S]*?<\/script>/, updatedMetaBlock.trim());
html = html.replace(/<body[^>]*class="([^"]*)"/i, (match, classes) => {
  const cleaned = classes.replace(/\bis-preloading\b/g, '').trim();
  return match.replace(classes, cleaned);
});

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully compiled progressive gradient blur presentation with updated preview metadata!');

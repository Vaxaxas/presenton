const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'build_presentation.cjs');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Upgraded CSS for editorial layout
const upgradedStyles = `
  /* ==========================================================================
     EDITORIAL MAGAZINE & BENTO GRID LAYOUT SYSTEM (排版優化升級)
     ========================================================================== */

  /* Typographic Enhancements & Tension */
  .slide-title {
    letter-spacing: -0.025em;
    font-feature-settings: "palt" 1;
    text-wrap: balance;
  }

  .slide-subtitle {
    letter-spacing: -0.01em;
    text-wrap: pretty;
  }

  /* Bento Grid Foundations */
  .bento-grid {
    display: grid;
    gap: clamp(14px, 1.8vw, 24px);
    width: 100%;
    margin-top: 12px;
  }

  .bento-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bento-grid-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bento-grid-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .bento-grid-asym-1-2 {
    grid-template-columns: 1fr 1.6fr;
  }

  .bento-grid-asym-2-1 {
    grid-template-columns: 1.55fr 1fr;
  }

  .bento-grid-asym-3-2 {
    grid-template-columns: 1.35fr 1fr;
  }

  @media (max-width: 960px) {
    .bento-grid-2,
    .bento-grid-3,
    .bento-grid-4,
    .bento-grid-asym-1-2,
    .bento-grid-asym-2-1,
    .bento-grid-asym-3-2 {
      grid-template-columns: 1fr;
    }
  }

  .bento-card {
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid var(--color-hairline);
    border-radius: 10px;
    padding: clamp(18px, 2.2vw, 26px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .bento-card:hover {
    border-color: rgba(28, 25, 23, 0.28);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -10px rgba(28, 25, 23, 0.08);
  }

  .bento-card.accent-terracotta {
    border-left: 3.5px solid var(--color-accent-terracotta);
    background: linear-gradient(135deg, rgba(154, 52, 18, 0.035) 0%, rgba(255, 255, 255, 0.75) 100%);
  }

  .bento-card.accent-forest {
    border-left: 3.5px solid var(--color-accent-forest);
    background: linear-gradient(135deg, rgba(42, 95, 69, 0.035) 0%, rgba(255, 255, 255, 0.75) 100%);
  }

  .bento-card.accent-slate {
    border-left: 3.5px solid var(--color-accent-slate);
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.035) 0%, rgba(255, 255, 255, 0.75) 100%);
  }

  .bento-card.hero-dark {
    background: linear-gradient(145deg, #1C1917 0%, #292524 100%);
    color: #F7F4F0;
    border-color: rgba(255, 255, 255, 0.12);
  }

  .bento-card.hero-dark .bento-tag {
    color: #FBBF24;
  }

  .bento-card.hero-dark .bento-title {
    color: #FFFFFF;
  }

  .bento-card.hero-dark p {
    color: rgba(247, 244, 240, 0.85);
  }

  .bento-tag {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .bento-title {
    font-size: clamp(1.15rem, 1.6vw, 1.45rem);
    font-weight: 800;
    line-height: 1.32;
    color: var(--color-ink);
    margin: 0 0 12px 0;
  }

  .bento-meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 0.74rem;
    font-weight: 600;
    font-family: var(--font-mono);
    background: rgba(28, 25, 23, 0.05);
    color: var(--color-ink-muted);
    border: 1px solid var(--color-hairline);
  }

  /* Giant Stat Callout Card (5%、319-3、4 大特徵) */
  .stat-callout-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(20px, 2.5vw, 30px);
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid var(--color-hairline);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .stat-callout-number-wrap {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 6px;
  }

  .stat-callout-number {
    font-family: var(--font-mono);
    font-size: clamp(2.8rem, 4.8vw, 4.5rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--color-accent-terracotta);
  }

  .stat-callout-unit {
    font-family: var(--font-heading);
    font-size: clamp(1.1rem, 1.6vw, 1.4rem);
    font-weight: 700;
    color: var(--color-ink);
  }

  .stat-callout-label {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--color-ink);
    margin-bottom: 6px;
  }

  .stat-callout-desc {
    font-size: 0.88rem;
    line-height: 1.62;
    color: var(--color-ink-muted);
    margin: 0;
  }

  /* 2x2 Matrix Grid (Allan Johnson 4 特徵) */
  .matrix-2x2-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .matrix-cell {
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid var(--color-hairline);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
  }

  .matrix-cell:hover {
    border-color: var(--color-ink);
    background: rgba(255, 255, 255, 0.95);
  }

  .matrix-cell-badge {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--color-accent-terracotta);
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .matrix-cell-title {
    font-size: 0.98rem;
    font-weight: 800;
    color: var(--color-ink);
    margin-bottom: 4px;
  }

  .matrix-cell-desc {
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--color-ink-muted);
    margin: 0;
  }

  /* PTT / Dcard Forum Mockup (第 6 頁 數位性別暴力專屬) */
  .forum-mockup-wrapper {
    background: #0f141c;
    border-radius: 10px;
    padding: 16px;
    color: #e2e8f0;
    font-family: var(--font-mono), Consolas, monospace;
    font-size: 0.84rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
  }

  .forum-mockup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 10px;
    margin-bottom: 12px;
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .forum-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
    line-height: 1.5;
  }

  .forum-push-tag {
    font-weight: 800;
    font-size: 0.82rem;
    padding: 1px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .forum-push-tag.push {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.12);
  }

  .forum-push-tag.boo {
    color: #f87171;
    background: rgba(248, 113, 113, 0.15);
  }

  .forum-push-tag.arrow {
    color: #cbd5e1;
    background: rgba(203, 213, 225, 0.1);
  }

  .forum-user {
    color: #60a5fa;
    font-weight: 700;
    flex-shrink: 0;
  }

  .forum-content {
    color: #f1f5f9;
    flex-grow: 1;
  }

  .forum-contrast-flag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 700;
    margin-left: 6px;
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.35);
  }

  /* Contrast Evolution Board (第 7 頁吃豆腐 vs 性騷擾、第 8 頁法律正名) */
  .contrast-evolution-board {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    width: 100%;
    margin-top: 10px;
  }

  .evolution-card-before {
    background: rgba(28, 25, 23, 0.03);
    border: 1.5px solid rgba(28, 25, 23, 0.15);
    border-radius: 10px;
    padding: 22px;
    display: flex;
    flex-direction: column;
  }

  .evolution-card-after {
    background: rgba(42, 95, 69, 0.04);
    border: 1.5px solid var(--color-accent-forest);
    border-radius: 10px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 24px -8px rgba(42, 95, 69, 0.12);
  }

  .evolution-badge {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .evolution-term-strike {
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 800;
    color: var(--color-ink-muted);
    text-decoration: line-through;
    text-decoration-color: var(--color-accent-terracotta);
    text-decoration-thickness: 2.5px;
    margin-bottom: 12px;
  }

  .evolution-term-empower {
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 900;
    color: var(--color-accent-forest);
    margin-bottom: 12px;
  }

  /* Psychological Dimension Contrast Dialogue (第 9 頁 直男行為學) */
  .dialogue-theater-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--color-hairline);
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 10px;
  }

  .dialogue-bubble-surface {
    background: rgba(28, 25, 23, 0.04);
    border-left: 3px solid var(--color-ink-muted);
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .dialogue-bubble-inner {
    background: rgba(42, 95, 69, 0.06);
    border-left: 3px solid var(--color-accent-forest);
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    font-size: 0.92rem;
    line-height: 1.5;
  }

  /* Interactive Discussion 3 Cards (第 10 頁 換你答) */
  .discussion-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
    margin-top: 12px;
  }

  .discussion-card {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid var(--color-hairline);
    border-radius: 12px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px -6px rgba(28, 25, 23, 0.05);
  }

  .discussion-card:hover {
    border-color: var(--color-ink);
    transform: translateY(-3px);
    box-shadow: 0 12px 28px -8px rgba(28, 25, 23, 0.12);
  }

  .discussion-giant-num {
    font-family: var(--font-mono);
    font-size: clamp(2.2rem, 3.2vw, 3rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 10px;
  }

  .discussion-question-title {
    font-size: 1.12rem;
    font-weight: 800;
    line-height: 1.45;
    color: var(--color-ink);
    margin-bottom: 12px;
  }

  .discussion-guide-box {
    background: rgba(28, 25, 23, 0.035);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 0.84rem;
    line-height: 1.55;
    color: var(--color-ink-muted);
  }

  /* 3 Pillars Infographic (第 11 頁 總結收束) */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    width: 100%;
    margin-top: 14px;
  }

  .pillar-card {
    background: rgba(255, 255, 255, 0.82);
    border-top: 3.5px solid var(--color-ink);
    border-left: 1px solid var(--color-hairline);
    border-right: 1px solid var(--color-hairline);
    border-bottom: 1px solid var(--color-hairline);
    border-radius: 0 0 10px 10px;
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
  }

  .pillar-card.pillar-terracotta {
    border-top-color: var(--color-accent-terracotta);
  }

  .pillar-card.pillar-forest {
    border-top-color: var(--color-accent-forest);
  }

  .pillar-card.pillar-slate {
    border-top-color: var(--color-accent-slate);
  }

  .pillar-number {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .pillar-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-ink);
    margin-bottom: 12px;
  }

  /* Speaker Spotlight (第 2 頁 10人分工) */
  .speaker-spotlight-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    width: 100%;
    margin-bottom: 14px;
  }

  .speaker-spotlight-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1.5px solid var(--color-hairline);
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
  }

  .speaker-spotlight-card.speaker-terracotta {
    border-color: var(--color-accent-terracotta);
    background: linear-gradient(135deg, rgba(154, 52, 18, 0.05) 0%, rgba(255,255,255,0.92) 100%);
  }

  .speaker-spotlight-card.speaker-forest {
    border-color: var(--color-accent-forest);
    background: linear-gradient(135deg, rgba(42, 95, 69, 0.05) 0%, rgba(255,255,255,0.92) 100%);
  }

  .speaker-spotlight-card.speaker-slate {
    border-color: var(--color-accent-slate);
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(255,255,255,0.92) 100%);
  }

  .researcher-chips-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .researcher-chips-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .researcher-chips-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .researcher-chip-card {
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid var(--color-hairline);
    border-radius: 6px;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    font-size: 0.78rem;
  }

  .researcher-chip-badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--color-ink-light);
    margin-bottom: 2px;
  }

  .researcher-chip-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--color-ink);
    margin-bottom: 3px;
  }

  .researcher-chip-role {
    font-size: 0.72rem;
    line-height: 1.35;
    color: var(--color-ink-muted);
  }
`;

// Inject into presentationStyles
if (content.includes('/* ==========================================================================')) {
  console.log('Styles already exist or need clean update');
}

// Write the upgrade tool
console.log('Upgrade helper prepared successfully.');

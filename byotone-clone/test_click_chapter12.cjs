const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  console.log('1. Page loaded, clicking chapter 12 link...');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[11];
    link.click();
  });

  // Wait 1 second for smooth scroll
  await page.waitForTimeout(1200);

  const state = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.presentation-slide'));
    const activeIdx = slides.findIndex(s => s.hasAttribute('data-active'));
    const vl = window.webglExperience?.videoLayer;
    return {
      activeIdx,
      slide12Active: slides[11]?.hasAttribute('data-active'),
      videoLayerSrc: vl?.video?.src,
      videoNailongPaused: vl?.video?.paused,
      videoCurrentTime: vl?.video?.currentTime,
      videoReveal: window.webglExperience?.videoReveal,
      targetReveal: vl?.target,
      currentReveal: vl?.reveal,
      videoAspect: vl?.videoAspect,
      meshVisible: window.webglExperience?.scene?.mesh?.visible
    };
  });
  console.log('State after clicking chapter 12:', state);

  // Take screenshot of Slide 12!
  await page.screenshot({ path: 'sanity/clicked_ch12_screen.png' });
  console.log('Saved sanity/clicked_ch12_screen.png');

  await browser.close();
})();

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Loading http://localhost:4321/ ...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Slide 1
  const s1 = await page.evaluate(() => {
    const v = window.webglExperience?.videoLayer?.video;
    return {
      src: v?.src,
      paused: v?.paused,
      currentTime: v?.currentTime,
      reveal: window.webglExperience?.videoReveal
    };
  });
  console.log('Slide 1 state:', s1);

  // Simulate user scrolling smoothly all the way down to slide 12
  console.log('2. Scrolling down to Slide 12...');
  for (let i = 0; i < 11; i++) {
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1500);

  // Check Slide 12 immediate state
  const s12Init = await page.evaluate(() => {
    const exp = window.webglExperience;
    const vl = exp?.videoLayer;
    const v = vl?.video;
    const s12El = document.getElementById('slide-12');
    return {
      currentIdx: Array.from(document.querySelectorAll('.slide-stage')).findIndex(s => s.hasAttribute('data-active')),
      slide12Active: s12El?.hasAttribute('data-active'),
      videoSrc: v?.src,
      paused: v?.paused,
      currentTime: v?.currentTime,
      readyState: v?.readyState,
      videoReveal: exp?.videoReveal,
      targetReveal: vl?.target,
      currentReveal: vl?.reveal,
      frameReady: vl?.frameReady,
      lastVideoTime: vl?.lastVideoTime
    };
  });
  console.log('Slide 12 initial state after scroll:', s12Init);

  // Capture 6 sequential frames at 500ms intervals to see if it animates or freezes
  console.log('3. Sampling Slide 12 frames...');
  const frames = [];
  for (let t = 0; t < 6; t++) {
    await page.waitForTimeout(500);
    const state = await page.evaluate(() => {
      const vl = window.webglExperience?.videoLayer;
      const v = vl?.video;
      return {
        currentTime: v?.currentTime,
        paused: v?.paused,
        reveal: vl?.reveal,
        readyState: v?.readyState,
        textureNeedsUpdate: vl?.texture?.needsUpdate
      };
    });
    const shot = await page.screenshot();
    frames.push({ t, state, shot });
    console.log(`Sample ${t}:`, state);
  }

  // Check if frames actually changed
  for (let t = 1; t < frames.length; t++) {
    const same = frames[t].shot.equals(frames[t - 1].shot);
    console.log(`Frame diff ${t - 1} vs ${t}: identical = ${same}`);
  }

  await browser.close();
})();

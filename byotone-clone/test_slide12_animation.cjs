const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4321/#slide-12');
  await page.waitForTimeout(2000);

  const frames = [];
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      const v = window.webglExperience?.videoLayer?.video;
      return {
        src: v?.src,
        paused: v?.paused,
        currentTime: v?.currentTime,
        reveal: window.webglExperience?.videoLayer?.reveal,
        target: window.webglExperience?.videoLayer?.target,
        videoAspect: window.webglExperience?.videoLayer?.videoAspect,
        columns: window.webglExperience?.videoLayer?.columns,
        rows: window.webglExperience?.videoLayer?.rows,
        frameReady: window.webglExperience?.videoLayer?.frameReady,
        hasFrameCallback: window.webglExperience?.videoLayer?.hasFrameCallback,
        textureUpdated: window.webglExperience?.videoLayer?.texture?.needsUpdate
      };
    });
    const buf = await page.screenshot();
    frames.push({ info, size: buf.length, buf });
    console.log(`Frame ${i}: currentTime=${info.currentTime}, paused=${info.paused}, reveal=${info.reveal}`);
  }

  // Compare buffers to check if pixels changed
  for (let i = 1; i < frames.length; i++) {
    const diff = frames[i].buf.equals(frames[i - 1].buf);
    console.log(`Diff Frame ${i - 1} vs ${i}: identical=${diff}`);
  }

  await browser.close();
})();

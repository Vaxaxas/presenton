const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click Chapter 12
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[11].click();
  });
  await page.waitForTimeout(1500);

  for (let i = 0; i < 4; i++) {
    const t = i * 2;
    await page.waitForTimeout(2000);
    const info = await page.evaluate(() => {
      const vl = window.webglExperience?.videoLayer;
      const v = vl?.video;
      return {
        videoSrc: v?.src,
        currentTime: v?.currentTime,
        paused: v?.paused,
        reveal: vl?.reveal,
        lastVideoTime: vl?.lastVideoTime,
        textureUpdated: vl?.texture?.needsUpdate
      };
    });
    console.log(`Step ${i}:`, info);
    await page.screenshot({ path: `sanity/seq_s12_${i}.png` });
  }

  await browser.close();
})();

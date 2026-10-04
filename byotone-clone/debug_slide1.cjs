const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4321/#slide-1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const exp = window.webglExperience;
    const v = exp?.videoLayer?.video;
    return {
      src: v?.src,
      paused: v?.paused,
      currentTime: v?.currentTime,
      duration: v?.duration,
      readyState: v?.readyState,
      videoReveal: exp?.videoReveal,
      layerReveal: exp?.videoLayer?.reveal,
      layerTarget: exp?.videoLayer?.target,
      videoAspect: exp?.videoLayer?.videoAspect,
      frameReady: exp?.videoLayer?.frameReady,
      texReady: !!exp?.videoLayer?.texture
    };
  });
  console.log('SLIDE 1 EVAL:', info);
  await page.screenshot({ path: 'sanity/debug_slide1_check.png' });
  await browser.close();
})();

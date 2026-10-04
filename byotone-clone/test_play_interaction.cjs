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

  await page.goto('http://localhost:4321/#slide-12', { waitUntil: 'networkidle' });
  
  // Click on the page to trigger user interaction
  await page.click('body');
  await page.waitForTimeout(2000);

  const evalRes = await page.evaluate(async () => {
    const exp = window.webglExperience;
    const vid = exp?.videoLayer?.video;
    if (vid) {
      try {
        await vid.play();
      } catch (e) {
        console.error('PLAY ERROR:', e);
      }
    }
    return {
      readyState: vid?.readyState,
      paused: vid?.paused,
      currentTime: vid?.currentTime,
      duration: vid?.duration,
      videoWidth: vid?.videoWidth,
      videoHeight: vid?.videoHeight,
      reveal: exp?.videoReveal,
      target: exp?.videoLayer?.target,
      layerReveal: exp?.videoLayer?.reveal,
    };
  });

  console.log('EVAL RES:', evalRes);
  await page.waitForTimeout(2000);

  const evalRes2 = await page.evaluate(() => {
    const exp = window.webglExperience;
    const vid = exp?.videoLayer?.video;
    return {
      readyState: vid?.readyState,
      paused: vid?.paused,
      currentTime: vid?.currentTime,
      layerReveal: exp?.videoLayer?.reveal,
      videoAspect: exp?.videoLayer?.videoAspect,
    };
  });
  console.log('EVAL RES AFTER PLAY:', evalRes2);

  await page.screenshot({ path: 'sanity/dino_play_check.png' });
  console.log('Saved sanity/dino_play_check.png');
  await browser.close();
})();

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
  await page.waitForTimeout(3000);

  const videoStatus = await page.evaluate(() => {
    const exp = window.webglExperience;
    const vid = exp?.videoLayer?.video;
    return {
      hasExp: !!exp,
      hasVideoLayer: !!exp?.videoLayer,
      reveal: exp?.videoReveal,
      targetReveal: exp?.videoLayer?.target,
      currentReveal: exp?.videoLayer?.reveal,
      vidSrc: vid ? vid.src : null,
      vidReadyState: vid ? vid.readyState : null,
      vidPaused: vid ? vid.paused : null,
      vidCurrentTime: vid ? vid.currentTime : null,
      vidDuration: vid ? vid.duration : null,
      vidWidth: vid ? vid.videoWidth : null,
      vidHeight: vid ? vid.videoHeight : null,
      videoAspect: exp?.videoLayer?.videoAspect,
    };
  });

  console.log('VIDEO STATUS:', JSON.stringify(videoStatus, null, 2));

  await page.screenshot({ path: 'sanity/debug_dino_slide12.png' });
  console.log('Saved sanity/debug_dino_slide12.png');
  await browser.close();
})();

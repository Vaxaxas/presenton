const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[error] ${err.toString()}`));

  console.log('Loading page...');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
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
  console.log('Slide 1 start:', s1);

  // Navigate to Slide 12 by clicking chapter 12
  console.log('Clicking Slide 12...');
  await page.evaluate(() => {
    const links = document.querySelectorAll('.header .chapters a');
    if (links[11]) links[11].click();
  });
  await page.waitForTimeout(2000);

  // Check Slide 12 over 3 seconds
  for (let t = 0; t < 6; t++) {
    const s12 = await page.evaluate(() => {
      const exp = window.webglExperience;
      const vl = exp?.videoLayer;
      const v = vl?.video;
      return {
        videoSrc: v?.src,
        paused: v?.paused,
        currentTime: v?.currentTime,
        readyState: v?.readyState,
        reveal: exp?.videoReveal,
        lastVideoTime: vl?.lastVideoTime,
        textureUpdated: vl?.texture?.needsUpdate,
        meshVisible: exp?.scene?.mesh?.visible
      };
    });
    console.log(`Slide 12 sample ${t}:`, s12);
    await page.waitForTimeout(500);
  }

  // Also check FPS / frame time
  const perf = await page.evaluate(async () => {
    let frameTimes = [];
    let last = performance.now();
    return new Promise(resolve => {
      let count = 0;
      function loop() {
        const now = performance.now();
        frameTimes.push(now - last);
        last = now;
        count++;
        if (count < 60) {
          requestAnimationFrame(loop);
        } else {
          const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const fps = 1000 / avgDelta;
          resolve({ fps, minDelta: Math.min(...frameTimes), maxDelta: Math.max(...frameTimes), frameTimes: frameTimes.slice(0, 10) });
        }
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('Performance on Slide 12:', perf);

  console.log('Browser logs:', logs);
  await browser.close();
})();

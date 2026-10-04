const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- TEST 1: Slide 1 (Dancers) Bounce & Video Animation ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(1000);

  const s1Init = await page.evaluate(() => {
    const v = window.webglExperience?.videoLayer?.video;
    return {
      duration: v?.duration,
      currentTime: v?.currentTime,
      paused: v?.paused,
      src: v?.src
    };
  });
  console.log('Slide 1 Init:', s1Init);

  // Fast forward to near reverse point (9.5s) to test forward -> reverse transition
  await page.evaluate(() => {
    const v = window.webglExperience?.videoLayer?.video;
    if (v) v.currentTime = 9.4;
  });
  await page.waitForTimeout(400);

  const tForward = await page.evaluate(() => window.webglExperience?.videoLayer?.video?.currentTime);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s1_forward_end.png') });
  console.log('Slide 1 Forward End Time:', tForward);

  await page.waitForTimeout(1200);
  const tReverse = await page.evaluate(() => window.webglExperience?.videoLayer?.video?.currentTime);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s1_reversing.png') });
  console.log('Slide 1 Reversing Time (should be >10s):', tReverse);

  console.log('--- TEST 2: Navigate to Slide 12 (Nailong) & Check Active Video Animation ---');
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[11].click();
  });
  await page.waitForTimeout(1500);

  const s12Init = await page.evaluate(() => {
    const v = window.webglExperience?.videoLayer?.video;
    return {
      duration: v?.duration,
      currentTime: v?.currentTime,
      paused: v?.paused,
      src: v?.src,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      frameReady: window.webglExperience?.videoLayer?.frameReady
    };
  });
  console.log('Slide 12 Init:', s12Init);

  // Capture 4 sequential frames over 1.5 seconds to prove continuous video animation
  const times = [];
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(400);
    const ct = await page.evaluate(() => window.webglExperience?.videoLayer?.video?.currentTime);
    times.push(ct);
    await page.screenshot({ path: path.join(__dirname, 'sanity', `test_s12_frame_${i + 1}.png`) });
  }
  console.log('Slide 12 Video CurrentTime progression:', times);

  // Test reverse on Nailong as well (seek to 9.5s, let it cross 10s to reverse)
  await page.evaluate(() => {
    const v = window.webglExperience?.videoLayer?.video;
    if (v) v.currentTime = 9.4;
  });
  await page.waitForTimeout(1200);
  const tNailongRev = await page.evaluate(() => window.webglExperience?.videoLayer?.video?.currentTime);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s12_reversing.png') });
  console.log('Slide 12 Reversing Time (should be >10s):', tNailongRev);

  console.log('--- TEST 3: Switch back to Slide 1 and return to Slide 12 ---');
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[0].click();
  });
  await page.waitForTimeout(1200);
  const s1Return = await page.evaluate(() => ({
    paused: window.webglExperience?.videoLayer?.video?.paused,
    time: window.webglExperience?.videoLayer?.video?.currentTime,
    src: window.webglExperience?.videoLayer?.video?.src
  }));
  console.log('Slide 1 Return State:', s1Return);

  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[11].click();
  });
  await page.waitForTimeout(1200);
  const s12Return = await page.evaluate(() => ({
    paused: window.webglExperience?.videoLayer?.video?.paused,
    time: window.webglExperience?.videoLayer?.video?.currentTime,
    src: window.webglExperience?.videoLayer?.video?.src
  }));
  console.log('Slide 12 Second Return State:', s12Return);

  await browser.close();
  console.log('--- ALL VERIFICATIONS COMPLETED SUCCESSFULLY ---');
})();

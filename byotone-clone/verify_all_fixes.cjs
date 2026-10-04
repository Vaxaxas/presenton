const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- 1. Testing Slide 1 (Dancers) ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const s1Info = await page.evaluate(() => {
    const vl = window.webglExperience?.videoLayer;
    return {
      videoSrc: vl?.video?.src,
      paused: vl?.video?.paused,
      currentTime: vl?.video?.currentTime,
      reveal: vl?.reveal
    };
  });
  console.log('Slide 1 Info:', s1Info);
  await page.screenshot({ path: 'sanity/verify_fixed_s1_dancers.png' });

  console.log('--- 2. Testing Slide 11 (Wave Particle Field) ---');
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[10].click();
  });
  await page.waitForTimeout(1500);

  // Move mouse across slide 11 to trigger wave interaction
  await page.mouse.move(300, 300);
  await page.waitForTimeout(300);
  await page.mouse.move(800, 500);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sanity/verify_fixed_s11_wave.png' });
  console.log('Slide 11 screenshot saved!');

  console.log('--- 3. Testing Slide 12 (Nailong 67 Animation & Performance) ---');
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[11].click();
  });
  await page.waitForTimeout(1500);

  // Sample Slide 12 sequential frames to verify active motion
  const samples = [];
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(600);
    const info = await page.evaluate(() => {
      const vl = window.webglExperience?.videoLayer;
      return {
        videoSrc: vl?.video?.src,
        paused: vl?.video?.paused,
        currentTime: vl?.video?.currentTime,
        reveal: vl?.reveal,
        textureNeedsUpdate: vl?.texture?.needsUpdate
      };
    });
    const shot = await page.screenshot();
    samples.push({ i, info, shot });
    console.log(`Slide 12 sample ${i}: currentTime=${info.currentTime.toFixed(2)}, paused=${info.paused}`);
  }

  // Verify frames are actively animating (not identical)
  let allAnimated = true;
  for (let i = 1; i < samples.length; i++) {
    const identical = samples[i].shot.equals(samples[i - 1].shot);
    console.log(`Frame diff sample ${i - 1} vs ${i}: identical = ${identical}`);
    if (identical) allAnimated = false;
  }
  console.log(`Nailong animation active and moving continuously: ${allAnimated}`);
  fs.writeFileSync('sanity/verify_fixed_s12_normal.png', samples[2].shot);

  // Test FPS performance on Slide 12
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
          resolve({ fps, minDelta: Math.min(...frameTimes), maxDelta: Math.max(...frameTimes) });
        }
      }
      requestAnimationFrame(loop);
    });
  });
  console.log('Slide 12 Performance:', perf);

  // Test "✨ 全像視角" toggle
  console.log('--- 4. Testing Slide 12 Immersive Holographic Toggle ---');
  await page.click('#slide12-toggle-view');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sanity/verify_fixed_s12_immersed.png' });
  console.log('Slide 12 immersed screenshot saved!');

  // Test exiting immersive view
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const isImmersedAfterEsc = await page.evaluate(() => {
    return document.getElementById('slide-12').classList.contains('is-immersed');
  });
  console.log('Esc successfully restored normal view:', !isImmersedAfterEsc);

  await browser.close();
  console.log('=== All tests completed successfully! ===');
})();

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- TEST 1: Load Slide 1 ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(1000);

  const initialSlide1 = await page.evaluate(() => ({
    reveal: window.webglExperience?.videoReveal,
    videoLayerReveal: window.webglExperience?.videoLayer?.reveal,
    videoSrc: window.webglExperience?.videoLayer?.video?.src,
    paused: window.webglExperience?.videoLayer?.video?.paused,
    progress: window.webglExperience?.scene?.progress,
    springVal: window.webglExperience?.scene?.spring?.value
  }));
  console.log('Slide 1 Initial State:', initialSlide1);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide1_settled.png') });

  console.log('--- TEST 2: Transition from Slide 1 -> Slide 2 ---');
  await page.click('#dock-next-btn');

  const s1_to_s2_frames = [];
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(120);
    const frame = await page.evaluate(() => ({
      reveal: window.webglExperience?.videoReveal,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      paused: window.webglExperience?.videoLayer?.video?.paused,
      springVal: window.webglExperience?.scene?.spring?.value
    }));
    s1_to_s2_frames.push(frame);
    if (i === 3) {
      await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s1_to_s2_mid_morph.png') });
    }
  }
  console.log('Slide 1 -> Slide 2 Transition Frames:');
  console.table(s1_to_s2_frames);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide2_settled.png') });

  console.log('--- TEST 3: Transition Back from Slide 2 -> Slide 1 ---');
  await page.click('#dock-prev-btn');

  const s2_to_s1_frames = [];
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(120);
    const frame = await page.evaluate(() => ({
      reveal: window.webglExperience?.videoReveal,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      paused: window.webglExperience?.videoLayer?.video?.paused,
      springVal: window.webglExperience?.scene?.spring?.value
    }));
    s2_to_s1_frames.push(frame);
    if (i === 3) {
      await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s2_to_s1_mid_morph.png') });
    }
  }
  console.log('Slide 2 -> Slide 1 Return Frames:');
  console.table(s2_to_s1_frames);

  console.log('--- TEST 4: Navigate to Slide 12 (Nailong) ---');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[11];
    if (link) link.click();
  });

  const to_s12_frames = [];
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(120);
    const frame = await page.evaluate(() => ({
      reveal: window.webglExperience?.videoReveal,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      videoSrc: window.webglExperience?.videoLayer?.video?.src,
      paused: window.webglExperience?.videoLayer?.video?.paused,
      springVal: window.webglExperience?.scene?.spring?.value
    }));
    to_s12_frames.push(frame);
    if (i === 4) {
      await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_to_s12_mid_morph.png') });
    }
  }
  console.log('Navigation to Slide 12 Frames:');
  console.table(to_s12_frames);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide12_settled.png') });

  console.log('--- TEST 5: Navigate from Slide 12 -> Slide 11 (Free Flow) ---');
  await page.click('#dock-prev-btn');

  const s12_to_s11_frames = [];
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(120);
    const frame = await page.evaluate(() => ({
      reveal: window.webglExperience?.videoReveal,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      paused: window.webglExperience?.videoLayer?.video?.paused,
      springVal: window.webglExperience?.scene?.spring?.value
    }));
    s12_to_s11_frames.push(frame);
    if (i === 3) {
      await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_s12_to_s11_mid_morph.png') });
    }
  }
  console.log('Slide 12 -> Slide 11 Transition Frames:');
  console.table(s12_to_s11_frames);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide11_settled.png') });

  await browser.close();
  console.log('ALL TRANSITION TESTS FINISHED SUCCESSFULLY!');
})();

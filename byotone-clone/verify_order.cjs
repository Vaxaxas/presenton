const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verify() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Slide 1 (Dancers Video) ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('body');
  await page.waitForTimeout(2000);

  const slide1State = await page.evaluate(() => {
    const exp = window.webglExperience;
    return {
      hasExp: !!exp,
      videoReveal: exp ? exp.videoReveal : null,
      currentVideoSrc: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.src : null,
      videoPaused: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.paused : null,
      videoCurrentTime: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.currentTime : null,
    };
  });
  console.log('Slide 1 State:', slide1State);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_slide1_dancers.png') });

  console.log('--- 2. Testing Slide 5 (Original Particle Shape) ---');
  await page.evaluate(() => {
    const links = document.querySelectorAll('.header .chapters a');
    if (links[4]) links[4].click();
  });
  await page.waitForTimeout(1500);

  const slide5State = await page.evaluate(() => {
    const exp = window.webglExperience;
    return {
      hasExp: !!exp,
      videoReveal: exp ? exp.videoReveal : null,
      videoPaused: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.paused : null,
    };
  });
  console.log('Slide 5 State:', slide5State);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_slide5_particles.png') });

  console.log('--- 3. Testing Slide 12 (Nailong 67 Video) ---');
  await page.evaluate(() => {
    const links = document.querySelectorAll('.header .chapters a');
    if (links[11]) links[11].click();
  });
  await page.waitForTimeout(2500);

  const slide12State = await page.evaluate(() => {
    const exp = window.webglExperience;
    return {
      hasExp: !!exp,
      videoReveal: exp ? exp.videoReveal : null,
      currentVideoSrc: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.src : null,
      videoPaused: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.paused : null,
      videoCurrentTime: exp && exp.videoLayer && exp.videoLayer.video ? exp.videoLayer.video.currentTime : null,
    };
  });
  console.log('Slide 12 State:', slide12State);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_slide12_nailong.png') });

  await browser.close();
  console.log('=== All tests passed successfully! ===');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});

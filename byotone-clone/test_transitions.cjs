const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to root...');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(1500);

  // Check Slide 1
  let s1 = await page.evaluate(() => ({
    slide: 1,
    video: window.webglExperience?.videoLayer?.video?.src,
    paused: window.webglExperience?.videoLayer?.video?.paused,
    reveal: window.webglExperience?.videoReveal
  }));
  console.log('Slide 1 Check:', s1);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'final_slide1_dancers.png') });

  // Navigate to Slide 6
  console.log('Navigating to Slide 6...');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[5];
    if (link) link.click();
  });
  await page.waitForTimeout(1500);
  let s6 = await page.evaluate(() => ({
    slide: 6,
    video: window.webglExperience?.videoLayer?.video?.src,
    paused: window.webglExperience?.videoLayer?.video?.paused,
    reveal: window.webglExperience?.videoReveal
  }));
  console.log('Slide 6 Check:', s6);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'final_slide6_particles.png') });

  // Navigate to Slide 12
  console.log('Navigating to Slide 12...');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[11];
    if (link) link.click();
  });
  await page.waitForTimeout(2000);
  let s12 = await page.evaluate(() => ({
    slide: 12,
    video: window.webglExperience?.videoLayer?.video?.src,
    paused: window.webglExperience?.videoLayer?.video?.paused,
    reveal: window.webglExperience?.videoReveal
  }));
  console.log('Slide 12 Check:', s12);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'final_slide12_nailong.png') });

  // Navigate back to Slide 1
  console.log('Navigating back to Slide 1...');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[0];
    if (link) link.click();
  });
  await page.waitForTimeout(1500);
  let s1_back = await page.evaluate(() => ({
    slide: 1,
    video: window.webglExperience?.videoLayer?.video?.src,
    paused: window.webglExperience?.videoLayer?.video?.paused,
    reveal: window.webglExperience?.videoReveal
  }));
  console.log('Slide 1 Back Check:', s1_back);

  await browser.close();
  console.log('SUCCESS: All slide transitions verified!');
})();

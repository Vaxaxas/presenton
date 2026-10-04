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

  console.log('--- TEST: Mouse hover on Slide 1 (Dancers) ---');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.click('body');
  await page.waitForTimeout(1200);

  // Take baseline screenshot without mouse movement in center
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide1_no_mouse.png') });

  // Move mouse across center
  await page.mouse.move(720, 450);
  await page.waitForTimeout(300);
  await page.mouse.move(720, 500);
  await page.waitForTimeout(300);
  await page.mouse.move(600, 400);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide1_with_mouse_move.png') });

  console.log('--- TEST: Navigate to Slide 12 (Nailong) and test mouse move ---');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[11];
    if (link) link.click();
  });
  await page.waitForTimeout(1600);

  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide12_no_mouse.png') });

  // Move mouse rapidly on Slide 12 center
  await page.mouse.move(720, 450);
  await page.waitForTimeout(200);
  await page.mouse.move(800, 500);
  await page.waitForTimeout(200);
  await page.mouse.move(650, 400);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'test_slide12_with_mouse_move.png') });

  // Verify WebGL Experience pointer variables
  const pointerState = await page.evaluate(() => ({
    pointer: window.webglExperience?.pointer,
    centeredPointer: window.webglExperience?.centeredPointer,
    videoReveal: window.webglExperience?.videoReveal,
    layerReveal: window.webglExperience?.videoLayer?.reveal,
    columns: window.webglExperience?.videoLayer?.columns,
    rows: window.webglExperience?.videoLayer?.rows,
    shadowColor: Array.from(window.webglExperience?.videoLayer?.program?.uniforms?.uShadow?.value || []),
    lightColor: Array.from(window.webglExperience?.videoLayer?.program?.uniforms?.uLight?.value || []),
    density: window.webglExperience?.videoLayer?.program?.uniforms?.uDensity?.value,
    scale: window.webglExperience?.videoLayer?.program?.uniforms?.uScale?.value
  }));

  console.log('Particle System Verification State:', JSON.stringify(pointerState, null, 2));

  await browser.close();
  console.log('Mouse interaction and particle verification complete!');
})();

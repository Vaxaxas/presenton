const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Testing Slide 1 (Dancers with enhanced detail)...');
  await page.goto('http://localhost:4321/#slide-1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(1500);

  // Move mouse to test interactivity
  await page.mouse.move(720, 450);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_v2_slide1_dancers.png') });

  const s1Look = await page.evaluate(() => {
    const p = window.webglExperience?.videoLayer?.program?.uniforms;
    return {
      density: p?.uDensity?.value,
      scale: p?.uScale?.value,
      brightness: p?.uBrightness?.value,
      video: window.webglExperience?.videoLayer?.video?.src,
      currentTime: window.webglExperience?.videoLayer?.video?.currentTime
    };
  });
  console.log('Slide 1 Shader Uniforms:', s1Look);

  console.log('2. Testing Slide 12 (Nailong with lighter particles + mouse-following ripples)...');
  await page.evaluate(() => {
    const link = document.querySelectorAll('.header .chapters a')[11];
    if (link) link.click();
  });
  await page.waitForTimeout(2000);

  const s12Look = await page.evaluate(() => {
    const p = window.webglExperience?.videoLayer?.program?.uniforms;
    return {
      density: p?.uDensity?.value,
      scale: p?.uScale?.value,
      brightness: p?.uBrightness?.value,
      video: window.webglExperience?.videoLayer?.video?.src,
      sceneVisible: window.webglExperience?.scene?.visible,
      currentTime: window.webglExperience?.videoLayer?.video?.currentTime
    };
  });
  console.log('Slide 12 Shader Uniforms:', s12Look);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_v2_slide12_nailong.png') });

  // Move mouse across Slide 12 to verify mouse ripples and particle reaction
  console.log('Moving mouse to verify ripple effect on Slide 12...');
  for (let x = 300; x <= 1100; x += 150) {
    await page.mouse.move(x, 400);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, 'sanity', 'verify_v2_slide12_mouse_moved.png') });

  await browser.close();
  console.log('Verification completed successfully!');
})();

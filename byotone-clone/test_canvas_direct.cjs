const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click Chapter 12
  await page.evaluate(() => {
    document.querySelectorAll('.header .chapters a')[11].click();
  });
  await page.waitForTimeout(2000);

  // Case 1: normal slide 12
  await page.screenshot({ path: 'sanity/iso_1_normal.png' });

  // Case 2: hide videoLayer mesh completely
  await page.evaluate(() => {
    window.webglExperience.videoLayer.mesh.visible = false;
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sanity/iso_2_no_video.png' });

  // Case 3: hide 3D scene (show ONLY videoLayer mesh)
  await page.evaluate(() => {
    window.webglExperience.videoLayer.mesh.visible = true;
    window.webglExperience.scene.setVisibility(0);
    // hide all DOM content
    document.body.querySelectorAll('div, section, nav').forEach(el => {
      if (!el.classList.contains('webgl-scene') && !el.querySelector('canvas') && el.tagName !== 'CANVAS') {
        el.style.opacity = '0';
      }
    });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sanity/iso_3_only_video.png' });

  await browser.close();
  console.log('Isolation screenshots saved!');
})();

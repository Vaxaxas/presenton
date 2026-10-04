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

  // Hide DOM cards temporarily to see the pure holographic particles
  await page.evaluate(() => {
    document.querySelectorAll('.slide-stage, .header, .dock, #prompter-modal').forEach(el => el.style.opacity = '0');
  });

  const presets = [
    { name: 'current', look: { brightness: 1.02, highlights: 0.50, density: 0.06, scale: 1.05 } },
    { name: 'clean_fine', look: { brightness: 1.10, highlights: 0.65, density: -0.02, scale: 0.78 } },
    { name: 'sharp_crisp', look: { brightness: 1.15, highlights: 0.70, density: -0.05, scale: 0.72 } },
    { name: 'balanced', look: { brightness: 1.08, highlights: 0.60, density: 0.00, scale: 0.82 } }
  ];

  for (const p of presets) {
    await page.evaluate((l) => {
      window.webglExperience.videoLayer.setLook(l);
    }, p.look);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `sanity/tune_${p.name}.png` });
    console.log(`Saved sanity/tune_${p.name}.png`);
  }

  await browser.close();
})();

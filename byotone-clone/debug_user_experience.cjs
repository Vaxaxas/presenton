const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => logs.push('PAGE_ERROR: ' + err.message));
  
  await page.goto('http://localhost:4321/');
  await page.waitForTimeout(2000);

  // Check what happens when user scrolls with wheel to slide 12
  await page.evaluate(() => {
    const s12 = document.getElementById('slide-12');
    if (s12) s12.scrollIntoView();
  });
  await page.waitForTimeout(2000);

  const status1 = await page.evaluate(() => {
    const vN = window.webglExperience?.videoLayer?.video;
    return {
      activeSlide: document.querySelector('.presentation-slide[data-active]')?.id,
      dockCounter: document.getElementById('dock-counter')?.textContent,
      vSrc: vN?.src,
      vPaused: vN?.paused,
      vCurrentTime: vN?.currentTime,
      vReadyState: vN?.readyState,
      vDuration: vN?.duration,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      layerTarget: window.webglExperience?.videoLayer?.target,
      frameReady: window.webglExperience?.videoLayer?.frameReady
    };
  });
  console.log('Slide 12 via scrollIntoView:', status1);

  // Now test clicking next button to go through slides
  await page.goto('http://localhost:4321/');
  await page.waitForTimeout(1000);
  for (let i = 0; i < 11; i++) {
    await page.click('#dock-next-btn');
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(1500);

  const status2 = await page.evaluate(() => {
    const vN = window.webglExperience?.videoLayer?.video;
    return {
      activeSlide: document.querySelector('.presentation-slide[data-active]')?.id,
      dockCounter: document.getElementById('dock-counter')?.textContent,
      vSrc: vN?.src,
      vPaused: vN?.paused,
      vCurrentTime: vN?.currentTime,
      vReadyState: vN?.readyState,
      vDuration: vN?.duration,
      layerReveal: window.webglExperience?.videoLayer?.reveal,
      layerTarget: window.webglExperience?.videoLayer?.target,
      frameReady: window.webglExperience?.videoLayer?.frameReady
    };
  });
  console.log('Slide 12 via dock-next-btn 11 times:', status2);

  // Capture screenshot of slide 12
  await page.screenshot({ path: './sanity/debug_user_slide12.png' });

  await browser.close();
  console.log('All logs:', logs.filter(l => !l.includes('%c')));
})();

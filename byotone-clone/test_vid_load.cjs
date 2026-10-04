const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.goto('http://localhost:4321/assets/dance-rgbd-sbs.mp4');
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const v = document.querySelector('video');
    return {
      hasVideo: !!v,
      readyState: v ? v.readyState : null,
      videoWidth: v ? v.videoWidth : null,
      videoHeight: v ? v.videoHeight : null,
      duration: v ? v.duration : null,
      error: v?.error ? { code: v.error.code, message: v.error.message } : null
    };
  });
  console.log('INFO:', info);
  await browser.close();
})();

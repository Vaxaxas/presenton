const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4321/#slide-12', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('body');
  await page.waitForTimeout(1000);

  const diag = await page.evaluate(() => {
    const exp = window.webglExperience;
    const vl = exp?.videoLayer;
    const v = vl?.video;
    const gl = exp?.renderer?.gl;
    return {
      activeVideo: v?.src,
      videoElementPaused: v?.paused,
      videoCurrentTime: v?.currentTime,
      videoDuration: v?.duration,
      videoPlaybackRate: v?.playbackRate,
      videoReadyState: v?.readyState,
      videoWidth: v?.videoWidth,
      videoHeight: v?.videoHeight,
      videoAspect: vl?.videoAspect,
      canvasAspect: vl?.canvasAspect,
      reveal: exp?.videoReveal,
      targetReveal: vl?.target,
      currentReveal: vl?.reveal,
      hasFrameCallback: vl?.hasFrameCallback,
      frameReady: vl?.frameReady,
      lastVideoTime: vl?.lastVideoTime,
      textureNeedsUpdate: vl?.texture?.needsUpdate,
      uniforms: {
        uCover: Array.from(vl?.program?.uniforms?.uCover?.value || []),
        uOffset: Array.from(vl?.program?.uniforms?.uOffset?.value || []),
        uFrame: Array.from(vl?.program?.uniforms?.uFrame?.value || []),
        uCell: Array.from(vl?.program?.uniforms?.uCell?.value || []),
        uReveal: vl?.program?.uniforms?.uReveal?.value,
        uGather: vl?.program?.uniforms?.uGather?.value,
        uDensity: vl?.program?.uniforms?.uDensity?.value,
        uScale: vl?.program?.uniforms?.uScale?.value,
        uBrightness: vl?.program?.uniforms?.uBrightness?.value
      }
    };
  });
  console.log('Diagnostic on Slide 12:', JSON.stringify(diag, null, 2));

  await browser.close();
})();

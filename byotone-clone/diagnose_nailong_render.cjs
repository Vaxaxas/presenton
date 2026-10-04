const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-gl=angle', '--use-angle=default', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4321/#slide-12', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const diag = await page.evaluate(() => {
    const exp = window.webglExperience;
    const vl = exp?.videoLayer;
    const v = vl?.video;
    const gl = exp?.renderer?.gl;

    return {
      experienceExists: !!exp,
      videoLayerExists: !!vl,
      videoEl: {
        src: v?.src,
        paused: v?.paused,
        currentTime: v?.currentTime,
        duration: v?.duration,
        videoWidth: v?.videoWidth,
        videoHeight: v?.videoHeight,
        readyState: v?.readyState,
        inDom: !!document.contains(v)
      },
      reveal: vl?.reveal,
      target: vl?.target,
      videoAspect: vl?.videoAspect,
      canvasAspect: vl?.canvasAspect,
      columns: vl?.columns,
      rows: vl?.rows,
      uniforms: {
        uReveal: vl?.program?.uniforms?.uReveal?.value,
        uCover: Array.from(vl?.program?.uniforms?.uCover?.value || []),
        uOffset: Array.from(vl?.program?.uniforms?.uOffset?.value || []),
        uFrame: Array.from(vl?.program?.uniforms?.uFrame?.value || []),
        uCell: Array.from(vl?.program?.uniforms?.uCell?.value || []),
        uBrightness: vl?.program?.uniforms?.uBrightness?.value,
        uHighlights: vl?.program?.uniforms?.uHighlights?.value,
        uDensity: vl?.program?.uniforms?.uDensity?.value,
        uScale: vl?.program?.uniforms?.uScale?.value,
        uPointSpan: vl?.program?.uniforms?.uPointSpan?.value
      },
      texture: {
        hasImage: !!vl?.texture?.image,
        imageSrc: vl?.texture?.image?.src,
        needsUpdate: vl?.texture?.needsUpdate
      }
    };
  });

  console.log('Slide 12 Diagnostic:', JSON.stringify(diag, null, 2));

  // Now let's test hiding the 3D scene and text completely, and screenshot what WebGL canvas shows!
  await page.evaluate(() => {
    // Hide all text cards
    document.querySelectorAll('.slide-stage, .header, .dock, #prompter-modal').forEach(el => el.style.display = 'none');
    // Hide 3D background scene
    if (window.webglExperience?.scene) {
      window.webglExperience.scene.setVisibility(0);
    }
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sanity/only_videolayer_s12.png' });
  console.log('Saved sanity/only_videolayer_s12.png');

  await browser.close();
})();

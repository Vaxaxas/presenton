const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/WebGLExperience.D8oxuo5A.js","_astro/timeline.gWzeKX-k.js","_astro/Mesh.hM-DVdua.js","_astro/grainCloud.C3ebM2fb.js","_astro/palette.CaVCndm1.js","_astro/scene.KB0rjFEV.js","_astro/math.G8uucggr.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper.oCYlU9a4.js";var t=`
    const canvas = new OffscreenCanvas(1, 1)
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    let name = ''
    if (gl) {
        const info = gl.getExtension('WEBGL_debug_renderer_info')
        name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
    }
    postMessage(name)
`,n,r=()=>n??=new Promise(e=>{if(typeof OffscreenCanvas>`u`||typeof Worker>`u`)return e(!1);let n,r=t=>{n.terminate(),e(t)};try{n=new Worker(URL.createObjectURL(new Blob([t],{type:`text/javascript`})))}catch{return e(!1)}n.addEventListener(`message`,e=>r(/swiftshader|llvmpipe|softpipe|software/i.test(e.data)),{once:!0}),n.addEventListener(`error`,()=>r(!1),{once:!0}),setTimeout(()=>r(!1),3e3)}),i=async(t,n,i)=>{if(await r())return!1;let[{WebGLExperience:a},{createScene:o}]=await Promise.all([e(()=>import(`./WebGLExperience.D8oxuo5A.js`),__vite__mapDeps([0,1,2,3,4])),e(()=>import(`./scene.KB0rjFEV.js`),__vite__mapDeps([5,6,1,2,4]))]),s,c,l=()=>{c?.(),s?.destroy(),s=c=void 0},u=()=>{try{return s=new a(t,o(n)),c=i(s),!0}catch{return l(),!1}};return t.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),l()}),t.addEventListener(`webglcontextrestored`,u),u()};export{r as n,i as t};
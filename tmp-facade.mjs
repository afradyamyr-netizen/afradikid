import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:'new',protocolTimeout:120000,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
for (const [name,base] of [['FM','http://127.0.0.1:4173'],['ZK','http://127.0.0.1:4174']]) {
  const ctx=await b.createBrowserContext(); const p=await ctx.newPage();
  await p.setViewport({width:390,height:844,deviceScaleFactor:1});
  await p.goto(base+'/courses',{waitUntil:'domcontentloaded',timeout:40000});
  await new Promise(r=>setTimeout(r,4000));
  const before=await p.evaluate(()=>({
    iframes:document.querySelectorAll('[data-manual-embed="iframe"] iframe').length,
    facades:document.querySelectorAll('[data-manual-embed="iframe-facade"]').length,
    facadeBtn:document.querySelectorAll('[data-manual-embed="iframe-facade"] button').length,
    anyIframe:document.querySelectorAll('iframe').length}));
  let after={};
  if(before.facades){ await p.evaluate(()=>{document.querySelector('[data-manual-embed="iframe-facade"] button').click();}); await new Promise(r=>setTimeout(r,2500));
    after=await p.evaluate(()=>({iframes:document.querySelectorAll('[data-manual-embed="iframe"] iframe').length,facades:document.querySelectorAll('[data-manual-embed="iframe-facade"]').length}));}
  console.log(name,'قبل از کلیک:',JSON.stringify(before),'| بعد از کلیک روی دکمه:',JSON.stringify(after));
  await ctx.close();
}
await b.close();

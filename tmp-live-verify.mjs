import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:'new',protocolTimeout:120000,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
async function probe(url,path){
  const ctx=await b.createBrowserContext(); const p=await ctx.newPage();
  await p.setViewport({width:400,height:860,deviceScaleFactor:1});
  await p.goto(url+path,{waitUntil:'domcontentloaded',timeout:40000});
  await new Promise(r=>setTimeout(r,3000));
  const A=await p.metrics(); await new Promise(r=>setTimeout(r,5000)); const B=await p.metrics();
  const growth=(Number(B.ScriptDuration)-Number(A.ScriptDuration)).toFixed(3);
  const d=await p.evaluate(()=>{
    const box=document.querySelector('.zp-box'); const c=box?getComputedStyle(box):null;
    const trig=document.querySelector('.zp-box button'); const t=trig?getComputedStyle(trig):null;
    return {h1:(document.querySelector('.zp-h1,h1')||{}).textContent?.trim().slice(0,30)||'',
      box:c?c.padding+'|bd '+c.borderTopWidth+'|bg '+c.backgroundColor:'—',
      trig:t?t.borderTopWidth+'|bg '+t.backgroundColor:'—',
      burger:!!document.querySelector('button[aria-label="باز کردن منو"]'),
      guide:!!document.querySelector('.zka-launch'),
      code:(document.querySelector('.zp-tag')||{}).textContent||''};
  });
  console.log(path.padEnd(13),'| رشد اسکریپت ۵ث:',growth,'|',JSON.stringify(d));
  await ctx.close(); return {growth,d};
}
for (const u of ['https://zeynalikid.vercel.app','https://farzandman.vercel.app']) {
  console.log('\n══════',u,'══════');
  for (const path of ['/track','/courses','/admin/login','/']) await probe(u,path);
}
await b.close();

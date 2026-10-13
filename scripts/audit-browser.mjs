import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.audit-results');
fs.mkdirSync(output, { recursive: true });
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const pages=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const sizes=[[320,568],[360,640],[390,844],[430,932],[568,320],[667,375],[672,900],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080],[2560,1440]];
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((q,r)=>{
 const pathname=decodeURIComponent(new URL(q.url,'http://localhost').pathname).replace(/^\/White-Forest-Homes\//,'/');
 const file=path.join(root,pathname==='/'?'index.html':pathname);
 try{r.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');r.end(fs.readFileSync(file))}catch{r.writeHead(404);r.end('Not found')}
});
const results={layouts:[],a11y:[],links:[],errors:[],checks:[]};

async function runInteractions(browser, base) {
 const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
 const page = await context.newPage();
 page.setDefaultTimeout(7000);
 const check = (name) => results.checks.push(name);
 const assertAnchor = async (id) => {
  await page.waitForLoadState('load');
  await page.waitForFunction(id => document.activeElement.id === id, id, {timeout:3000});
  const position = await page.evaluate(id => ({top:document.getElementById(id).getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom,focus:document.activeElement.id}),id);
  assert(position.top >= position.header - 1, `#${id} is obscured by the header`);
  assert.equal(position.focus, id);
 };
 await page.goto(base+'/index.html');
 assert(await page.locator('[data-cookie-banner]').isVisible());
 await page.getByRole('button',{name:'Open navigation',exact:true}).click();
 assert.equal(await page.locator('main').evaluate(e=>e.inert),true);
 await page.locator('[data-cookie-banner]').waitFor({state:'hidden'});
 assert.equal(await page.locator('[data-cookie-banner]').isVisible(),false);
 for(let i=0;i<16;i++){
  await page.keyboard.press('Tab');
  assert(await page.evaluate(()=>document.activeElement.closest('[data-site-nav],[data-nav-toggle]')!==null));
 }
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'),'false');
 assert(await page.locator('[data-nav-toggle]').evaluate(e=>e===document.activeElement));
 assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
 check('Mobile menu focus trap, Escape, background isolation and focus return');
 await page.getByRole('button',{name:'Reject non-essential',exact:true}).click();

 for(const size of [{width:320,height:568},{width:568,height:320},{width:768,height:1024}]){
  await page.setViewportSize(size);
  await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  const instagram=page.locator('.site-nav-meta a').last();
  await instagram.scrollIntoViewIfNeeded();
  const b=await instagram.boundingBox();
  assert(b.y>=0 && b.y+b.height<=size.height+1,'Menu footer is not reachable');
  await page.keyboard.press('Escape');
 }
 check('Portrait, landscape and tablet menu scrolling');
 await page.getByRole('button',{name:'Open navigation',exact:true}).click();
 await page.setViewportSize({width:1280,height:800});
 assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('nav-open')),false);
 assert.equal(await page.locator('[data-site-nav]').evaluate(e=>e.inert),false);
 check('Resizing to desktop releases scroll and navigation locks');

 await page.setViewportSize({width:320,height:320});
 await page.getByRole('button',{name:'Cookie settings',exact:true}).click();
 assert(await page.locator('dialog').evaluate(e=>e.open));
 await page.addScriptTag({content:axe});
 const consentViolations = await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations);
 assert.deepEqual(consentViolations.map(v=>v.id),[],'Cookie dialog accessibility');
 await page.getByRole('checkbox',{name:'Allow analytics cookies'}).check();
 await page.getByRole('button',{name:'Save preferences',exact:true}).click();
 assert.equal(await page.locator('dialog').evaluate(e=>e.open),false);
 assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('modal-open')),false);
 await page.reload();
 assert.equal(await page.locator('[data-cookie-banner]').isVisible(),false);
 await page.getByRole('button',{name:'Cookie settings',exact:true}).click();
 assert(await page.getByRole('checkbox',{name:'Allow analytics cookies'}).isChecked());
 await page.getByRole('button',{name:'Reject non-essential',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.WFHAnalytics.getConsent().analytics),false);
 check('Cookie dialog labels, short-screen scrolling, save, persistence and withdrawal');

 for (const width of [320,768,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto(base+'/privacy.html#cookies');
  await assertAnchor('cookies');
  await page.locator('.legal-nav a[href="#contact-privacy"]').click();
  await assertAnchor('contact-privacy');
  await page.goto(base+'/contact.html#project-inquiry');
  await assertAnchor('project-inquiry');
 }
 check('Direct and clicked anchor headings stay below the sticky header at 320, 768 and 1440px');
 await page.goto(base+'/index.html');
 await page.locator('.project-card h3 a').first().click();
 assert(page.url().endsWith('projects.html#lakeside-custom-home'));
 await assertAnchor('lakeside-custom-home');
 for(const [category,count] of [['custom-homes',2],['renovations',3],['interiors',3],['outdoor',1],['all',6]]){
  await page.locator(`[data-project-filter="${category}"]`).click();
  assert.equal(await page.locator('[data-project-category]:visible').count(),count);
  assert.equal(await page.locator(`[data-project-filter="${category}"]`).getAttribute('aria-pressed'),'true');
 }
 check('Homepage project links and all five portfolio filters');
 await page.goto(base+'/renovations-additions.html');
 assert.match(await page.locator('h1').innerText(),/home you love/);
 const summary=page.locator('summary').first();
 await summary.press('Enter');
 assert(await summary.evaluate(e=>e.parentElement.open));
 check('Renovations route has its own content and FAQ keyboard interaction');

 await page.goto(base+'/contact.html');
 await page.locator('[type="submit"]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'first-name');
 assert.equal(await page.locator('form').evaluate(e=>e.checkValidity()),false);
 assert.match(await page.locator('[type="submit"]').innerText(),/Prepare email/i);
 check('Contact required-field validation and explicit preview email flow');
 await page.goto(base+'/thank-you.html');
 assert.equal(await page.evaluate(()=>window.dataLayer.some(args=>args[0]==='event'&&args[1]==='generate_lead')),false);
 check('Direct thank-you visits do not count as leads');
 await context.close();

 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const fallback=await nojs.newPage();
 await fallback.goto(base+'/index.html');
 assert(await fallback.locator('.site-nav a').first().isVisible());
 assert(await fallback.locator('.intro-copy h2').isVisible());
 await fallback.locator('.site-nav a[href="projects.html"]').click();
 assert.equal(await fallback.locator('[data-project-category]:visible').count(),6);
 check('Navigation, content and all projects remain available without JavaScript');
 await nojs.close();

 const storage=await browser.newContext({viewport:{width:390,height:844}});
 await storage.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage disabled for test')}})});
 const restricted=await storage.newPage();
 await restricted.goto(base+'/index.html');
 await restricted.getByRole('button',{name:'Reject non-essential',exact:true}).click();
 await restricted.getByRole('button',{name:'Cookie settings',exact:true}).click();
 assert.equal(await restricted.getByRole('checkbox',{name:'Allow analytics cookies'}).isChecked(),false);
 await restricted.keyboard.press('Escape');
 assert.equal(await restricted.locator('html').evaluate(e=>e.classList.contains('modal-open')),false);
 check('Cookie controls work when browser storage is unavailable');
 await storage.close();

 const measurement = await browser.newContext({viewport:{width:1280,height:900}});
 await measurement.route('**/tracking-config.v2.js',route=>route.fulfill({contentType:'text/javascript',body:'window.WFH_TRACKING_CONFIG={ga4MeasurementId:"G-TEST123",googleAdsId:"AW-123456",consentStorageKey:"wfh_consent_v1",consentVersion:1};'}));
 let requests = 0;
 await measurement.route('https://www.googletagmanager.com/**',route=>{requests++;return route.fulfill({contentType:'text/javascript',body:'/* Local mock: no measurement is sent. */'});});
 const measured = await measurement.newPage();
 await measured.goto(base+'/index.html');
 assert.equal(requests,0);
 await measured.getByRole('button',{name:'Manage preferences',exact:true}).click();
 await measured.getByRole('checkbox',{name:'Allow analytics cookies'}).check();
 await measured.getByRole('button',{name:'Save preferences',exact:true}).click();
 await measured.waitForFunction(()=>window.dataLayer.some(args=>args[0]==='config'&&args[1]==='G-TEST123'));
 assert.equal(requests,1);
 assert.equal(await measured.evaluate(()=>window.dataLayer.some(args=>args[0]==='config'&&args[1]==='AW-123456')),false);
 await measured.getByRole('button',{name:'Cookie settings',exact:true}).click();
 await measured.getByRole('checkbox',{name:'Allow advertising cookies'}).check();
 await measured.getByRole('button',{name:'Save preferences',exact:true}).click();
 await measured.waitForFunction(()=>window.dataLayer.some(args=>args[0]==='config'&&args[1]==='AW-123456'));
 assert.equal(requests,1);
 await measured.getByRole('button',{name:'Cookie settings',exact:true}).click();
 await measured.getByRole('button',{name:'Reject non-essential',exact:true}).click();
 assert.equal(await measured.evaluate(()=>window.WFHAnalytics.trackEvent('test_event')),false);
 check('Mocked Google tags: no request before consent, independent categories, one script and withdrawal');
 await measurement.close();

 const missing = await browser.newContext({viewport:{width:390,height:844}});
 const errorPage = await missing.newPage();
 for (const prefix of [base, 'https://stefansaladino.github.io/White-Forest-Homes']) {
  await errorPage.route(prefix+'/**', route=>{
   const relative = route.request().url().slice(prefix.length).split('?')[0];
   const file = relative==='/missing/nested' ? '404.html' : relative.slice(1);
   if (!fs.existsSync(path.join(root,file))) return route.fulfill({status:404,body:'Not found'});
   return route.fulfill({status:file==='404.html'?404:200,contentType:mime[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(path.join(root,file))});
  });
  await errorPage.goto(prefix+'/missing/nested');
  assert.equal(await errorPage.locator('a').filter({hasText:'Return home'}).getAttribute('href'),'index.html');
  assert.equal(await errorPage.evaluate(()=>document.querySelector('.status-page a').href),prefix+'/index.html');
  assert.equal(await errorPage.evaluate(()=>document.querySelector('main').getBoundingClientRect().width>0),true);
  assert.equal(await errorPage.evaluate(()=>getComputedStyle(document.querySelector('.site-header')).position),'sticky');
  assert.equal(await errorPage.evaluate(()=>typeof window.WFHAnalytics),'object');
 }
 check('Nested 404 navigation and resources resolve at root and GitHub Pages project paths');
 await missing.close();
}
let browser;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'],headless:true});
 const base = `http://127.0.0.1:${server.address().port}`;
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.addInitScript(()=>{localStorage.setItem('wfh_consent_v1',JSON.stringify({version:1,analytics:false,advertising:false}));});
 const page=await context.newPage();
 page.on('pageerror',e=>results.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)results.errors.push(`${r.status()} ${r.url()}`)});
 for(const file of process.argv.includes('--interactions-only') ? [] : pages){
  for(const [width,height] of sizes){
   await page.setViewportSize({width,height});
   await page.goto(base+'/White-Forest-Homes/'+file);
   const layout=await page.evaluate(()=>{
    const vw=document.documentElement.clientWidth;
    const issues=[];
    for(const el of document.querySelectorAll('main *, .site-footer *, .site-header *')){
     if(el.closest('[hidden],[inert]')||!el.checkVisibility({checkVisibilityCSS:true}))continue;
     const b=el.getBoundingClientRect();
     if(b.width&& (b.right>vw+1||b.left< -1))issues.push({tag:el.tagName,cls:el.className,text:el.textContent.trim().slice(0,45),left:b.left,right:b.right});
     if(/^H[1-4]$/.test(el.tagName)&&el.scrollWidth>el.clientWidth+2)issues.push({heading:el.textContent,scroll:el.scrollWidth,client:el.clientWidth});
    }
    return {viewport:vw,scroll:document.documentElement.scrollWidth,issues};
   });
   results.layouts.push({file,width,height,...layout});
   if(width===390||width===1440){
    await page.addScriptTag({content:axe});
    const a11y=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});
    if(a11y.length)results.a11y.push({file,width,violations:a11y});
   }
   if(process.argv.includes('--screenshots')&&(width===390||width===1440||width===768)&&['index.html','contact.html','projects.html','services.html','renovations-additions.html','privacy.html'].includes(file)){
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += height) {
     await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
     await page.waitForTimeout(40);
    }
    await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({path:path.join(output,file.replace('.html',`-${width}.png`)),fullPage:true});
   }
  }
  results.links.push({file,links:await page.locator('a').evaluateAll(anchors=>anchors.map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')||a.textContent.trim(),heading:a.querySelector('h1,h2,h3')?.textContent}))) });
  console.log(`Checked ${file}`);
 }
 await runInteractions(browser, base);
 await context.close();
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(results,null,2));
 const problems = results.layouts.filter(r => r.issues.length || r.scroll > r.viewport + 1);
 if (problems.length || results.a11y.length || results.errors.length) process.exitCode = 1;
 console.log(JSON.stringify({layoutCases:results.layouts.length,overflowCases:results.layouts.filter(r=>r.issues.length||r.scroll>r.viewport+1),a11y:results.a11y,errors:[...new Set(results.errors)]},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close();});

const {chromium}=require('C:/Users/user/Desktop/Documents/Python/MyHarness/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
const out=path.resolve(__dirname,'../validation');
const report={diagrams:[],viewports:[],errors:[]};
(async()=>{
  execFileSync('python',['-X','utf8','-c',`
import runpy, sys
from pathlib import Path
ns=runpy.run_path(sys.argv[1])
svg=ns['flow_svg'](
 ['새로운업무절차에서긴제목을공백없이사용하는경우','DOWNLOAD_AND_VERIFY_THE_LATEST_APPROVED_SOURCE_DOCUMENT','원문 & 기준 <확인>','자료 확인\\n추가 검증'],
 ['긴 부가 설명도 영역 안에서 자동으로 줄바꿈되어야 합니다','공백없는영문과한글을모두검사합니다','기호를 원문 그대로 표시합니다','줄 수가 늘어나면 상자와 그림 높이도 늘어납니다'])
Path(sys.argv[2]).write_text(svg,encoding='utf-8')
`,path.join(__dirname,'build.py'),path.join(out,'diagram-stress.svg')],{encoding:'utf8'});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../p-harness-guide.html')).href);
  const diagrams=await page.locator('figure img[src^="data:image/svg+xml"]').evaluateAll(images=>images.map(i=>({title:i.alt,src:i.src})));
  // Image completeness cannot detect text escaping a rectangle inside an SVG.
  const svgPage=await browser.newPage({viewport:{width:1200,height:900}});
  async function inspectSVG(title,source){
    await svgPage.setContent('<style>body{margin:0}svg{display:block}</style>'+source);
    await svgPage.evaluate(()=>document.fonts.ready);
    const metrics=await svgPage.evaluate(()=>{
      const svg=document.querySelector('svg'),view=svg.viewBox.baseVal;
      const cards=[...svg.querySelectorAll('rect[rx]')];
      const failures=[];
      for(const t of svg.querySelectorAll('text')){
        const r=t.getBBox(),x=+t.getAttribute('x'),y=+t.getAttribute('y');
        const owner=cards.find(c=>x>=+c.getAttribute('x')&&x<+c.getAttribute('x')+ +c.getAttribute('width')&&y>=+c.getAttribute('y')&&y<+c.getAttribute('y')+ +c.getAttribute('height'));
        if(owner){
          const c=owner.getBBox(),pad=14;
          if(r.x<c.x+pad-1||r.x+r.width>c.x+c.width-pad+1||r.y<c.y+pad-1||r.y+r.height>c.y+c.height-pad+1)failures.push({text:t.textContent,type:'text outside card safe area',textBounds:{x:r.x,y:r.y,width:r.width,height:r.height},card:{x:c.x,y:c.y,width:c.width,height:c.height}});
        }else if(r.x<0||r.y<0||r.x+r.width>view.width||r.y+r.height>view.height)failures.push({text:t.textContent,type:'text outside SVG'});
      }
      for(const node of svg.querySelectorAll('.flow-node')){
        const title=[...node.querySelectorAll('[data-role="title"]')].map(t=>t.textContent).join('');
        if(title.replace(/\s/g,'')!==node.dataset.label.replace(/\s/g,''))failures.push({type:'title text omitted',label:node.dataset.label});
        const groups=['number','title','subtitle'].map(role=>[...node.querySelectorAll('[data-role="'+role+'"]')].map(t=>t.getBBox()));
        for(let i=0;i<groups.length-1;i++)if(groups[i].length&&groups[i+1].length&&Math.max(...groups[i].map(r=>r.y+r.height))+6>Math.min(...groups[i+1].map(r=>r.y)))failures.push({type:'vertical label overlap',label:node.dataset.label});
      }
      return {nodes:cards.length,textLines:svg.querySelectorAll('text').length,width:view.width,height:view.height,failures};
    });
    report.diagrams.push({title,...metrics});
  }
  for(const diagram of diagrams){
    await inspectSVG(diagram.title,Buffer.from(diagram.src.split(',')[1],'base64').toString('utf8'));
  }
  const stressPath=path.join(out,'diagram-stress.svg');
  if(fs.existsSync(stressPath))await inspectSVG('Long Korean, unbroken Latin and escaped characters',fs.readFileSync(stressPath,'utf8'));
  await svgPage.close();
  for(const width of [1920,1440,1280,1024,768,390]){
    await page.setViewportSize({width,height:width<600?844:1080});
    await page.evaluate(()=>{document.querySelectorAll('details').forEach(e=>e.open=true);document.querySelectorAll('img[loading]').forEach(i=>i.loading='eager')});
    await page.waitForFunction(()=>[...document.querySelectorAll('figure img')].every(i=>i.complete&&i.naturalWidth>0));
    // The document animates its reading-column margin for 150 ms at breakpoints.
    await page.waitForTimeout(180);
    const metrics=await page.evaluate(()=>{
      const textFailures=[],overlaps=[];
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let node,checked=0;
      while(node=walker.nextNode()){
        const p=node.parentElement;
        if(!node.textContent.trim()||!p||p.closest('script,style,[aria-hidden="true"],.skip,.inline-link')||!p.getClientRects().length||getComputedStyle(p).visibility==='hidden')continue;
        const owner=p.closest('td,th,button,.card,.callout,.flow-detail,.hero-copy,.hero-bottom>div,.chapter-head,.before-cell,.after-cell,.request-factor,.shot-legend li,.prompt-box,figcaption,summary,.skill-leaf,.model-half,.effort-half,.network-branches>a,.output-paper,.map-side>a,.screen-key,.workspace-title,.component-dock>a')||p;
        const r=owner.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);
        for(const line of range.getClientRects()){
          if(line.width<1||line.height<1)continue;
          checked++;
          if(line.left<r.left-2||line.right>r.right+2||line.top<r.top-3||line.bottom>r.bottom+3)textFailures.push({section:p.closest('.block,.chapter')?.id,owner:owner.className||owner.tagName,text:node.textContent.trim().slice(0,90),line:{x:line.left,y:line.top,w:line.width,h:line.height},bounds:{x:r.left,y:r.top,w:r.width,h:r.height}});
        }
      }
      const groups=[...document.querySelectorAll('.grid2,.grid3,.request-map,.checklist,.link-grid,.hero-bottom,.shot-legend,.toolbar,.hero-top,.screen-guide,.steps li,.system-title,.system-map,.book-entry,.component-dock,.choice-plate,.work-scale,.skill-workbench,.skill-shelves,.source-network,.network-branches,.network-branches>a,.file-journey,.output-shelf,.screen-atlas,.screen-keys')];
      for(const group of groups){
        const items=[...group.children].filter(e=>e.getClientRects().length);
        for(let a=0;a<items.length;a++)for(let b=a+1;b<items.length;b++){
          const r=items[a].getBoundingClientRect(),s=items[b].getBoundingClientRect();
          if(Math.min(r.right,s.right)-Math.max(r.left,s.left)>2&&Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top)>2)overlaps.push({group:group.className,a:items[a].textContent.slice(0,60),b:items[b].textContent.slice(0,60)});
        }
      }
      return {width:innerWidth,chapters:document.querySelectorAll('.chapter').length,sections:document.querySelectorAll('.block').length,checkedTextLines:checked,overflow:document.documentElement.scrollWidth>innerWidth,missingImages:[...document.querySelectorAll('figure img')].filter(i=>!i.complete||!i.naturalWidth).length,textFailures,overlaps};
    });
    report.viewports.push(metrics);
  }
  await page.setViewportSize({width:1920,height:1080});
  for(const id of ['concept-harness','files-ecm','model-selection','model-lineup','prompt-six','skills-use','skills-shortcut','skills-build','mcp-browse','mcp-routing']){
    await page.locator('#'+id).screenshot({path:path.join(out,'review-'+id+'.png')});
  }
  await browser.close();
  fs.writeFileSync(path.join(out,'layout-audit.json'),JSON.stringify(report,null,2));
  const failures=report.diagrams.reduce((n,d)=>n+d.failures.length,0)+report.viewports.reduce((n,v)=>n+v.textFailures.length+v.overlaps.length+Number(v.overflow)+v.missingImages,0)+report.errors.length;
  console.log(JSON.stringify({diagramFailures:report.diagrams.filter(d=>d.failures.length),viewports:report.viewports.map(v=>({width:v.width,checked:v.checkedTextLines,textFailures:v.textFailures.length,overlaps:v.overlaps.length,overflow:v.overflow})),failures}));
  if(failures)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

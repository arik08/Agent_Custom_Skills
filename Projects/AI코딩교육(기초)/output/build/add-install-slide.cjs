const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
async function main(){
 let html=fs.readFileSync(file,'utf8');
 if(html.includes('class="slide install-slide"'))throw Error('Slide already exists');
 const sources={
  vscode:'https://code.visualstudio.com/assets/apple-touch-icon.png',
  codex:'https://openai.gallerycdn.vsassets.io/extensions/openai/chatgpt/26.5917.62051/1790149959307/Microsoft.VisualStudio.Services.Icons.Default',
  korean:'https://MS-CEINTL.gallerycdn.vsassets.io/extensions/ms-ceintl/vscode-language-pack-ko/1.131.2026090407/1788507964523/Microsoft.VisualStudio.Services.Icons.Default',
  app:'https://learn.chatgpt.com/favicon.png',
  python:'https://www.python.org/static/apple-touch-icon-144x144-precomposed.png',
  git:'https://git-scm.com/images/logo@2x.png',
  node:'https://nodejs.org/static/images/favicons/favicon.png'
 };
 const icons={};
 for(const [key,url] of Object.entries(sources)){
  const r=await fetch(url);if(!r.ok)throw Error(key+': '+r.status);
  const mime=r.headers.get('content-type').split(';')[0];if(!mime.startsWith('image/'))throw Error(key+' not image');
  icons[key]='data:'+mime+';base64,'+Buffer.from(await r.arrayBuffer()).toString('base64');
 }
 const img=(key,alt)=>`<img src="${icons[key]}" alt="${alt} 아이콘" width="56" height="56">`;
 const row=(key,name,desc,url,label)=>`<a class="install-tool" href="${url}" target="_blank" rel="noopener noreferrer">${img(key,name)}<span><strong>${name}</strong><small>${desc}</small></span><em>${label} ↗</em></a>`;
 const slide=`<section class="slide install-slide" data-index="17" data-section="바이브 코딩 준비하기" data-noclick="" aria-label="18. 바이브 코딩, 무엇을 설치하면 될까요?" inert="" aria-hidden="true">
<header><div class="eyebrow">AI CODING WORKSHOP <span>바이브 코딩 준비하기</span></div><h1>바이브 코딩, 무엇을 설치하면 될까요?</h1><p class="lead">코딩 도구는 두 가지 방법 중 하나를 선택하고, Python 실습을 위한 실행 프로그램을 준비합니다.</p></header>
<main class="slide-body install-body">
<div class="install-choices">
 <div class="install-choice"><div class="install-caption"><b>방법 A</b><h3>VS Code + 확장 프로그램</h3></div>
 ${row('vscode','Visual Studio Code','작업 폴더와 코드를 열어 보는 편집기','https://code.visualstudio.com/download','다운로드')}
 ${row('codex','Codex 확장','OpenAI 공식 확장 · 코드 작성·수정·실행','https://marketplace.visualstudio.com/items?itemName=openai.chatgpt','확장 설치')}
 ${row('korean','한국어 확장','Microsoft 공식 · VS Code 메뉴 한글화','https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ko','확장 설치')}
 <p class="install-note">VS Code 설치 → 두 확장 설치 → Codex에 로그인<br>한국어 확장은 편의 기능이며, 코딩 실행의 필수 조건은 아닙니다.</p></div>
 <div class="install-or">또는</div>
 <div class="install-choice install-app"><div class="install-caption"><b>방법 B</b><h3>ChatGPT 공식 PC 앱</h3></div>
 ${row('app','ChatGPT','공식 PC 앱에서 Codex로 코딩하기','https://learn.chatgpt.com/docs/quickstart','설치 안내')}
 <div class="install-app-flow"><span>앱 설치 · 계정 로그인</span><i>↓</i><span>Codex 선택 · 작업 폴더 열기</span><i>↓</i><strong>만들고 싶은 프로그램 요청하기</strong></div>
 <p class="install-note">계정에서 Codex를 사용할 수 있는지 미리 확인하세요.</p></div>
</div>
<div class="install-extras">
 <div class="install-runtime"><span class="install-kicker">PYTHON 실습용</span>${row('python','Python','Python 코드를 내 PC에서 실행','https://www.python.org/downloads/','다운로드')}<p>설치 확인: <code>python --version</code></p></div>
 <div class="install-optional"><span class="install-kicker">선택 · 필요할 때 추가</span><div class="install-optional-row">
 ${row('git','Git','변경 이력 저장·복구 · 설치 권장','https://git-scm.com/install/windows','다운로드')}
 ${row('node','Node.js','웹 앱 개발 도구 실행 · LTS 선택','https://nodejs.org/en/download','다운로드')}
 </div><p>HTML 파일만 브라우저에서 열어 보는 실습에는 Node.js가 없어도 됩니다.</p></div>
</div>
</main><div class="bridge">설치 외 준비: <strong>ChatGPT 계정 · 인터넷 연결 · 실습용 폴더 · 결과를 확인할 브라우저(Edge / Chrome)</strong></div>
</section>
`;
 const css=`\n/* Installation guide inserted before the package/environment lesson. */
.install-body{padding-top:20px!important}.install-choices{display:grid;grid-template-columns:1fr 76px 1fr;align-items:stretch}.install-choice{background:#fff;border-top:3px solid var(--blue);padding:19px 28px 16px}.install-caption{display:flex;gap:18px;align-items:center;margin-bottom:15px}.install-caption>b{font-size:20px;color:var(--blue);white-space:nowrap}.install-caption h3{font-size:31px}.install-or{display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:24px}.install-tool{display:flex;align-items:center;gap:18px;color:var(--ink);text-decoration:none;padding:9px 0;border-bottom:1px solid var(--line);min-width:0}.install-tool img{width:56px;height:56px;object-fit:contain;flex-shrink:0}.install-tool>span{min-width:0;flex:1}.install-tool strong{display:block;font-size:28px;line-height:1.3}.install-tool small{display:block;font-size:21px;line-height:1.5;color:var(--muted);margin-top:3px}.install-tool em{font-size:20px;white-space:nowrap;text-decoration:underline;text-underline-offset:5px}.install-tool:hover{background:var(--pale)}.install-tool:focus-visible{outline:3px solid var(--blue)!important;outline-offset:4px}.install-note{font-size:20px;line-height:1.6;margin-top:16px;color:var(--muted)}.install-app-flow{display:flex;flex-direction:column;align-items:center;padding:23px 0 14px;gap:8px;font-size:26px}.install-app-flow i{font-style:normal;color:#739bb1;font-size:22px}.install-app-flow strong{color:var(--blue)}.install-extras{display:grid;grid-template-columns:540px 1fr;gap:30px;margin-top:27px}.install-kicker{display:block;font-size:20px;color:var(--blue);font-weight:600;letter-spacing:.5px}.install-extras .install-tool{border:0;padding:13px 0 9px;gap:15px}.install-extras .install-tool strong{font-size:27px}.install-extras .install-tool small{font-size:20px}.install-extras .install-tool em{font-size:19px}.install-extras p{font-size:20px;color:var(--muted);line-height:1.5;margin-top:7px}.install-extras code{font-family:Consolas,monospace;font-size:22px;color:var(--deep)}.install-optional{border-left:1px solid var(--line);padding-left:30px}.install-optional-row{display:grid;grid-template-columns:1fr 1fr;gap:30px}.install-slide .bridge{font-size:23px}
`;
 html=html.replace(/<section class="slide\b[^>]*>/g,tag=>tag.replace(/data-index="(\d+)"/,(_,n)=>`data-index="${+n>=17?+n+1:n}"`).replace(/aria-label="(\d+)\./,(_,n)=>`aria-label="${+n>=18?+n+1:n}.`));
 html=html.replace('<section class="slide package-slide"',slide+'<section class="slide package-slide"');
 html=html.replace('</style>',css+'</style>');
 fs.writeFileSync(file,html);
 fs.writeFileSync(path.join(root,'validation/install-slide-sources.json'),JSON.stringify({checked:'2026-09-24',icons:sources,documentation:'https://learn.chatgpt.com/docs/quickstart',notes:['Official download pages and Marketplace extensions','Icons embedded in HTML for offline viewing','Downloads require internet']},null,2));
 console.log('Inserted slide 18; total slides: '+[...html.matchAll(/<section class="slide\b/g)].length);
}
main().catch(e=>{console.error(e);process.exit(1)});

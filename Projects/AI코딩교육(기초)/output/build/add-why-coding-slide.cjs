const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let html = fs.readFileSync(target, 'utf8');
assert(!html.includes('class="slide why-coding-slide"'), 'Motivation slide already exists');
fs.copyFileSync(target, path.join(root, 'validation/why-coding-before.html'));

const sourceImage = 'C:/Users/Myeongcheol/.codex/generated_images/01a0cf20-2d14-7450-942c-305b84cf7cb2/exec-d2b48f19-8dd3-4089-a281-5d8b66a3cc48.png';
const imageKey = 'assets/why-coding-collaboration.png';
fs.copyFileSync(sourceImage, path.join(root, imageKey));

const css = `
    <!-- 코딩을 배우는 이유: 새 2페이지 -->
    <style id="why-coding-styles">
      .why-coding-slide .why-layout {
        display: grid;
        grid-template-columns: 690px minmax(0, 1fr);
        gap: 64px;
        padding-top: 34px;
        padding-bottom: 58px;
        align-items: center;
      }
      .why-scene {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 650px;
      }
      .why-scene img {
        display: block;
        width: 690px;
        height: 650px;
        object-fit: contain;
      }
      .why-reasons {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 42px;
        row-gap: 24px;
        align-content: center;
      }
      .why-reason {
        border-top: 2px solid var(--line);
        padding-top: 16px;
      }
      .why-reason-ai {
        border-top: 3px solid var(--blue);
        padding-top: 15px;
      }
      .why-number {
        display: block;
        font-size: 25px;
        line-height: 1.2;
        font-weight: 600;
        color: var(--blue);
        margin-bottom: 13px;
      }
      .why-reason h2 {
        font-size: 32px;
        line-height: 1.35;
        font-weight: 600;
        letter-spacing: -0.3px;
        margin-bottom: 12px;
      }
      .why-reason-ai h2 {
        color: var(--blue);
      }
      .why-reason p {
        font-size: 24px;
        line-height: 1.55;
        color: var(--muted);
      }
      .why-reason p strong {
        color: var(--ink);
      }
      .why-coding-slide .bridge {
        font-size: 31px;
        text-align: center;
        line-height: 1.5;
      }
      .why-coding-slide.enter .why-scene {
        animation: appear 600ms 90ms both;
      }
      .why-coding-slide.enter .why-reason {
        animation: appear 360ms both;
      }
      .why-coding-slide.enter .why-reason:nth-child(1) { animation-delay: 160ms; }
      .why-coding-slide.enter .why-reason:nth-child(2) { animation-delay: 260ms; }
      .why-coding-slide.enter .why-reason:nth-child(3) { animation-delay: 360ms; }
      .why-coding-slide.enter .why-reason:nth-child(4) { animation-delay: 460ms; }
      @media (prefers-reduced-motion: reduce) {
        .why-coding-slide .why-scene,
        .why-coding-slide .why-reason { animation: none !important; }
      }
      @media print {
        .why-coding-slide .why-scene,
        .why-coding-slide .why-reason { animation: none !important; opacity: 1 !important; }
      }
    </style>
`;
const slide = `      <!-- SLIDE 02 | AI 시대, 왜 우리도 코딩을 알아야 할까요? -->
      <section
        class="slide why-coding-slide"
        data-index="1"
        data-section="코딩을 배우는 이유"
        aria-label="2. AI 시대, 왜 우리도 코딩을 알아야 할까요?"
        inert=""
        aria-hidden="true"
      >
        <header>
          <div class="eyebrow">AI CODING WORKSHOP <span>코딩을 배우는 이유</span></div>
          <h1>AI 시대, 왜 우리도 <em>코딩을 알아야 할까요?</em></h1>
        </header>
        <main class="slide-body why-layout">
          <figure class="why-scene">
            <img
              data-asset-src="assets/why-coding-collaboration.png"
              alt="업무 담당자가 개선할 내용을 화면에서 짚고, AI와 개발자가 함께 업무 도구를 만드는 장면"
              width="1280"
              height="1280"
            />
          </figure>
          <div class="why-reasons">
            <article class="why-reason">
              <span class="why-number">01</span>
              <h2>코딩도 누구나 활용하는<br />업무 도구가 되어갑니다</h2>
              <p>컴퓨터와 엑셀이 일상적인 업무 도구가 되었듯, AI의 발전으로 코딩도 <strong>일반 직원이 활용할 수 있는 기술</strong>로 넓어지고 있습니다.</p>
            </article>
            <article class="why-reason why-reason-ai">
              <span class="why-number">02</span>
              <h2>더 똑똑해지는 AI를,<br />더 잘 활용하기 위해</h2>
              <p>AI가 할 수 있는 일이 많아져도, 우리가 가능성을 모르면 활용은 제한됩니다. 기초를 알면 <strong>더 좋은 방법을 요청하고, 제안을 이해하며, 결과를 판단</strong>할 수 있습니다.</p>
            </article>
            <article class="why-reason">
              <span class="why-number">03</span>
              <h2>업무의 불편을 아는 사람이,<br />개선을 주도하기 위해</h2>
              <p>무엇이 불편하고 어떻게 바뀌어야 하는지는 담당자가 가장 잘 압니다. AI와 직접 만들고 고쳐 나가면 <strong>실제 업무에 더 잘 맞는 도구</strong>를 만들 수 있습니다.</p>
            </article>
            <article class="why-reason">
              <span class="why-number">04</span>
              <h2>개발자와 더 원활하게<br />협업하기 위해</h2>
              <p>직접 모든 것을 만들지 않더라도, 개발을 이해하면 <strong>요구사항을 정확히 전달</strong>하고 구현 방법과 결과를 함께 논의할 수 있습니다.</p>
            </article>
          </div>
        </main>
        <div class="bridge">코딩의 기초는, <strong>내가 가진 업무 지식</strong>과 <strong>발전하는 AI의 능력</strong>을 연결해 줍니다.</div>
      </section>

`;

// Preserve each existing slide's identity while updating its displayed position.
html = html.replace(/<section\b[^>]*class="slide\b[^\"]*"[^>]*>/g, tag =>
  tag.replace(/data-index="(\d+)"/, (_, n) => `data-index="${Number(n) >= 1 ? Number(n) + 1 : n}"`)
    .replace(/aria-label="(\d+)\./, (_, n) => `aria-label="${Number(n) >= 2 ? Number(n) + 1 : n}.`));
html = html.replace(/<!-- SLIDE (\d+) \|/g, (_, n) => `<!-- SLIDE ${String(Number(n) >= 2 ? Number(n) + 1 : Number(n)).padStart(2, '0')} |`);
html = html.replace('body의 SLIDE 01~22', 'body의 SLIDE 01~23');
html = html.replace(/(<span id="page-label"[^>]*>)01 \/ \d+(<\/span>)/, '$101 / 23$2');
html = html.replace('.slide[data-index="13"] .columns', '.slide[data-index="14"] .columns');
html = html.replace('      <!-- SLIDE 03 | AI 에이전트에 요청해 테트리스 만들기 -->', slide + '      <!-- SLIDE 03 | AI 에이전트에 요청해 테트리스 만들기 -->');
html = html.replace('  </head>', css + '  </head>');

// Demo-local positions stay 1/2; derive them from actual slide ownership.
const oldTetris = `                active = index;
                if (index === 1) resetWorkshop();
                if (index === 2 && !built) {`;
assert(html.includes(oldTetris));
html = html.replace(oldTetris, `                active = roots.findIndex(root => Number(root.closest(".slide").dataset.index) === index) + 1;
                if (active === 1) resetWorkshop();
                if (active === 2 && !built) {`);
const oldHandoff = `                if (index !== 4) stopMotion();
                window.handoffGame.navigate(index === 4);`;
assert(html.includes(oldHandoff));
html = html.replace(oldHandoff, `                const isActive = Number(document.querySelector(".handoff-sequence").closest(".slide").dataset.index) === index;
                if (!isActive) stopMotion();
                window.handoffGame.navigate(isActive);`);

html = html.replace(/(<script id="embedded-assets"[^>]*>)([\s\S]*?)(<\/script>)/, (_, start, json, end) => {
  const assets = JSON.parse(json);
  assets[imageKey] = 'data:image/png;base64,' + fs.readFileSync(path.join(root, imageKey)).toString('base64');
  return start + '\n' + JSON.stringify(assets, null, 2) + '\n    ' + end;
});
assert.equal([...html.matchAll(/<section\s+class="slide\b/g)].length, 23);
assert(html.includes(slide));
fs.writeFileSync(target, html);
console.log('Inserted illustrated motivation slide; 23 slides; demo navigation follows slide ownership.');

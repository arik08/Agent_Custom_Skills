// Format the finished single-file deck while keeping embedded binary data last.
// Set PRETTIER_MODULE to an installed Prettier module when it is not local.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prettier = require(process.env.PRETTIER_MODULE || 'prettier');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const marker = '<!-- EMBEDDED ASSETS: all large data lives below this line. -->';
const labels = [
  ['lesson-additions-styles', '추가 수업 · 설치 안내 · 마무리'],
  ['deck-styles', '기본 테마 · 레이아웃 · 시연 화면 · 모션'],
  ['codex-summary-styles', '파일 변경 요약'],
  ['ide-size-styles', '편집기 시연 크기'],
  ['codex-summary-spacing-styles', '변경 요약 간격'],
  ['codex-log-styles', '도구 실행 로그'],
  ['handoff-mode-styles', '챗봇 · 에이전트 전환'],
  ['code-column-styles', '코드 열 정렬'],
  ['code-selection-styles', '코드 선택 범위'],
  ['slide06-foundations-style', '06장 · 프로그래밍 기초'],
  ['candidate-table-styles', '후보 검토 표'],
  ['run-example-styles', '실행 예시 색상과 구성'],
  ['run-example-spacing-styles', '실행 예시 간격'],
  ['hybrid-example-styles', '혼합형 실행 예시 간격'],
];
(async () => {
  const original = fs.readFileSync(process.argv[2] || target, 'utf8');
  assert(original.includes(marker), 'Consolidate the embedded assets first');
  assert(!original.includes('id="structured-deck-source"'), 'Source is already structured');
  const split = original.indexOf(marker);
  const footer = original.slice(split, original.lastIndexOf('</body>'));
  let html = original.slice(0, split) + '<!-- ASSET_FOOTER_PLACEHOLDER -->\n</body></html>';
  // A literal HTML comment opener confuses VS Code's embedded script parser.
  // Hex escapes preserve the exact same regular expression in the browser.
  assert(html.includes('html: /(?<comment><!--'));
  html = html.replace('html: /(?<comment><!--', 'html: /(?<comment>\\x3C!--');
  const styles = [];
  html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => {
    const [id, label] = labels[styles.length] || [];
    assert(id, 'Unexpected style block; label it before formatting');
    const existingId = attrs.match(/\bid="([^"]+)"/)?.[1];
    assert(!existingId || existingId === id, `Unexpected style ID: ${existingId}`);
    styles.push(`<!-- ${label} -->\n<style id="${id}">\n${css}\n</style>`);
    return '';
  });
  assert.equal(styles.length, labels.length);
  html = html.replace('</head>', `\n<!-- 01. 화면 스타일: 위에서 아래 순서대로 적용 -->\n${styles.join('\n\n')}\n</head>`);
  html = html.replace(/<body([^>]*)>/, '<body$1>\n<!-- 02. 슬라이드 본문: 그림은 data-asset-src의 이름으로 참조 -->');
  html = html.replace(/<section\b([^>]*class="slide\b[^>]*)>/g, (tag, attrs) => {
    const index = Number(attrs.match(/data-index="(\d+)"/)[1]) + 1;
    const title = attrs.match(/aria-label="([^"]+)"/)?.[1] || '';
    return `\n<!-- SLIDE ${String(index).padStart(2, '0')} | ${title.replace(/^\d+\.\s*/, '').replaceAll('--', '—')} -->\n${tag}`;
  });
  let scriptIndex = 0;
  const scriptIds = ['deck-restoration', 'embedded-asset-loader', 'deck-glossary', 'deck-app', 'run-examples'];
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (tag, attrs, code) => {
    const id = scriptIds[scriptIndex++];
    assert(id, 'Unexpected executable script');
    return /\bid=/.test(attrs) ? tag : `<script id="${id}"${attrs}>${code}</script>`;
  });
  assert.equal(scriptIndex, scriptIds.length);
  html = html.replace('<script id="embedded-asset-loader">',
    '<!-- 03. 동작 코드: 자산 연결 → 용어 사전 → 시연과 탐색 → 실행 예시 -->\n<script id="embedded-asset-loader">');
  html = html.replace(/<!doctype html>/i, `<!doctype html>
<!--
  AI CODING 기초교육 — 편집용 안내
  01. head의 style: 테마와 화면별 스타일
  02. body의 SLIDE 01~22: 슬라이드 내용
  03. body의 script: 자산 연결, 용어 사전, 시연과 슬라이드 탐색
  04. 맨 아래 EMBEDDED ASSETS: 글꼴, 이미지, 표지 3D 화면의 원본 데이터

  이미지 이름은 하단 JSON의 키입니다. 별도 이미지 파일 없이 실행됩니다.
  화면이나 문구를 수정할 때는 01~03 구역을 편집하세요.
-->
<!-- id="structured-deck-source" -->`);
  // Code examples also use CSS white-space: pre on ordinary <code> elements.
  // Keep their text byte-for-byte; a formatter cannot infer that from HTML alone.
  const codeFragments = [];
  html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<(pre|code|textarea)\b([^>]*)>([\s\S]*?)<\/\2>/g,
    (whole, rawTag, tag, attrs, content) => {
      if (rawTag) return whole;
      const token = `PRESERVED_CODE_FRAGMENT_${codeFragments.length}`;
      codeFragments.push({ token, content });
      return `<${tag}${attrs}>${token}</${tag}>`;
    });
  html = await prettier.format(html, {
    parser: 'html', printWidth: 100, tabWidth: 2, useTabs: false,
    htmlWhitespaceSensitivity: 'css', embeddedLanguageFormatting: 'auto', endOfLine: 'lf',
  });
  for (const { token, content } of codeFragments) html = html.replace(token, () => content);
  html = html.replace('<!-- ASSET_FOOTER_PLACEHOLDER -->',
    '<!-- 04. 내장 데이터: 이 아래의 긴 Base64는 원본 자산이므로 그대로 유지 -->\n' + footer.trim());
  assert.equal((html.match(/;base64,/g) || []).length, (original.match(/;base64,/g) || []).length);
  fs.writeFileSync(target, html);
  const appPath = path.join(__dirname, 'app.js');
  const app = fs.readFileSync(appPath, 'utf8');
  assert(app.includes('html: /(?<comment><!--') || app.includes('html: /(?<comment>\\x3C!--'));
  fs.writeFileSync(appPath, app.replace('html: /(?<comment><!--', 'html: /(?<comment>\\x3C!--'));
  console.log(JSON.stringify({ styleSections: styles.length, scripts: scriptIndex,
    sourceLines: html.slice(0, html.indexOf(marker)).split('\n').length,
    sourceBytes: Buffer.byteLength(html.slice(0, html.indexOf(marker))), bytes: Buffer.byteLength(html) }));
})().catch(error => { console.error(error); process.exitCode = 1; });

const fs = require('fs');
const path = require('path');
const output = path.resolve(__dirname, '../..');
const file = path.join(output, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let html = fs.readFileSync(file, 'utf8');
const image = fs.readFileSync(path.join(output, 'assets/bob-ross-easy-v2.png')).toString('base64');
const target = /img\.src='data:image\/png;base64,[A-Za-z0-9+/=]+';img\.alt='참, 쉽죠\? 테트리스 블록을 그리는 밥 로스 패러디'/g;
if ([...html.matchAll(target)].length !== 1) throw new Error('Expected one result illustration');
html = html.replace(target, `img.src='data:image/png;base64,${image}';img.alt='어때요, 참 쉽죠? 테트리스 블록을 그리는 밥 로스 패러디'`);
const anchor = '.handoff-state.has-result-art img{display:block;width:100%;height:auto;max-height:215px;object-fit:contain}';
if (!html.includes(anchor)) throw new Error('Missing result artwork styles');
html = html.replace(anchor, anchor + `
/* Draw attention once when the result illustration appears. */
.slide.is-active .handoff-state.has-result-art img{transform-origin:50% 80%;animation:bob-ross-enter 900ms cubic-bezier(.22,.7,.3,1) both}
@keyframes bob-ross-enter{
  0%{opacity:0;transform:translateY(30px) scale(.72) rotate(-4deg)}
  48%{opacity:1;transform:translateY(-8px) scale(1.045) rotate(1.5deg)}
  72%{opacity:1;transform:translateY(3px) scale(.985) rotate(-.6deg)}
  100%{opacity:1;transform:translateY(0) scale(1) rotate(0)}
}
@media(prefers-reduced-motion:reduce){.slide.is-active .handoff-state.has-result-art img{animation:none;opacity:1;transform:none}}
@media print{.slide.is-active .handoff-state.has-result-art img{animation:none;opacity:1;transform:none}}
`);
fs.writeFileSync(file, html);
console.log('Updated embedded illustration and result entrance animation.');

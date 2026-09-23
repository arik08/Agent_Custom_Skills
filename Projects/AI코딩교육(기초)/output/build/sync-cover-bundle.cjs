// Update only the cover application, preserving later edits to the finished deck.
const fs = require('node:fs');
const path = require('node:path');
const target = path.resolve(__dirname, '../260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const source = fs.readFileSync(path.join(__dirname, 'cover-diorama.html'), 'utf8');
const scripts = html => [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const assetScript = scripts(source)[0][1];
const app = scripts(source)[1][1];
const decode = text => text.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const encode = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function replaceApp(html) {
  const entries = scripts(html);
  if (entries.length !== 3) throw Error('Unexpected cover script structure');
  for (const index of [1,0]) {
    const old=entries[index],body=index===1?app:assetScript;
    html=html.slice(0,old.index)+'<script>'+body+'</script>'+html.slice(old.index+old[0].length);
  }
  return html;
}
let html = fs.readFileSync(target, 'utf8');
let count = 0;
html = html.replace(/(<iframe id="cover-diorama"[^>]*srcdoc=")([^"]*)(")/, (_, start, body, end) => {
  count++; return start + encode(replaceApp(decode(body))) + end;
});
html = html.replace(/(<script id="cover-diorama-data"[^>]*>)([\s\S]*?)(<\/script>)/, (_, start, body, end) => {
  count++; return start + Buffer.from(replaceApp(Buffer.from(body, 'base64').toString('utf8'))).toString('base64') + end;
});
const expectedCopies = html.includes('id="embedded-assets"') ? 1 : 2;
if (count !== expectedCopies) throw Error(`Expected ${expectedCopies} embedded cover copies`);
fs.writeFileSync(target, html);
console.log(`Updated ${count} embedded cover application(s); other deck content preserved.`);

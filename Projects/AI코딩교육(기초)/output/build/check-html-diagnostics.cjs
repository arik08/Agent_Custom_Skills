// Run the installed editor's HTML/CSS/JavaScript diagnostics against this file.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const target = process.argv[2] || path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const editor = path.join(process.env.LOCALAPPDATA, 'Programs/Microsoft VS Code');
const serverSuffix = 'resources/app/extensions/html-language-features/server/dist/node/htmlServerMain.js';
const server = [editor, ...fs.readdirSync(editor).map(name => path.join(editor, name))]
  .map(directory => path.join(directory, serverSuffix)).find(file => fs.existsSync(file));
if (!server) throw new Error('Installed VS Code HTML language server not found');
const child = spawn(process.execPath, [server, '--stdio'], { windowsHide: true });
const uri = pathToFileURL(path.resolve(target)).href;
const source = fs.readFileSync(target, 'utf8');
let buffer = Buffer.alloc(0), done = false;
function send(message) {
  const data = JSON.stringify({ jsonrpc: '2.0', ...message });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(data)}\r\n\r\n${data}`);
}
const timeout = setTimeout(() => {
  if (!done) { console.error('HTML diagnostics timed out'); process.exitCode = 1; child.kill(); }
}, 25000);
child.stderr.on('data', data => process.stderr.write(data));
child.on('exit', code => {
  clearTimeout(timeout);
  if (!done) { console.error(`HTML language server exited: ${code}`); process.exitCode = 1; }
});
child.stdout.on('data', data => {
  buffer = Buffer.concat([buffer, data]);
  for (;;) {
    const end = buffer.indexOf('\r\n\r\n');
    if (end < 0) break;
    const length = Number(buffer.subarray(0, end).toString().match(/Content-Length: (\d+)/i)[1]);
    if (buffer.length < end + 4 + length) break;
    const message = JSON.parse(buffer.subarray(end + 4, end + 4 + length).toString());
    buffer = buffer.subarray(end + 4 + length);
    if (message.id === 1 && message.result) {
      send({ method: 'initialized', params: {} });
      send({ method: 'workspace/didChangeConfiguration', params: { settings: {
        html: { validate: { scripts: true, styles: true } },
        css: { validate: true }
      } } });
      send({ method: 'textDocument/didOpen', params: { textDocument: { uri, languageId: 'html', version: 1, text: source } } });
    } else if (message.method === 'workspace/configuration') {
      send({ id: message.id, result: message.params.items.map(() => ({})) });
    } else if (message.id && message.method) {
      send({ id: message.id, result: null });
    } else if (message.method === 'textDocument/publishDiagnostics' && message.params.uri === uri) {
      const lines = source.split('\n');
      const diagnostics = message.params.diagnostics.map(item => ({
        severity: item.severity, code: item.code, message: item.message,
        line: item.range.start.line + 1, column: item.range.start.character + 1,
        context: lines[item.range.start.line].slice(Math.max(0, item.range.start.character - 75), item.range.start.character + 140)
      }));
      const result = { file: path.basename(target), count: diagnostics.length, diagnostics };
      console.log(JSON.stringify(result, null, 2));
      fs.writeFileSync(path.join(root, 'validation/html-editor-diagnostics.json'), JSON.stringify(result, null, 2));
      done = true; clearTimeout(timeout); child.kill();
    }
  }
});
send({ id: 1, method: 'initialize', params: {
  processId: process.pid, rootUri: pathToFileURL(root).href,
  capabilities: { textDocument: { publishDiagnostics: { relatedInformation: true } } },
  initializationOptions: { embeddedLanguages: { css: true, javascript: true } }
} });

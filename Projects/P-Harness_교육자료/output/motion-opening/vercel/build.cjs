const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '..', 'p-harness-opening-25s.html');
const output = path.join(__dirname, 'public');
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(source, path.join(output, 'index.html'));
console.log('Published the current opening HTML with embedded fonts and audio.');

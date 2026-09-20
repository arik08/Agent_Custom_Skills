import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
const keys=['employee-a','employee-b','ai','employee-a-gait','employee-b-gait','ai-gait'];
const assets=Object.fromEntries(await Promise.all(keys.map(async key=>[key,'data:image/png;base64,'+(await readFile(`assets/${key.endsWith("-gait")?key.replace("-gait","-fullbody8"):key==="employee-b"?"employee-b-consistent":key}-atlas.png`)).toString('base64')])));
const result=await build({entryPoints:['stage.js'],bundle:true,write:false,minify:true,format:'iife',legalComments:'inline'});
const template=await readFile('preview-template.html','utf8');
await writeFile('hq-ax-diorama.html',template.replace('/*ASSETS*/',()=>`window.SPRITE_ASSETS=${JSON.stringify(assets)};`).replace('/*APPLICATION*/',()=>result.outputFiles[0].text.replaceAll('</script','<\\/script')).replace(/[ \t]+$/gm,''));
console.log('Built hq-ax-diorama.html — all sprites and Three.js embedded. No server or network needed.');

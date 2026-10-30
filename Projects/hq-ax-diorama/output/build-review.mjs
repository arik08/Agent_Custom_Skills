import {readFile,writeFile} from 'node:fs/promises';
const keys=['employee-a','employee-b','ai'];
const sources=await Promise.all(keys.map(async key=>'data:image/png;base64,'+(await readFile(`assets/${key}-fullbody-atlas.png`)).toString('base64')));
await writeFile('validation/fullbody-review.html',`<body style="margin:0;background:#eeeade"><script>
(async()=>{window.atlases=[];for(const src of ${JSON.stringify(sources)}){let img=new Image();img.src=src;await img.decode();atlases.push(img);}
window.show=(index)=>{document.body.replaceChildren();let c=document.createElement('canvas');c.width=2048;c.height=1024;c.getContext('2d').drawImage(atlases[Math.floor(index/2)],0,(index%2)*1024,2048,1024,0,0,2048,1024);document.body.append(c);};show(0);
})();</script>`);

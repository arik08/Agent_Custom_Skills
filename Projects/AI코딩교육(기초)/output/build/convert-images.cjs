const fs=require('fs');const path=require('path');
const sharp=require('C:/Users/Myeongcheol/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
(async()=>{const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/generation.json'),'utf8'));const results=[];
for(const a of manifest.assets){
 fs.copyFileSync(a.source,path.join(root,'assets',a.id+'.png'));
 const target=path.join(root,'assets',a.id+'.webp');
 await sharp(a.source).webp({quality:90,alphaQuality:100,effort:6}).toFile(target);
 const info=await sharp(target).metadata();const stats=await sharp(target).stats();
 const alpha=stats.channels[3];
 if(!info.hasAlpha||!alpha||alpha.min!==0||alpha.max<250)throw new Error(a.id+' does not contain real transparency');
 results.push({id:a.id,width:info.width,height:info.height,bytes:fs.statSync(target).size,hasAlpha:info.hasAlpha,alphaMin:alpha.min,alphaMax:alpha.max});
}fs.writeFileSync(path.join(root,'validation/image-alpha.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));})();

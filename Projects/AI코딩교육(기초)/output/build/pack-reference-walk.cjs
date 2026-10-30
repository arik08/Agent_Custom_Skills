// Extract complete connected figures and pack them into uniform runtime cells.
// No isolated feet, limb compositing, local warping, or pose fabrication.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const version=process.argv[2]||'walk-cycle-v4';if(!/^walk-cycle-v[0-9]+$/.test(version))throw Error('Invalid asset version');
const base=path.resolve(__dirname,'../assets',version);
(async()=>{const manifest={};for(const key of ['employee-a','employee-b']){
 const {data,info}=await sharp(path.join(base,key+'-source.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});const {width:w,height:h}=info,labels=new Int32Array(w*h),parts=[];let id=0;
 for(let p=0;p<w*h;p++){if(labels[p]||data[p*4+3]<32)continue;labels[p]=++id;const stack=[p];let x0=w,x1=0,y0=h,y1=0,n=0;while(stack.length){const q=stack.pop(),x=q%w,y=Math.floor(q/w);n++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(const r of [x>0?q-1:-1,x<w-1?q+1:-1,y>0?q-w:-1,y<h-1?q+w:-1])if(r>=0&&!labels[r]&&data[r*4+3]>=32){labels[r]=id;stack.push(r);}}if(n>10000)parts.push({id,x0,x1,y0,y1,n});}
 parts.sort((a,b)=>a.x0-b.x0);if(parts.length!==8)throw Error('Expected 8 distinct full figures for '+key);
 const layers=[];manifest[key]=[];
 for(let i=0;i<8;i++){const p=parts[i],x0=Math.max(0,p.x0-2),y0=Math.max(0,p.y0-2),width=Math.min(w,p.x1+3)-x0,height=Math.min(h,p.y1+3)-y0,body=Buffer.alloc(width*height*4);let hx0=w,hx1=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const q=(y+y0)*w+x+x0;let belongs=labels[q]===p.id;if(!belongs&&data[q*4+3]>0&&data[q*4+3]<32){for(let dy=-2;dy<=2&&!belongs;dy++)for(let dx=-2;dx<=2;dx++){const ax=x+x0+dx,ay=y+y0+dy;if(ax>=0&&ax<w&&ay>=0&&ay<h&&labels[ay*w+ax]===p.id){belongs=true;break;}}}if(belongs){data.copy(body,(y*width+x)*4,q*4,q*4+4);if(y<height*.3&&data[q*4+3]>=32){hx0=Math.min(hx0,x);hx1=Math.max(hx1,x);}}}
 const targetHeight=200,scale=targetHeight/height,targetWidth=Math.round(width*scale),headCenter=(hx0+hx1)/2*scale;
 const sprite=await sharp(body,{raw:{width,height,channels:4}}).resize(targetWidth,targetHeight).png().toBuffer();const left=Math.round(128-headCenter),top=244-targetHeight;if(left<0||left+targetWidth>256)throw Error('Figure outside runtime tile');
 layers.push({input:sprite,left:i%4*256+left,top:Math.floor(i/4)*256+top});manifest[key].push({frame:i,referencePose:i+1,sourceBounds:p,wholeFigure:true,baseline:244,columns:4,rows:2});
 }
 await sharp({create:{width:1024,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toFile(path.join(base,key+'-walk.png'));
 }fs.writeFileSync(path.join(base,'manifest.json'),JSON.stringify(manifest,null,2));console.log('Packed reference poses 1-8 for both characters.');})();

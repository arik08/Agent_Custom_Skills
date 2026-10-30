// Pack complete, AI-drawn figures. No limb masking, replacement or warping.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const base=path.resolve(__dirname,'../assets/walk-cycle-v2');
const specs={
 'employee-a':[['male-right',4,0],['male-right',4,1],['male-right',4,2],['male-right',4,6],...Array.from({length:4},(_,i)=>['male-left',2,i])],
 'employee-b':[['female-right',4,0],['female-right',4,1],['female-pass',2,1],['female-right',4,2],...Array.from({length:4},(_,i)=>['female-left',2,i])]
};
(async()=>{const manifest={};for(const [key,frames]of Object.entries(specs)){const layers=[];manifest[key]=[];for(let i=0;i<frames.length;i++){
 const [source,cols,index]=frames[i],input=path.join(base,source+'-source.png'),meta=await sharp(input).metadata(),rows=2;
 const left=Math.round(index%cols*meta.width/cols),top=Math.round(Math.floor(index/cols)*meta.height/rows),width=Math.round((index%cols+1)*meta.width/cols)-left,height=Math.round((Math.floor(index/cols)+1)*meta.height/rows)-top;
 const {data,info}=await sharp(input).extract({left,top,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let x0=width,y0=height,x1=0,y1=0;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>32){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 let hx0=width,hx1=0;for(let y=y0;y<y0+(y1-y0)*.30;y++)for(let x=x0;x<=x1;x++)if(data[(y*width+x)*4+3]>32){hx0=Math.min(hx0,x);hx1=Math.max(hx1,x);}
 const bodyHeight=198,scale=bodyHeight/(y1-y0+1),targetWidth=Math.round((x1-x0+1)*scale),headCenter=((hx0+hx1)/2-x0)*scale;
 const figure=await sharp(data,{raw:info}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(targetWidth,bodyHeight).png().toBuffer();
 const x=Math.round(128-headCenter);if(x<0||x+targetWidth>256)throw Error('Full figure outside tile');layers.push({input:figure,left:i%4*256+x,top:Math.floor(i/4)*256+244-bodyHeight});
 manifest[key].push({frame:i,source,index,support:i<4?'right':'left',phase:['contact','weight','passing','swing'][i%4],wholeBody:true,baseline:244});
 }await sharp({create:{width:1024,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toFile(path.join(base,key+'-walk.png'));}
 fs.writeFileSync(path.join(base,'manifest.json'),JSON.stringify(manifest,null,2));console.log('Packed two full-body cycles, eight frames each.');})();

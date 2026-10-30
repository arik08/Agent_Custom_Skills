// A cut can leave isolated outlines from the original shoe/hand on a part.
// Remove those at the part level, before animation, never by deleting a whole
// disconnected limb from a finished pose.
function cleanPart(canvas){
 const ctx=canvas.getContext('2d'),data=ctx.getImageData(0,0,256,256),px=data.data;
 const seen=new Uint8Array(65536);let largest=[];
 for(let seed=0;seed<65536;seed++){
  if(seen[seed]||px[seed*4+3]<8)continue;
  const group=[seed];seen[seed]=1;
  for(let q=0;q<group.length;q++){
   const n=group[q],x=n%256,y=n>>8;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const xx=x+dx,yy=y+dy,j=yy*256+xx;
    if(xx>=0&&xx<256&&yy>=0&&yy<256&&!seen[j]&&px[j*4+3]>=8){seen[j]=1;group.push(j);}
   }
  }
  if(group.length>largest.length)largest=group;
 }
 const keep=new Uint8Array(65536);for(const n of largest)keep[n]=1;
 for(let n=0;n<65536;n++)if(!keep[n])px[n*4+3]=0;
 ctx.putImageData(data,0,0);
}
// Cut-paper animation: one drawing per action, sampled at 32 phases.
// Keeps identity and held objects fixed instead of interleaving unrelated sheets.
export function makeGaitAtlas(sheet,key){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=2048;
 const out=canvas.getContext('2d');
 const robot=key==='ai';
 for(let action=0;action<2;action++){
  const source=document.createElement('canvas');source.width=source.height=256;
  source.getContext('2d').drawImage(sheet,0,action*512,256,256,0,0,256,256);
  const contours=robot ? [
   [[96,202],[124,210],[124,256],[64,256],[64,214],[82,214]],
   [[136,198],[150,197],[200,202],[200,256],[124,256],[124,217],[126,208]]
  ] : [
   [[108,184],[125,193],[110,221],[113,249],[69,249],[70,216]],
   [[126,182],[143,183],[195,219],[195,251],[148,251],[119,204]]
  ];
  const pivots=robot?[[103,207],[138,208]]:[[114,190],[134,190]];
  const body=document.createElement('canvas');body.width=body.height=256;
  const bodyCtx=body.getContext('2d');bodyCtx.drawImage(source,0,0);
  const legs=contours.map(points=>{
   const c=document.createElement('canvas');c.width=c.height=256;
   const ctx=c.getContext('2d');ctx.beginPath();
   points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(source,0,0);
   bodyCtx.save();bodyCtx.globalCompositeOperation='destination-out';
   bodyCtx.beginPath();points.forEach(([x,y],i)=>i?bodyCtx.lineTo(x,y):bodyCtx.moveTo(x,y));bodyCtx.closePath();bodyCtx.fill();bodyCtx.restore();
   cleanPart(c);return c;
  });
  // Remove residual source-leg outlines below the intact torso silhouette.
  if(robot)bodyCtx.clearRect(0,213,256,43);
  cleanPart(body);
  for(let frame=0;frame<32;frame++){
   const phase=frame/32*Math.PI*2;
   const tile=document.createElement('canvas');tile.width=tile.height=256;
   const ctx=tile.getContext('2d');
   for(const side of [1,2]){
    const swing=Math.cos(phase+(side===1?Math.PI:0));
    const neutral=side===1?-.62:.55;
    const [px,py]=pivots[side-1];
    ctx.save();ctx.translate(px,py-20);ctx.rotate(neutral+swing*.40);ctx.scale(1.04,1.04-.10*Math.max(0,Math.sin(phase+(side===1?Math.PI:0))));
    ctx.translate(-px,-py);ctx.drawImage(legs[side-1],0,0);ctx.restore();
   }
   ctx.drawImage(body,0,-20);
   // Ground contact uses the actual lowest opaque pixel; never stretch the body.
   const pixels=ctx.getImageData(0,0,256,256).data;let bottom=0;
   for(let y=180;y<256;y++)for(let x=30;x<220;x++)if(pixels[(y*256+x)*4+3]>100)bottom=y;
   out.drawImage(tile,(frame%8)*256,(Math.floor(frame/8)+action*4)*256+244-bottom);
  }
 }
 canvas.complete=true;canvas.naturalWidth=2048;canvas.decode=async()=>{};
 return canvas;
}

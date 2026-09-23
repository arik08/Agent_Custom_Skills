// Small deterministic autoplay game for the projected coding preview.
const shapes=[[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[2,0],[1,1]],[[0,0],[0,1],[1,1],[2,1]]];
const colors=['#efb656','#58c4e4','#978ada','#76dca9'];
const rotate=cells=>{const turned=cells.map(([x,y])=>[-y,x]),minX=Math.min(...turned.map(p=>p[0])),minY=Math.min(...turned.map(p=>p[1]));return turned.map(([x,y])=>[x-minX,y-minY]);};
export class BlockPreview {
 constructor(){this.reset();}
 reset(){this.board=Array.from({length:10},()=>Array(6).fill(0));for(let y=8;y<10;y++)for(let x=2;x<6;x++)this.board[y][x]=3;this.sequence=0;this.score=0;this.lines=0;this.locked=0;this.revision=0;this.spawn();}
 fits(cells,x,y,board=this.board){return cells.every(([dx,dy])=>x+dx>=0&&x+dx<6&&y+dy>=0&&y+dy<10&&!board[y+dy][x+dx]);}
 spawn(){this.kind=this.sequence++%shapes.length;this.cells=shapes[this.kind].map(p=>[...p]);this.x=1;this.y=0;this.fall=0;this.control=0;this.rotations=0;
  if(!this.fits(this.cells,this.x,this.y)){this.board=Array.from({length:10},()=>Array(6).fill(0));}
  let best=-Infinity,shape=this.cells;
  for(let rotation=0;rotation<4;rotation++,shape=rotate(shape))for(let x=0;x<6;x++){
   if(!this.fits(shape,x,0))continue;let y=0;while(this.fits(shape,x,y+1))y++;
   const board=this.board.map(r=>[...r]);shape.forEach(([dx,dy])=>board[y+dy][x+dx]=1);
   const full=board.filter(r=>r.every(Boolean)).length;let height=0,holes=0;
   for(let col=0;col<6;col++){let filled=false;for(let row=0;row<10;row++){if(board[row][col]){if(!filled)height+=10-row;filled=true;}else if(filled)holes++;}}
   const score=full*100-holes*12-height;if(score>best){best=score;this.targetX=x;this.targetRotation=rotation;}
  }
  this.revision++;
 }
 update(dt,dropMs){if(!Number.isFinite(dt)||dt<=0)return;const interval=Math.max(.08,dropMs/1000);while(dt>1e-9){const d=Math.min(dt,.02);dt-=d;this.fall+=d;this.control+=d;
  if(this.control>=.12){this.control-=.12;if(this.rotations<this.targetRotation){const cells=rotate(this.cells);if(this.fits(cells,this.x,this.y)){this.cells=cells;this.rotations++;this.revision++;}}
   else if(this.x!==this.targetX){const next=this.x+Math.sign(this.targetX-this.x);if(this.fits(this.cells,next,this.y)){this.x=next;this.revision++;}}
  }
  if(this.fall>=interval){this.fall-=interval;if(this.fits(this.cells,this.x,this.y+1)){this.y++;this.revision++;}else{this.cells.forEach(([dx,dy])=>this.board[this.y+dy][this.x+dx]=this.kind+1);this.locked++;const kept=this.board.filter(r=>!r.every(Boolean)),cleared=10-kept.length;this.lines+=cleared;this.score+=10+cleared*100;while(kept.length<10)kept.unshift(Array(6).fill(0));this.board=kept;this.spawn();}}
 }}
 draw(ctx){const size=28,x0=790,y0=88;ctx.fillStyle='#0a1d2b';ctx.fillRect(x0-4,y0-4,176,288);
  const cell=(x,y,color)=>{ctx.fillStyle=color;ctx.fillRect(x0+x*size+1,y0+y*size+1,size-2,size-2);ctx.fillStyle='#ffffff35';ctx.fillRect(x0+x*size+2,y0+y*size+2,size-4,3);};
  this.board.forEach((row,y)=>row.forEach((v,x)=>{if(v)cell(x,y,colors[v-1]);}));
  let ghost=this.y;while(this.fits(this.cells,this.x,ghost+1))ghost++;ctx.strokeStyle='#7896aa';this.cells.forEach(([dx,dy])=>ctx.strokeRect(x0+(this.x+dx)*size+3,y0+(ghost+dy)*size+3,size-6,size-6));
  this.cells.forEach(([dx,dy])=>cell(this.x+dx,this.y+dy,colors[this.kind]));
 }
 snapshot(){return {x:this.x,y:this.y,cells:this.cells.map(p=>[...p]),board:this.board.map(r=>[...r]),score:this.score,lines:this.lines,locked:this.locked,revision:this.revision};}
}

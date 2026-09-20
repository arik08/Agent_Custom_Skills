// One speaker at a time, with a short handoff and independent actor clocks.
export class SpeechRelay {
 constructor(){this.speaker=-1;this.last=-1;this.until=0;this.next=.25;this.lastSpoke=new Map();}
 update(time,workers){
  if(this.speaker>=0&&time>=this.until){this.last=this.speaker;this.speaker=-1;this.next=time+.22;}
  if(this.speaker<0&&time>=this.next&&workers.length){
   const candidates=workers.map((w,i)=>({w,i})).filter(({w,i})=>w.activity&&(workers.length===1||i!==this.last));
   candidates.sort((a,b)=>{const ageA=time-(this.lastSpoke.get(a.i)??-100),ageB=time-(this.lastSpoke.get(b.i)??-100);const score=({w},age)=>age+(w.motion===4&&!w.path.length?3:0);return score(b,ageB)-score(a,ageA);});
   if(candidates.length){this.speaker=candidates[0].i;this.lastSpoke.set(this.speaker,time);this.until=time+2.8;}
  }
  return {speaker:this.speaker,text:this.speaker<0?'':workers[this.speaker].activity};
 }
}

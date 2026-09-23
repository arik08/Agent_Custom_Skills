export const isGait=motion=>motion===1||motion===2;
export function gaitCell(motion,distance){const phase=((distance/1.05)%1+1)%1;const frame=Math.floor(phase*8);return {frame,col:frame%4,row:Math.floor(frame/4)+(motion===2?2:0)};}
const humanWalk=new Set(['employee-a','employee-b']);
export function spriteFrame(key,motion,age,distance){
 if(motion===1&&humanWalk.has(key))return {...gaitCell(1,distance),walk:true,gait:false,frames:8};
 const gait=isGait(motion)&&key!=='employee-a';
 if(gait)return {...gaitCell(motion,distance),walk:false,gait,frames:8};
 const phase=((distance/1.05)%1+1)%1;
 const col=isGait(motion)?Math.floor(phase*4):Math.floor(age*(motion===0?2.3:5.7))%4;
 return {col,row:motion,walk:false,gait:false,frames:4};
}

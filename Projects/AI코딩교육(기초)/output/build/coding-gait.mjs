export const isGait=motion=>motion===1||motion===2;
export function gaitCell(motion,distance){const phase=((distance/1.05)%1+1)%1;const frame=Math.floor(phase*8);return {frame,col:frame%4,row:Math.floor(frame/4)+(motion===2?2:0)};}

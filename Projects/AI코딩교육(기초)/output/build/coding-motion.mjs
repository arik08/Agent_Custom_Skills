// Small secondary motion, driven by travelled distance and the current role.
export function posture(worker,speaking,listening,reduced=false){
 if(reduced)return {lean:0,bob:0,breath:1};
 const stride=worker.gaitDistance/1.05*Math.PI*2;
 if(worker.motion===1)return {lean:Math.sin(stride)*.012,bob:Math.abs(Math.sin(stride))*.018,breath:1};
 const envelope=Math.min(1,worker.age*3);
 return {lean:envelope*(speaking?Math.sin(worker.age*4.3)*.018:listening?Math.sin(worker.age*2.6)*.009:worker.motion===3?Math.sin(worker.age*5)*.007:0),bob:0,breath:1+Math.sin(worker.age*1.6+worker.role)*.0025};
}

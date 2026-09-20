import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Office} from './roles.js';
import {gaitCell} from './gait.js';
test('8 gait frames occupy correct atlas rows for walk and carry',()=>{for(const motion of [1,2]){const cells=Array.from({length:8},(_,i)=>gaitCell(motion,(i+.2)*1.05/8));assert.equal(new Set(cells.map(c=>`${c.col}:${c.row}`)).size,8);assert.deepEqual(cells.map(c=>c.frame),Array.from({length:8},(_,i)=>i));assert.ok(cells.every(c=>c.row>=(motion===1?0:2)&&c.row<(motion===1?2:4)));}});
test('phase tracks actual movement through corners and remains still while stationary',()=>{const o=new Office();let crossings=0,stops=0;for(let i=0;i<4000;i++){const before=o.workers.map(w=>({x:w.x,z:w.z,d:w.gaitDistance,node:w.node}));o.update(.025);o.workers.forEach((w,j)=>{const old=before[j],moved=Math.hypot(w.x-old.x,w.z-old.z);assert.ok(Math.abs(w.gaitDistance-old.d-moved)<1e-8);if(w.node!==old.node){crossings++;assert.ok(w.gaitDistance>=old.d);}if(moved===0){stops++;assert.equal(w.gaitDistance,old.d);}});}assert.ok(crossings>10);assert.ok(stops>100);});

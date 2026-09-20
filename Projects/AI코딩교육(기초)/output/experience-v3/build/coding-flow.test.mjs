import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Office} from './coding-flow.mjs';
for(const seed of [19,42,973])test(`independent coding workflow seed ${seed}`,()=>{
 const o=new Office(seed);let varied=0,solo=0,changes=0;const visits=o.workers.map(()=>new Set());let prev=o.workers.map(w=>w.activity);
 for(let i=0;i<12000;i++){o.update(.05);let changed=0;const claimed=o.workers.filter(w=>w.job!==null).map(w=>w.job);assert.equal(claimed.length,new Set(claimed).size);
 o.workers.forEach((w,k)=>{assert(Number.isFinite(w.x)&&Number.isFinite(w.z));assert(w.x>=-6&&w.x<=6&&w.z>=-4.5&&w.z<=4.5);visits[k].add(w.node);if(w.activity!==prev[k])changed++;prev[k]=w.activity;});if(changed){changes++;if(changed===1)solo++;}if(new Set(o.workers.map(w=>w.motion)).size>1)varied++;}
 assert(o.finished>=4);assert(o.reworks>=o.finished);assert(o.jobs.length<=5);assert(varied/12000>.55);assert(solo/changes>.85);visits.forEach(v=>assert(v.size>=5));
 const before=JSON.stringify(o.snapshot());o.update(0);o.update(-1);o.update(NaN);assert.equal(JSON.stringify(o.snapshot()),before);
 console.log(JSON.stringify({seed,finished:o.finished,distinctMotionRatio:varied/12000,independentSpeechChanges:solo/changes,visitedNodes:visits.map(v=>v.size)}));
});

import {test} from 'node:test';import assert from 'node:assert/strict';
import {Office} from './coding-flow.mjs';import {SpeechRelay} from './coding-speech.mjs';
test('only authored speech is visible, with silent working and movement',()=>{
 const office=new Office(),relay=new SpeechRelay(),turns=[];let last='';let silentWork=0;
 for(let i=0;i<4800;i++){office.update(.05);const state=relay.update(office);
  if(state.speaker>=0){assert.equal(state.text,office.beat.text);assert(!office.workers.some(w=>w.path.length));if(state.turn!==last){turns.push(state.turn);last=state.turn;}}
  else if(office.workers.some(w=>w.motion===1||w.motion===3))silentWork++;
  if(office.finished)break;
 }
 assert(silentWork>100);assert.deepEqual(turns,['request','clarify','criteria','accept','handoff','feedback','propose','approve-change','revised-handoff','verdict','signoff','complete']);
});

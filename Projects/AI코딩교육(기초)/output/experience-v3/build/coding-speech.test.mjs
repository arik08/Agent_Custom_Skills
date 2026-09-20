import {test} from 'node:test';import assert from 'node:assert/strict';
import {Office} from './coding-flow.mjs';import {SpeechRelay} from './coding-speech.mjs';
test('relay stays single, alternates speakers, and limits silence during real workflow',()=>{
 const office=new Office(),relay=new SpeechRelay();let silence=0,maxSilence=0,last=-1,turns=0;const speakers=new Set();
 for(let i=0;i<12000;i++){office.update(.05);const state=relay.update(office.time,office.workers);if(state.speaker<0){silence+=.05;maxSilence=Math.max(maxSilence,silence);}else{silence=0;assert.equal(state.text,office.workers[state.speaker].activity);speakers.add(state.speaker);if(state.speaker!==last){turns++;last=state.speaker;}}}
 assert(maxSilence<=.3);assert.equal(speakers.size,3);assert(turns>150);console.log({maxSilence,turns,speakers:[...speakers]});
});

// A single channel projects the current causal turn; it never invents dialogue.
export class SpeechRelay {
 update(office){
  const speech=office.speech;
  if(office.workers.some(w=>w.path.length)||speech.speaker<0)return {speaker:-1,text:''};
  return {...speech};
 }
}

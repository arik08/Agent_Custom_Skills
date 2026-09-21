const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dir=path.resolve('Projects/AI코딩교육(기초)/output/experience-v3/build');
const source=fs.readFileSync(path.join(dir,'tetris-workshop.js'),'utf8');
new vm.Script(source);
const code=source.slice(source.indexOf('function codeFor('),source.indexOf('function renderCode('));
const base={color:false,hud:false,ghost:false,effects:false};
const sandbox={viewConfig:()=>base,dropMs:40};vm.createContext(sandbox);vm.runInContext(code,sandbox);
const root={},checks=[];
for(const key of ['index','style','game']){
 const lines=sandbox.codeFor(root,key);const added=sandbox.diffLines([],lines);
 assert.equal(added.length,lines.length);assert(added.every((v,i)=>v==='+ '+lines[i]));
 checks.push({name:'initial full addition '+key,lines:lines.length,ok:true});
}
for(const cfg of [{...base,color:true},{...base,hud:true},{...base,ghost:true,effects:true},{color:true,hud:true,ghost:true,effects:true}]){
 for(const key of ['index','style','game']){
  const before=sandbox.codeFor(root,key),after=sandbox.codeFor(root,key,cfg,100),diff=sandbox.diffLines(before,after);
  assert.deepEqual(Array.from(diff.filter(l=>!l.startsWith('-')).map(l=>l.slice(2))),Array.from(after));
  assert.deepEqual(Array.from(diff.filter(l=>!l.startsWith('+')).map(l=>l.slice(2))),Array.from(before));
 }
}
checks.push({name:'all upgrades reconstruct old and new file sources',ok:true});
for(const [before,after] of [[[],[]],[['a'],[]],[['a'],['a']],[['a','b','a'],['a','a','c']],[['unknown','new tool'],['replacement','new tool','extra']]]){
 const diff=sandbox.diffLines(before,after);
 assert.deepEqual(Array.from(diff.filter(l=>!l.startsWith('-')).map(l=>l.slice(2))),after);
 assert.deepEqual(Array.from(diff.filter(l=>!l.startsWith('+')).map(l=>l.slice(2))),before);
}
checks.push({name:'empty unchanged deletion duplicate and arbitrary lines',ok:true});
assert(source.includes('s.fileDiffs[s.file]'));assert(source.includes("state.fileDiffs[key]=diffLines(before,after)"));
checks.push({name:'renderer selects per-file computed diff',ok:true});
// Exercise the production update block across successive requests.
const update=source.slice(source.indexOf(' if(isBuild)state.fileDiffs={};'),source.indexOf(" q(root,'[data-change-count]')",source.indexOf(' if(isBuild)state.fileDiffs={};')));
sandbox.state={fileDiffs:{}};sandbox.root=root;sandbox.isBuild=false;sandbox.nextInterval=40;
let current={...base};sandbox.viewConfig=()=>current;
for(const patch of [{color:true},{hud:true},{ghost:true,effects:true}]){
 sandbox.nextConfig={...current,...patch};vm.runInContext(update,sandbox);current=sandbox.nextConfig;
}
assert.deepEqual(Object.keys(sandbox.state.fileDiffs).sort(),['game','index','style']);
assert(sandbox.state.fileDiffs.index.some(l=>l.startsWith('+')&&l.includes('next')));
assert(sandbox.state.fileDiffs.style.some(l=>l.startsWith('+')&&l.includes('40px')));
const retained=sandbox.state.fileDiffs.index;
sandbox.nextConfig=current;sandbox.nextInterval=100;vm.runInContext(update,sandbox);
assert.strictEqual(sandbox.state.fileDiffs.index,retained);
sandbox.state.fileDiffs.obsolete=['+ stale'];sandbox.isBuild=true;sandbox.nextConfig=base;vm.runInContext(update,sandbox);
assert(!('obsolete' in sandbox.state.fileDiffs));
checks.push({name:'sequential requests retain HTML CSS diffs; new build clears old records',ok:true});
const out=path.resolve(dir,'../validation/diff-check.json');fs.writeFileSync(out,JSON.stringify({checks,browser:'Not verified: local URL blocked by in-app browser policy'},null,2));console.log(JSON.stringify(checks,null,2));

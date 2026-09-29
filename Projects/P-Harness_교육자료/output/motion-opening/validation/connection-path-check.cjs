const fs=require('fs');const source=fs.readFileSync(process.argv[2],'utf8');let paths=[],path,mark;
const g={save(){},restore(){},beginPath(){path=[]},moveTo(x,y){path.push([x,y])},lineTo(x,y){path.push([x,y])},stroke(){paths.push(path)}};
const C={mark:'#b8d1ff',ice:'#91b9ff'},clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,v)=>a+(b-a)*v,aiSkillMark=(x,y,s,c,v)=>{mark=v};
const run=new Function('t','g','C','clamp','mix','aiSkillMark',source);
for(const t of [0,1.7,2.2,2.7,3.1,3.7]){paths=[];run(t,g,C,clamp,mix,aiSkillMark);if(paths.some(p=>p.some(q=>q.some(n=>!Number.isFinite(n)))))throw Error('invalid path');if(t<2.7&&paths.length>3)throw Error('early output');}
if(paths.length!==4||mark!==1)throw Error('unfinished');
console.log(JSON.stringify({paths,mark,completeBySceneSecond:3.7/.75}));

  // Each branch is one continuous path, drawn from its row into the junction.
  function branch(points,progress){
    const lengths=points.slice(1).map((point,i)=>Math.hypot(point[0]-points[i][0],point[1]-points[i][1]));
    let remaining=lengths.reduce((sum,length)=>sum+length,0)*progress;
    if(remaining<=0)return;
    g.beginPath();g.moveTo(...points[0]);
    for(let i=0;i<lengths.length;i++){
      const amount=Math.min(1,remaining/lengths[i]);
      g.lineTo(mix(points[i][0],points[i+1][0],amount),mix(points[i][1],points[i+1][1],amount));
      remaining-=lengths[i];if(remaining<=0)break;
    }
    g.strokeStyle=C.mark;g.lineWidth=4;g.stroke();
  }
  const flow=(start,duration)=>{const u=clamp((t-start)/duration);return u*u*(3-2*u)};
  g.save();g.lineCap='round';g.lineJoin='round';
  branch([[1510,370],[1569,370],[1569,549]],flow(1.3,.8));
  branch([[1510,549],[1569,549]],flow(1.6,.65));
  branch([[1510,728],[1569,728],[1569,549]],flow(1.9,.8));
  const markEdge=1730-(39+12.5)*174/110;
  branch([[1569,549],[markEdge,549]],flow(2.7,.4));
  g.restore();
  aiSkillMark(1730,549,174,C.ice,flow(3.1,.6));

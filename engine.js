(function(root){
'use strict';
const W=2400,H=700,R=18, gravity=1250;
const platforms=[{x:0,y:620,w:2400},{x:400,y:450,w:220},{x:920,y:400,w:220},{x:1450,y:430,w:200},{x:1930,y:350,w:240}];
const flippers=[{x:350,y:620,side:-1},{x:610,y:620,side:1},{x:1050,y:620,side:-1},{x:1310,y:620,side:1},{x:1790,y:620,side:-1},{x:2070,y:620,side:1}];
const bumpers=[{x:500,y:400},{x:1020,y:350},{x:1510,y:380},{x:2010,y:300}];
const fruitSpots=[{x:200,y:590},{x:280,y:590},{x:460,y:420},{x:540,y:420},{x:930,y:590},{x:1000,y:370},{x:1090,y:370},{x:1430,y:590},{x:1500,y:400},{x:1800,y:590},{x:1980,y:320},{x:2080,y:320}];
const courier={x:700,y:590},parcel={x:1500,y:400};
const targets=[{x:500,y:420},{x:1050,y:370},{x:2010,y:320}];
function create(){return {x:100,y:590,vx:0,vy:0,fruit:0,collected:[],lit:[],delivered:false,won:false,checkpoint:100,quest:'available',flips:[0,0],notice:'Find the three lanterns, then deliver the seed to the lighthouse.',noticeTime:5};}
// Persist durable exploration progress; resume safely on the ground at the last region.
function saveProgress(s){return {version:1, fruit:s.fruit, collected:[...s.collected], lit:[...s.lit], checkpoint:s.checkpoint, won:s.won, quest:s.quest};}
function restoreProgress(data){
 if(!data || data.version!==1 || !Array.isArray(data.collected) || !Array.isArray(data.lit) || !Number.isInteger(data.fruit) || data.fruit<0 || ![100,900,1600].includes(data.checkpoint) || typeof data.won!=='boolean') return null;
 const valid=(a,n)=>a.every(i=>Number.isInteger(i)&&i>=0&&i<n)&&new Set(a).size===a.length;
 const quest=data.quest??'available'; // v1 saves created before the delivery quest
 if(!['available','active','carrying','done'].includes(quest)||!valid(data.collected,fruitSpots.length)||!valid(data.lit,targets.length)||data.fruit>data.collected.length+(quest==='done'?2:0)||(data.won&&data.lit.length!==targets.length)) return null;
 const s=create();Object.assign(s,{x:data.checkpoint,y:550,checkpoint:data.checkpoint,fruit:data.fruit,collected:[...data.collected],lit:[...data.lit],won:data.won,delivered:data.won,quest,notice:'Journey restored at your last region.',noticeTime:5});return s;
}
function say(s,t){s.notice=t;s.noticeTime=3;}
function step(s,input,dt){dt=Math.min(dt,1/30);s.noticeTime=Math.max(0,s.noticeTime-dt);s.flips=s.flips.map(v=>Math.max(0,v-dt));
 let axis=(input.right?1:0)-(input.left?1:0);s.vx+=axis*650*dt;s.vx*=Math.pow(axis?0.985:0.94,dt*60);s.vx=Math.max(-260,Math.min(260,s.vx));s.vy+=gravity*dt;
 const oldY=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;s.x=Math.max(R,Math.min(W-R,s.x));
 for(const p of platforms){if(s.vy>=0 && oldY+R<=p.y+2 && s.y+R>=p.y && s.x>p.x-R/2 && s.x<p.x+p.w+R/2){s.y=p.y-R;s.vy=0;}}
 for(const [i,b] of bumpers.entries()){let dx=s.x-b.x,dy=s.y-b.y,d=Math.hypot(dx,dy);if(d<42&&d>0){s.x=b.x+dx/d*42;s.y=b.y+dy/d*42;s.vx=dx/d*310;s.vy=dy/d*310-160;}}
 for(let i=0;i<flippers.length;i++){let f=flippers[i],pressed=f.side<0?input.flipLeft:input.flipRight;if(pressed&&Math.abs(s.x-f.x)<70&&s.y>f.y-90&&s.y<f.y+15&&s.flips[f.side<0?0:1]<=0){s.vy=-850;s.vx=f.side<0?180:-180;s.flips[f.side<0?0:1]=0.24;}}
 fruitSpots.forEach((p,i)=>{if(!s.collected.includes(i)&&Math.hypot(s.x-p.x,s.y-p.y)<34){s.collected.push(i);s.fruit++;}});
 targets.forEach((p,i)=>{if(!s.lit.includes(i)&&Math.hypot(s.x-p.x,s.y-p.y)<42){s.lit.push(i);say(s,'Lantern lit! '+s.lit.length+' / 3');}});
 // A small optional delivery encourages revisiting the connected island.
 if(Math.hypot(s.x-courier.x,s.y-courier.y)<42){
  if(s.quest==='available'){s.quest='active';say(s,'Courier: Please fetch my parcel from the high grove.');}
  else if(s.quest==='carrying'){s.quest='done';s.fruit+=2;say(s,'Parcel delivered! The courier gives you two fruit.');}
 }
 if(s.quest==='active'&&Math.hypot(s.x-parcel.x,s.y-parcel.y)<38){s.quest='carrying';say(s,'Parcel found! Return it to the courier.');}
 if(s.x>800)s.checkpoint=900;if(s.x>1550)s.checkpoint=1600;
 if(s.y>H+80){s.x=s.checkpoint;s.y=550;s.vx=0;s.vy=0;s.fruit=Math.max(0,s.fruit-1);say(s,'Back to the trail. The brambles took one fruit.');}
 if(s.x>2290&&!s.won){if(s.lit.length===3){s.won=true;s.delivered=true;say(s,'The lighthouse glows again! Delivery complete.');}else if(s.noticeTime<=0)say(s,'The lighthouse needs all three lanterns.');}
 return s;}
if(typeof module!=='undefined')module.exports={create,step,saveProgress,restoreProgress,platforms,flippers,bumpers,fruitSpots,targets,courier,parcel,W,H};else root.IslandEngine={create,step,saveProgress,restoreProgress,platforms,flippers,bumpers,fruitSpots,targets,courier,parcel,W,H};
})(typeof window==='undefined'?globalThis:window);

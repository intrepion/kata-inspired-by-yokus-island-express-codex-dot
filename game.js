'use strict';
const E=window.IslandEngine,canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');let state=E.create(),running=false,last=0,camera=0;const keys={};
const saveKey='lantern-tide-progress-v1';let lastSave='';
try {const saved=E.restoreProgress(JSON.parse(localStorage.getItem(saveKey)));if(saved){state=saved;document.querySelector('#start').firstChild.textContent='Continue exploring ';}} catch (_) { /* Storage may be unavailable or corrupt. */ }
function persist(){try{const data=JSON.stringify(E.saveProgress(state));if(data!==lastSave){localStorage.setItem(saveKey,data);lastSave=data;}}catch (_) { /* Play remains available without storage. */ }}
const keyMap={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',z:'flipLeft',x:'flipRight'};
window.addEventListener('keydown',e=>{const k=keyMap[e.key];if(k){keys[k]=true;e.preventDefault();}});window.addEventListener('keyup',e=>{const k=keyMap[e.key];if(k){keys[k]=false;e.preventDefault();}});window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;b.setPointerCapture(e.pointerId)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys[k]=false)});
document.querySelector('#start').onclick=()=>{running=true;document.querySelector('#intro').classList.add('hidden');last=0};document.querySelector('#reset').onclick=()=>{state=E.create();camera=0;lastSave='';persist();running=true;document.querySelector('#intro').classList.add('hidden')};
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function draw(){const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);let grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#83c9c2');grad.addColorStop(.7,'#d0e6be');grad.addColorStop(1,'#eddfad');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);circle(800,100,55,'#f9e8aa');
 for(let layer=0;layer<3;layer++){ctx.fillStyle=['#81b9a5','#69a88f','#4c9278'][layer];ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+20;x+=20){let y=400+layer*65+Math.sin((x+camera*(.12+layer*.1))/160+layer)*35+Math.sin((x+camera*.2)/70)*12;ctx.lineTo(x,y)}ctx.lineTo(w,h);ctx.fill()}
 ctx.save();ctx.translate(-camera,-80);
 // distant palms
 for(let x=80;x<E.W;x+=210){let y=610;rect(x,y-125,8,125,'#537c60');for(let j=0;j<5;j++){ctx.save();ctx.translate(x+4,y-125);ctx.rotate((j-2)*.48);ctx.fillStyle='#477e61';ctx.beginPath();ctx.ellipse(0,-30,10,43,0,0,7);ctx.fill();ctx.restore()}}
 for(const p of E.platforms){rect(p.x,p.y,p.w,100,'#896746');rect(p.x,p.y,p.w,13,'#527c49');for(let x=p.x+18;x<p.x+p.w;x+=45){circle(x,p.y+22,3,'#b39468');}}
 E.bumpers.forEach(b=>{circle(b.x,b.y,30,'#eee0a2');circle(b.x,b.y,23,'#d77753');circle(b.x,b.y,14,'#f4ba71');circle(b.x-5,b.y-6,4,'#fff3cb')});
 E.flippers.forEach(f=>{ctx.save();ctx.translate(f.x,f.y-8);ctx.rotate(f.side*.15+(state.flips[f.side<0?0:1]>0?f.side*.4:0));ctx.fillStyle=f.side<0?'#e98a57':'#e5b04d';ctx.beginPath();ctx.roundRect(-58,-8,116,16,8);ctx.fill();circle(0,0,7,'#fff0bb');ctx.restore()});
 E.fruitSpots.forEach((p,i)=>{if(!state.collected.includes(i)){circle(p.x,p.y,8,'#f6b94c');circle(p.x-2,p.y-3,2,'#fff1af');rect(p.x,p.y-12,2,5,'#527b4f')}});
 E.targets.forEach((p,i)=>{let on=state.lit.includes(i);rect(p.x-3,p.y-38,6,34,'#7a6847');circle(p.x,p.y-42,17,on?'#ffe697':'#8b8f69');circle(p.x,p.y-42,9,on?'#fff7c0':'#ccc4a0');});
 // A neighbor gives an optional delivery, with a parcel in the high grove.
 circle(E.courier.x,E.courier.y-10,16,'#a15f52');circle(E.courier.x,E.courier.y-27,10,'#efd4ac');
 ctx.fillStyle='#fff3cd';ctx.font='bold 20px sans-serif';ctx.fillText(state.quest==='done'?'✓':'!',E.courier.x-4,E.courier.y-45);
 if(state.quest==='active'){rect(E.parcel.x-12,E.parcel.y-12,24,24,'#ba7c4f');rect(E.parcel.x-2,E.parcel.y-12,4,24,'#f7daa1');}
 if(state.quest==='carrying')rect(state.x-8,state.y-41,16,14,'#ba7c4f');
 // lighthouse
 rect(2280,460,65,160,'#fff0c8');rect(2270,450,85,20,'#dc7657');rect(2295,415,35,35,'#f5c264');ctx.fillStyle='#c9614c';ctx.beginPath();ctx.moveTo(2285,415);ctx.lineTo(2312,385);ctx.lineTo(2340,415);ctx.fill();rect(2300,565,25,55,'#55796a');
 // tethered courier and ball
 ctx.strokeStyle='#e9dcb2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(state.x-26,state.y+7);ctx.lineTo(state.x-9,state.y);ctx.stroke();circle(state.x,state.y,18,'#d3e5c4');circle(state.x-5,state.y-6,6,'#f8f9df');circle(state.x-29,state.y+9,11,'#3d5142');circle(state.x-35,state.y+5,6,'#31483d');circle(state.x-38,state.y+3,1.8,'#fff');ctx.strokeStyle='#31483d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(state.x-37,state.y);ctx.lineTo(state.x-42,state.y-8);ctx.moveTo(state.x-33,state.y);ctx.lineTo(state.x-31,state.y-9);ctx.stroke();
 ctx.restore();document.querySelector('#fruit').textContent=state.fruit;document.querySelector('#lamps').textContent=state.lit.length+' / 3';document.querySelector('#message').textContent=state.noticeTime>0?state.notice:({active:'Delivery: find the parcel in the high grove.',carrying:'Delivery: return the parcel to the courier.'}[state.quest]||'');}
function frame(t){if(running){if(last){E.step(state,keys,(t-last)/1000);persist();}camera+=(Math.max(0,Math.min(E.W-canvas.width,state.x-canvas.width*.35))-camera)*.08;}last=t;draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);

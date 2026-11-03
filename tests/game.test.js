const assert=require('node:assert/strict');const E=require('../engine.js');
let s=E.create();for(let i=0;i<60;i++)E.step(s,{right:true},1/60);assert(s.x>100,'walking moves the ball');
s=E.create();s.x=350;s.y=602;E.step(s,{flipLeft:true},1/60);assert(s.vy<0,'left flipper launches');
s=E.create();s.x=610;s.y=602;E.step(s,{flipRight:true},1/60);assert(s.vy<0,'right flipper launches');
s=E.create();s.x=200;s.y=590;E.step(s,{},1/60);assert.equal(s.fruit,1);E.step(s,{},1/60);assert.equal(s.fruit,1,'fruit collected once');
s=E.create();for(const p of E.targets){s.x=p.x;s.y=p.y;s.vx=s.vy=0;E.step(s,{},1/60)}assert.equal(s.lit.length,3);s.x=2300;s.y=590;E.step(s,{},1/60);assert(s.won,'all lanterns unlock delivery');
s=E.create();s.x=2300;s.y=590;E.step(s,{},1/60);assert(!s.won,'delivery is gated');s.y=900;E.step(s,{},1/60);assert(s.y<900,'fall returns to checkpoint');console.log('Game mechanics passed');
// A complete route using only player controls, with no state teleportation.
s=E.create();const actions=[{right:true},{left:true},{right:true,flipLeft:true},{right:true,flipRight:true},{left:true,flipRight:true},{}];for(const action of [2,3,5,0,3,5,2,0,3,2,2,0,3,1,2,1,3,0,0,3,0,1,0,3,3,0,2,2,5])for(let i=0;i<30;i++)E.step(s,actions[action],1/60);assert(s.won,'the complete island route is reachable through controls');

// Saved progress resumes at a safe region, never at an in-flight location.
s=E.create();s.x=1700;s.y=200;s.checkpoint=1600;s.collected=[0,3];s.fruit=1;s.lit=[0,2];
let restored=E.restoreProgress(E.saveProgress(s));assert.equal(restored.x,1600);assert.equal(restored.y,550);assert.deepEqual(restored.lit,[0,2]);assert.equal(restored.fruit,1);
assert.equal(E.restoreProgress({...E.saveProgress(s),lit:[0,0]}),null);assert.equal(E.restoreProgress({...E.saveProgress(s),fruit:99}),null);assert.equal(E.restoreProgress({version:99}),null);

// Optional delivery survives saves and awards its fruit only once.
s=E.create();s.x=E.courier.x;s.y=E.courier.y;E.step(s,{},1/60);assert.equal(s.quest,'active');
s.x=E.parcel.x;s.y=E.parcel.y;s.vx=s.vy=0;E.step(s,{},1/60);assert.equal(s.quest,'carrying');
s=E.restoreProgress(E.saveProgress(s));assert.equal(s.quest,'carrying');const beforeReward=s.fruit;s.x=E.courier.x;s.y=E.courier.y;E.step(s,{},1/60);assert.equal(s.quest,'done');assert.equal(s.fruit,beforeReward+2);
E.step(s,{},1/60);assert.equal(s.fruit,beforeReward+2);assert.equal(E.restoreProgress(E.saveProgress(s)).quest,'done');
const old=E.saveProgress(E.create());delete old.quest;assert.equal(E.restoreProgress(old).quest,'available');
assert.equal(E.restoreProgress({...old,quest:'invalid'}),null);
// A full delivery is reachable using only movement and flippers.
s=E.create();for(const action of [3,2,1,4,5,0,5,2,1,0,1,4,3,4,1,0,5,4,3,0,3,0,5,4,1,0,5,2,5,2,1,2,5,0,3,2,3,2,3,0,1,4,5,2,3,2,3,2,3,0,1,0,3,4,5,0,3,4,1,2,1,0,1,4,5,0,3,0,1,4,5,2,1,0,1,4,1,4,1])for(let i=0;i<30;i++)E.step(s,actions[action],1/60);assert.equal(s.quest,'done','delivery can be completed through controls');

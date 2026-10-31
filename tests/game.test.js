const assert=require('node:assert/strict');const E=require('../engine.js');
let s=E.create();for(let i=0;i<60;i++)E.step(s,{right:true},1/60);assert(s.x>100,'walking moves the ball');
s=E.create();s.x=350;s.y=602;E.step(s,{flipLeft:true},1/60);assert(s.vy<0,'left flipper launches');
s=E.create();s.x=610;s.y=602;E.step(s,{flipRight:true},1/60);assert(s.vy<0,'right flipper launches');
s=E.create();s.x=200;s.y=590;E.step(s,{},1/60);assert.equal(s.fruit,1);E.step(s,{},1/60);assert.equal(s.fruit,1,'fruit collected once');
s=E.create();for(const p of E.targets){s.x=p.x;s.y=p.y;s.vx=s.vy=0;E.step(s,{},1/60)}assert.equal(s.lit.length,3);s.x=2300;s.y=590;E.step(s,{},1/60);assert(s.won,'all lanterns unlock delivery');
s=E.create();s.x=2300;s.y=590;E.step(s,{},1/60);assert(!s.won,'delivery is gated');s.y=900;E.step(s,{},1/60);assert(s.y<900,'fall returns to checkpoint');console.log('Game mechanics passed');
// A complete route using only player controls, with no state teleportation.
s=E.create();const actions=[{right:true},{left:true},{right:true,flipLeft:true},{right:true,flipRight:true},{left:true,flipRight:true},{}];for(const action of [2,3,5,0,3,5,2,0,3,2,2,0,3,1,2,1,3,0,0,3,0,1,0,3,3,0,2,2,5])for(let i=0;i<30;i++)E.step(s,actions[action],1/60);assert(s.won,'the complete island route is reachable through controls');

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimate, createProject, normalizeDigits } from './domain.mjs';
test('Persian and Arabic digits normalize correctly',()=>assert.equal(normalizeDigits('۱۲٣۴۵'), '12345'));
test('estimate uses total floor area and breakdown reconciles',()=>{
  const result = calculateEstimate({area:200,floors:2});
  assert.equal(result.totalArea,400);
  assert.equal(result.total,7400000000);
  assert.equal(result.breakdown.reduce((a,b)=>a+b.amount,0),result.total);
});
test('structure, city and quality affect estimate',()=>{
  assert.equal(calculateEstimate({area:100,floors:1,structure:'steel',quality:'economy',city:'کرج'}).rate,13160000);
});
test('reject invalid bounds and fractional floor counts',()=>{
  for(const [area,floors] of [[0,1],[-1,2],[100,0],[100,1.5],[100,51],['bad',1]]) assert.throws(()=>calculateEstimate({area,floors}));
  assert.throws(()=>calculateEstimate({area:100,floors:1,quality:'invalid'}));
});
test('project creation validates data and initializes project',()=>{
  const p=createProject({name:'  خانه آبی  ',type:'residential',area:'۲۰۰',floors:'۲',city:'تهران',structure:'concrete',quality:'standard'},'test-id');
  assert.equal(p.name,'خانه آبی'); assert.equal(p.progress,0); assert.equal(p.budget,7400000000); assert.equal(p.id,'test-id');
  assert.throws(()=>createProject({name:'x',type:'residential',area:200,floors:1}));
});

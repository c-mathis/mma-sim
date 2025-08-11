// lib/simulateFight.ts
import { Fighter, FightResult } from './types';

type FightOptions = {
  seed?: string; // for deterministic results
  role?: 'undercard' | 'co-main' | 'main-event';
};

function generateFighterStats(fighter: Fighter) {
  // Generate stats based on hype if missing
  const base = fighter.hype;
  return {
    power: fighter.power || Math.floor(base * 0.8 + Math.random() * 40),
    grappling: fighter.grappling || Math.floor(base * 0.7 + Math.random() * 50),
    cardio: fighter.cardio || Math.floor(base * 0.9 + Math.random() * 20),
    chin: fighter.chin || Math.floor(base * 0.85 + Math.random() * 30),
  };
}

function seedRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff;
  }
  return function() {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(hash) / 0x100000000;
  };
}

export function simulateFight(
  fighterA: Fighter,
  fighterB: Fighter,
  options: FightOptions = {}
): FightResult {
  const { seed = `${fighterA.name}-${fighterB.name}-${Date.now()}`, role = 'undercard' } = options;
  const random = seedRandom(seed);
  
  const statsA = generateFighterStats(fighterA);
  const statsB = generateFighterStats(fighterB);
  
  // Role performance bonus
  const roleBonus = { 'undercard': 1, 'co-main': 1.05, 'main-event': 1.1 }[role];
  
  // Calculate overall combat effectiveness with role bonus
  const effectivenessA = (statsA.power + statsA.grappling + statsA.cardio + statsA.chin) / 4 * roleBonus;
  const effectivenessB = (statsB.power + statsB.grappling + statsB.cardio + statsB.chin) / 4;
  
  // Determine winner with some RNG
  const advantageA = effectivenessA / (effectivenessA + effectivenessB);
  const winnerIsA = random() < advantageA;
  
  const winner = winnerIsA ? fighterA.name : fighterB.name;
  const loser = winnerIsA ? fighterB.name : fighterA.name;
  const winnerStats = winnerIsA ? statsA : statsB;
  const loserStats = winnerIsA ? statsB : statsA;
  
  // Determine method based on fighter attributes
  let method: 'KO' | 'Sub' | 'Dec';
  let round: number;
  let notes: string;
  
  const powerDiff = Math.abs(winnerStats.power - loserStats.power);
  const grapplingDiff = Math.abs(winnerStats.grappling - loserStats.grappling);
  const methodRoll = random();
  
  if (methodRoll < 0.3 && powerDiff > 15) {
    method = 'KO';
    round = Math.min(3, Math.floor(random() * 3) + 1);
    notes = powerDiff > 30 ? 'Brutal knockout!' : 'Clean finish';
  } else if (methodRoll < 0.5 && grapplingDiff > 20) {
    method = 'Sub';
    round = Math.min(5, Math.floor(random() * 4) + 1);
    notes = grapplingDiff > 35 ? 'Dominant submission' : 'Technical submission';
  } else {
    method = 'Dec';
    round = 3;
    const scoreDiff = Math.floor((effectivenessA - effectivenessB) / 10);
    notes = Math.abs(scoreDiff) > 2 ? 'Unanimous decision' : 'Close split decision';
  }
  
  // Calculate damage (loser takes more)
  const baseDamage = method === 'KO' ? 80 : method === 'Sub' ? 40 : 60;
  const winnerDamage = Math.floor(baseDamage * 0.3 + random() * 20);
  const loserDamage = Math.floor(baseDamage * 0.8 + random() * 20);
  
  // Calculate viewers impact (higher hype fighters = more impact)
  const avgHype = (fighterA.hype + fighterB.hype) / 2;
  const methodMultiplier = { 'KO': 1.3, 'Sub': 1.1, 'Dec': 0.9 }[method];
  const roleMultiplier = { 'undercard': 0.8, 'co-main': 1.0, 'main-event': 1.2 }[role];
  const viewersImpact = Math.floor(avgHype * methodMultiplier * roleMultiplier * (0.8 + random() * 0.4));
  
  return {
    winner,
    loser,
    method,
    round,
    notes,
    damage: {
      [winner]: winnerDamage,
      [loser]: loserDamage,
    },
    viewersImpact: Math.min(100, viewersImpact),
  };
}
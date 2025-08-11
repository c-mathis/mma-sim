// lib/types.ts
export type Fighter = {
  name: string;
  weightClass: number;
  hype: number;
  record: string;
  status: string;
  // Optional fighting attributes (auto-generated from hype if missing)
  power?: number;
  grappling?: number;
  cardio?: number;
  chin?: number;
};

export type FightResult = {
  winner: string;
  loser: string;
  method: 'KO' | 'Sub' | 'Dec';
  round: number;
  notes: string;
  damage: {
    [fighterName: string]: number; // damage taken (0-100)
  };
  viewersImpact: number; // contribution to card rating (0-100)
};

export type ContractOffer = {
  fighterName: string;
  basePay: string;
  bonus: string;
  role: 'undercard' | 'co-main' | 'main-event';
};
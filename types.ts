
export enum SkillTier {
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
  SPECIAL = 20,
}

export interface Skill {
  id: string;
  name: string;
  points: number;
  tier: SkillTier;
  description: string;
}

export interface GameState {
  hp: number;
  turn: number;
  history: string[];
  isGameOver: boolean;
}

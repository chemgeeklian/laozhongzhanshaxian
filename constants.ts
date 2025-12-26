
import { Skill, SkillTier } from './types';

export const INITIAL_HP = 100;
export const KILL_BASE_POINTS = 20;

export const SKILLS_POOL: Skill[] = [
  // Tier 1
  { id: '1-1', name: '地沟油', points: 1, tier: SkillTier.TIER_1, description: '油罐车大豆油啊嗯' },
  { id: '1-2', name: '食物中毒', points: 1, tier: SkillTier.TIER_1, description: '铅离子香啊造啊' },
  { id: '1-3', name: '空气污染', points: 1, tier: SkillTier.TIER_1, description: 'PM2500000' },
  { id: '1-4', name: '外卖被偷', points: 1, tier: SkillTier.TIER_1, description: '俺寻思这外卖也没人要' },
  
  // Tier 2
  { id: '2-1', name: '房贷', points: 2, tier: SkillTier.TIER_2, description: '配合烂尾楼食用更佳' },
  { id: '2-2', name: '996过劳', points: 2, tier: SkillTier.TIER_2, description: '同学，这是福报' },
  { id: '2-3', name: '寻衅滋事', points: 2, tier: SkillTier.TIER_2, description: '还能说话吗' },
  { id: '2-4', name: '父母催婚', points: 2, tier: SkillTier.TIER_2, description: '你都快30了，后面忘了' },
  { id: '2-5', name: '家庭暴力', points: 2, tier: SkillTier.TIER_2, description: '爱人TV' },

  // Tier 3
  { id: '3-1', name: '公司裁员', points: 3, tier: SkillTier.TIER_3, description: '毕业了，优化了' },
  { id: '3-2', name: '子女不孝', points: 3, tier: SkillTier.TIER_3, description: '军体拳' },
  { id: '3-3', name: '考公失败', points: 3, tier: SkillTier.TIER_3, description: '啥时候能上岸啊' },
  { id: '3-4', name: '投资暴雷', points: 3, tier: SkillTier.TIER_3, description: '爆仓跑路咯' },
];

export const SPECIAL_SKILL_TEMPLATE: Skill = {
  id: 'kill-cancer',
  name: '确诊癌症',
  points: 10,
  tier: SkillTier.SPECIAL,
  description: '这辈子有了'
};

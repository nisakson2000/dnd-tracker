/**
 * playerToolProfRankingGuide.js
 * Player Mode: Tool proficiency guide — all tools ranked and uses
 * Pure JS — no React dependencies.
 */

export const TOOL_RULES = {
  proficiency: 'Add PB to checks using the tool.',
  overlap: 'Xanathar\'s: tool + skill proficiency = advantage.',
  training: '10 workweeks + 25 gp/week (Xanathar\'s).',
};

export const TOOLS_RANKED = [
  { tool: 'Thieves\' Tools', rating: 'S+', check: 'DEX', uses: 'Pick locks, disarm traps.', note: 'Most checked tool.' },
  { tool: 'Herbalism Kit', rating: 'A+', check: 'WIS', uses: 'Brew healing potions.', note: 'Downtime potion crafting.' },
  { tool: 'Tinker\'s Tools', rating: 'A+', check: 'INT', uses: 'Repair, craft clockwork.', note: 'Gnomes free. Artificer essential.' },
  { tool: 'Smith\'s Tools', rating: 'A', check: 'STR', uses: 'Repair metal equipment.', note: 'Field repairs.' },
  { tool: 'Alchemist\'s Supplies', rating: 'A', check: 'INT', uses: 'Craft potions, acid, fire.', note: 'Craft alchemist\'s fire.' },
  { tool: 'Cook\'s Utensils', rating: 'A', check: 'WIS', uses: 'Meals. Chef feat synergy.', note: '+1d8 temp HP treats.' },
  { tool: 'Disguise Kit', rating: 'A', check: 'CHA', uses: 'Create disguises.', note: 'Stacks with Disguise Self.' },
  { tool: 'Navigator\'s Tools', rating: 'B+', check: 'WIS', uses: 'Navigate. Sea travel.', note: 'Nautical campaigns.' },
  { tool: 'Forgery Kit', rating: 'B', check: 'DEX', uses: 'Fake documents.', note: 'Social campaigns.' },
  { tool: 'Poisoner\'s Kit', rating: 'B', check: 'INT', uses: 'Craft/identify poisons.', note: 'Poison commonly resisted.' },
  { tool: 'Gaming Sets', rating: 'C', check: 'INT', uses: 'Gambling.', note: 'Downtime only.' },
];

export const TOOL_SKILL_COMBOS = [
  { tool: 'Thieves\' Tools + Investigation', result: 'Advantage on trap searches.' },
  { tool: 'Herbalism Kit + Nature', result: 'Advantage on plant identification.' },
  { tool: 'Disguise Kit + Deception', result: 'Advantage on maintaining disguise.' },
  { tool: 'Smith\'s Tools + History', result: 'Advantage on identifying weapon origin.' },
];

export const TOOL_TIPS = [
  'Thieves\' Tools: most important. Rogue expertise = auto-pass.',
  'Herbalism Kit: craft healing potions in downtime.',
  'Tool + skill = advantage (Xanathar\'s).',
  'Chef feat: Cook\'s Utensils proficiency needed.',
  'Smith\'s Tools: repair armor/weapons in the field.',
  'Training: 10 workweeks. Worth investing in Thieves\' Tools.',
  'Background gives free tool proficiency.',
];

/**
 * playerHypnoticPatternGuide.js
 * Player Mode: Hypnotic Pattern optimization — the best L3 crowd control
 * Pure JS — no React dependencies.
 */

export const HYPNOTIC_PATTERN_BASICS = {
  spell: 'Hypnotic Pattern',
  level: 3,
  school: 'Illusion',
  castingTime: '1 action',
  range: '120ft',
  area: '30ft cube',
  components: 'S, M (glowing stick of incense or crystal vial of phosphorescent material)',
  duration: 'Concentration, up to 1 minute',
  save: 'WIS saving throw',
  classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
  note: 'The best L3 AoE control spell in the game. Incapacitated + speed 0 = out of combat. No repeated saves — only ends when damaged or shaken awake.',
};

export const HYPNOTIC_PATTERN_EFFECTS = {
  onFail: 'Charmed + Incapacitated + Speed 0 for 1 minute.',
  incapacitated: 'Can\'t take actions or reactions.',
  noRepeatedSaves: 'NO repeated saves each turn. Lasts until damaged or another creature uses an action to shake them.',
  breakConditions: ['Taking any damage', 'Another creature uses its action to shake the target awake'],
  note: 'No repeated saves is what makes this spell elite. Unlike Hold Person, failed enemies stay incapacitated until allies waste actions shaking them.',
};

export const HYPNOTIC_PATTERN_TACTICS = [
  { tactic: 'Target WIS-weak groups', detail: 'Best vs groups of low-WIS enemies: bandits, beasts, soldiers. One cast can remove 3-6 enemies from combat.', rating: 'S' },
  { tactic: 'Don\'t damage incapacitated targets', detail: 'Damage breaks the effect. Focus fire on enemies that saved. Leave incapacitated enemies for last.', rating: 'S' },
  { tactic: 'Action tax on enemies', detail: 'Even if allies shake some awake: shaking costs their ACTION. That\'s an action not spent attacking.', rating: 'S' },
  { tactic: 'Position to avoid allies', detail: '30ft cube. Position it so it only hits enemies. Coordinate with party positioning before casting.', rating: 'A' },
  { tactic: 'Combo with AoE damage after', detail: 'Hypnotic Pattern → party focuses on enemies that saved → when ready, AoE the incapacitated group. Fireball to finish.', rating: 'A' },
  { tactic: 'Warlock at-will usage', detail: 'Warlocks recover L3 slots on short rest. Can use Hypnotic Pattern multiple times per adventuring day. Incredible value.', rating: 'S' },
];

export const HYPNOTIC_PATTERN_VS_ALTERNATIVES = [
  { spell: 'Hypnotic Pattern', pros: 'No repeated saves, incapacitated, 120ft range, 30ft cube', cons: 'WIS save, concentration, breaking on damage requires tactics', rating: 'S' },
  { spell: 'Fear', pros: 'Enemies dash away (removes from combat), repeated saves', cons: 'Enemies get repeated saves, line of sight breaks it, enemies run unpredictably', rating: 'A' },
  { spell: 'Slow', pros: 'Halves actions/reactions/speed/AC, no incapacitate but still strong', cons: 'Repeated saves, less impactful than full incapacitate', rating: 'A' },
  { spell: 'Stinking Cloud', pros: 'No save to enter, CON save to not waste action', cons: 'Heavily obscured blocks YOUR sight too, CON is a strong save', rating: 'B' },
];

export function expectedEnemiesFailing(numberOfEnemies, avgWisSaveMod, saveDC) {
  const failChance = Math.min(0.95, Math.max(0.05, 1 - (avgWisSaveMod + 20 - saveDC) / 20));
  return Math.round(numberOfEnemies * failChance * 10) / 10;
}

export function actionTaxValue(enemiesIncapacitated) {
  // Each incapacitated enemy requires an ally action to shake awake
  return { actionsWasted: enemiesIncapacitated, note: `${enemiesIncapacitated} enemy actions spent shaking allies = ${enemiesIncapacitated} actions removed from enemy side` };
}

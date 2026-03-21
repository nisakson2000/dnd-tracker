/**
 * playerSpellScrollGuide.js
 * Player Mode: Spell scroll rules, creation, and use
 * Pure JS — no React dependencies.
 */

export const SPELL_SCROLL_BASICS = {
  whatIsIt: 'A scroll containing a spell. Anyone whose class spell list includes the spell can use it. If the spell level exceeds your casting ability, make an ability check (DC 10 + spell level) or the scroll is wasted.',
  consumable: 'Scroll is destroyed after use, whether it succeeds or fails.',
  note: 'Spell scrolls let you cast spells without using a spell slot. If the spell is on your list and your level, auto-success. If above your level: ability check required.',
};

export const SCROLL_RULES = {
  whoCanUse: 'Any creature with the spell on their class spell list (including subclass expanded lists).',
  castingTime: 'Same as the spell\'s normal casting time. Can\'t be cast as ritual from a scroll.',
  concentration: 'Yes — if the spell requires concentration, you concentrate.',
  components: 'No material components needed (scroll provides them). V and S components still required unless noted.',
  saveDC: 'Uses the scroll\'s save DC, NOT your own. See table below.',
  attackBonus: 'Uses the scroll\'s attack bonus, NOT your own.',
  abilityCheck: 'If spell level > your highest spell slot: DC = 10 + spell level. Failure = scroll destroyed, spell not cast.',
};

export const SCROLL_STATS = [
  { level: 'Cantrip', saveDC: 13, attackBonus: 5, rarity: 'Common', note: 'Cantrip at set DC.' },
  { level: 1, saveDC: 13, attackBonus: 5, rarity: 'Common', note: 'Easy to find and use.' },
  { level: 2, saveDC: 13, attackBonus: 5, rarity: 'Uncommon', note: 'Same DC as L1.' },
  { level: 3, saveDC: 15, attackBonus: 7, rarity: 'Uncommon', note: 'DC increases.' },
  { level: 4, saveDC: 15, attackBonus: 7, rarity: 'Rare', note: 'Same DC as L3.' },
  { level: 5, saveDC: 17, attackBonus: 9, rarity: 'Rare', note: 'Good DC.' },
  { level: 6, saveDC: 17, attackBonus: 9, rarity: 'Very Rare', note: 'Same DC as L5.' },
  { level: 7, saveDC: 18, attackBonus: 10, rarity: 'Very Rare', note: 'High DC.' },
  { level: 8, saveDC: 18, attackBonus: 10, rarity: 'Very Rare', note: 'Same DC as L7.' },
  { level: 9, saveDC: 19, attackBonus: 11, rarity: 'Legendary', note: 'Highest DC. Wish scroll.' },
];

export const SCROLL_CREATION = {
  rules: 'Xanathar\'s Guide downtime activity. Requires: spell known/prepared, materials, gold, time.',
  requirements: [
    { level: 'Cantrip', time: '1 day', cost: '15 gp' },
    { level: 1, time: '1 day', cost: '25 gp' },
    { level: 2, time: '3 days', cost: '250 gp' },
    { level: 3, time: '1 week', cost: '500 gp' },
    { level: 4, time: '2 weeks', cost: '2,500 gp' },
    { level: 5, time: '4 weeks', cost: '5,000 gp' },
    { level: 6, time: '8 weeks', cost: '15,000 gp' },
    { level: 7, time: '16 weeks', cost: '25,000 gp' },
    { level: 8, time: '32 weeks', cost: '50,000 gp' },
    { level: 9, time: '48 weeks', cost: '250,000 gp' },
  ],
  note: 'Must have the spell prepared each day of scribing. Costs add up fast for high-level scrolls.',
};

export const SCROLL_TACTICS = [
  { tactic: 'Emergency spells', detail: 'Keep Revivify, Counterspell, or Dispel Magic scrolls for emergencies. No spell slot cost.', rating: 'S' },
  { tactic: 'Spells you don\'t prepare', detail: 'Scroll of Water Breathing, Tongues, or Gentle Repose. Situational spells without wasting preparation slots.', rating: 'A' },
  { tactic: 'Wizard scroll copying', detail: 'Wizards can copy spell scrolls into their spellbook (2 hours + 50gp per spell level). Scroll is consumed.', rating: 'S' },
  { tactic: 'Thief Use Magic Device', detail: 'L13 Thief Rogue: ignore class requirements. Cast ANY spell scroll regardless of class list.', rating: 'S' },
  { tactic: 'Above-level casting', detail: 'A L5 Wizard with a L9 scroll: DC 19 ability check (INT). Risky but possible. Arcana proficiency doesn\'t help (it\'s a flat ability check).', rating: 'B' },
];

export function scrollAbilityCheckDC(spellLevel) {
  return 10 + spellLevel;
}

export function canUseWithoutCheck(characterSpellSlotMax, scrollLevel) {
  return characterSpellSlotMax >= scrollLevel;
}

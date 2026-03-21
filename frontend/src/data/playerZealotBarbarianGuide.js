/**
 * playerZealotBarbarianGuide.js
 * Player Mode: Path of the Zealot Barbarian — divine fury and free resurrection
 * Pure JS — no React dependencies.
 */

export const ZEALOT_BASICS = {
  class: 'Barbarian (Path of the Zealot)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Holy warrior who refuses to die. Free resurrection and divine damage.',
  note: 'Best Barbarian subclass for many. Extra damage, free res, and Rage Beyond Death is legendary.',
};

export const ZEALOT_FEATURES = [
  { feature: 'Divine Fury', level: 3, effect: 'First hit each turn while raging: +1d6+half Barbarian level radiant or necrotic damage.', note: 'Extra damage every turn. Scales with level. Choose radiant (better) or necrotic at rage start.' },
  { feature: 'Warrior of the Gods', level: 3, effect: 'Spells that restore you to life (Revivify, Raise Dead, etc.) don\'t require material components for you.', note: 'Free resurrection! No 300gp diamond for Revivify. No 500gp for Raise Dead. Die freely.' },
  { feature: 'Fanatical Focus', level: 6, effect: 'If you fail a saving throw while raging, reroll it. Must use new roll. Once per rage.', note: 'Free Legendary Resistance once per rage. Fail a Hold Person save? Reroll.' },
  { feature: 'Zealous Presence', level: 10, effect: 'Bonus action: 10 creatures within 60ft gain advantage on attacks and saves until start of your next turn. Once per long rest.', note: 'Party-wide advantage on EVERYTHING for a round. Cast before a nova turn.' },
  { feature: 'Rage Beyond Death', level: 14, effect: 'While raging, dropping to 0 HP doesn\'t knock you unconscious. You still make death saves. You die only if rage ends and you have 0 HP.', note: 'CANNOT DIE WHILE RAGING. Take 200 damage? Still standing. Just don\'t let rage end (attack every turn).' },
];

export const ZEALOT_TACTICS = [
  { tactic: 'Die freely strategy', detail: 'Warrior of the Gods = free res. Play aggressively. Die? Free Revivify. No resource cost to the party.', rating: 'S', note: 'You\'re the most expendable party member. Charge into danger. It costs nothing to bring you back.' },
  { tactic: 'Rage Beyond Death + Healing Word', detail: 'L14: Drop to 0, keep fighting. Ally casts Healing Word (1 HP). You\'re back. Never actually die.', rating: 'S', note: 'As long as someone has Healing Word, you literally cannot die while raging.' },
  { tactic: 'Divine Fury damage', detail: '1d6+half level extra per turn. At L20: 1d6+10 per turn. Significant sustained damage.', rating: 'A' },
  { tactic: 'Zealous Presence timing', detail: 'Use before the party\'s nova round. Everyone gets advantage on attacks AND saves. Coordinate big turns.', rating: 'A' },
  { tactic: 'Fanatical Focus vs save-or-suck', detail: 'Enemy casts Hold Person? Banishment? Reroll the save. Once per rage but rages are plentiful.', rating: 'A' },
  { tactic: 'Rage Beyond Death + Relentless Rage (L11)', detail: 'Relentless Rage: CON save to go to 1 HP instead of 0. THEN if you hit 0: Rage Beyond Death keeps you up.', rating: 'S' },
];

export const ZEALOT_VS_TOTEM = {
  zealot: { pros: ['Extra damage every turn', 'Free resurrection', 'Save reroll (per rage)', 'Party-wide advantage', 'Cannot die at L14'], cons: ['Less tanky (no Bear resistance)', 'Less utility (no Eagle/Elk mobility)'] },
  totem: { pros: ['Bear: resistance to everything (best tank)', 'Wolf: pack advantage', 'Eagle/Elk: mobility', 'Mix and match at L6/14'], cons: ['No extra damage', 'No free res', 'No save reroll'] },
  verdict: 'Zealot for aggressive play and free res. Totem Bear for pure tanking. Both top-tier.',
};

export function divineFuryDamage(barbarianLevel) {
  return 3.5 + Math.floor(barbarianLevel / 2); // 1d6 + half level
}

export function rageBeyondDeathTurns(currentDeathSaves) {
  // Max turns you can survive at 0 HP while raging
  // You make death saves each turn. 3 fails = death when rage ends
  // But if healed before rage ends, saves reset
  return 3 - currentDeathSaves; // Turns until 3 failures (if failing all)
}

export function zealousPresenceTargets() {
  return 10; // Up to 10 creatures within 60ft
}

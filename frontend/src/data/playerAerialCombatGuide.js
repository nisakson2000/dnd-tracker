/**
 * playerAerialCombatGuide.js
 * Player Mode: Aerial/flying combat rules and tactics
 * Pure JS — no React dependencies.
 */

export const FLYING_RULES = {
  fallingDamage: '1d6 per 10 feet fallen (max 20d6 = 120 damage at 200ft).',
  fallingSpeed: 'RAW: fall 500ft instantly at end of turn. Xanathar\'s: 500ft per round.',
  proneWhileFlying: 'Going prone while flying = you fall. Stunned/incapacitated while flying = you fall.',
  concentrationFall: 'If flying via Fly spell and concentration drops = you fall. No save.',
  hoverVsFly: 'Hover: can stay in place. Regular fly: must move or fall (DM-dependent, many ignore this).',
  opportunity_attacks: 'Flying out of reach provokes opportunity attacks. Fly UP, not sideways.',
  difficultTerrain: 'No difficult terrain in the air (unless magical wind/storm effects).',
};

export const FLYING_SOURCES = [
  { source: 'Aarakocra', type: 'Racial', speed: 50, note: 'Fastest racial flight. Available at L1. Can\'t wear medium/heavy armor.', rating: 'S' },
  { source: 'Fairy', type: 'Racial', speed: 30, note: 'Small size flight at L1. No armor restriction.', rating: 'S' },
  { source: 'Owlin', type: 'Racial', speed: 30, note: 'Flight + 120ft darkvision + Stealth prof. Silent flyer.', rating: 'S' },
  { source: 'Winged Tiefling', type: 'Racial', speed: 30, note: 'Variant Tiefling. 30ft fly. Can\'t wear heavy armor.', rating: 'A' },
  { source: 'Fly spell', type: 'Spell (L3)', speed: 60, note: 'Concentration. 10 min. 60ft fly is fast. Falls when concentration drops.', rating: 'A' },
  { source: 'Draconic Sorcerer L14', type: 'Class', speed: 30, note: 'Permanent 30ft fly. No concentration. Very late.', rating: 'A' },
  { source: 'Totem Barbarian L14 (Eagle)', type: 'Class', speed: '= walking', note: 'Only while raging. Falls at end of turn if not moving. Not hover.', rating: 'B' },
  { source: 'Broom of Flying', type: 'Magic item', speed: 50, note: 'Uncommon magic item. 50ft fly. Can carry rider.', rating: 'A' },
  { source: 'Winged Boots', type: 'Magic item', speed: '= walking', note: 'Uncommon. Fly = walk speed. 4 hours total/day. Recharges 2 hrs per 12 hrs unused.', rating: 'A' },
];

export const AERIAL_TACTICS = [
  { tactic: 'Fly + ranged attacks', detail: 'Stay 60+ ft above enemies. Use bow/spells. Melee enemies can\'t reach you.', rating: 'S', note: 'Completely shuts down non-ranged enemies.' },
  { tactic: 'Flyby attacks', detail: 'Fly in, attack, fly out of reach. Mobile feat or Flyby trait: no opportunity attacks.', rating: 'S' },
  { tactic: 'Grapple and drop', detail: 'Grapple enemy → fly up → drop. 1d6 per 10ft. Athletics check to grapple. Need free hand + fly speed.', rating: 'A', note: 'At 100ft drop: 10d6 (35 avg). Both of you fall if grappled in the air and you go prone.' },
  { tactic: 'Height advantage', detail: 'Many DMs give advantage for attacking from above. Not RAW but common house rule.', rating: 'B' },
  { tactic: 'Dive bomb', detail: 'Start high, dive down (60ft+ movement), attack, use remaining movement to fly back up.', rating: 'A' },
];

export const ANTI_FLYING_TACTICS = [
  { counter: 'Ranged attacks', detail: 'Bows, crossbows, cantrips. Most effective basic counter.', rating: 'A' },
  { counter: 'Dispel Magic', detail: 'If flying via spell, Dispel Magic ends it. Target falls.', rating: 'S' },
  { counter: 'Counterspell', detail: 'Counter the Fly spell before it takes effect.', rating: 'S' },
  { counter: 'Earthbind (L2)', detail: 'Transmutation: STR save or fly speed reduced to 0. Creature descends 60ft/round.', rating: 'A' },
  { counter: 'Hold Person/Monster', detail: 'Incapacitated = can\'t fly = falls.', rating: 'S' },
  { counter: 'Wind Wall', detail: 'Blocks ranged attacks through it. Forces flying creatures away.', rating: 'B' },
  { counter: 'Prone effects', detail: 'Any effect that knocks prone: flying creature falls.', rating: 'A' },
];

export function fallingDamage(distanceFeet) {
  const dice = Math.min(20, Math.floor(distanceFeet / 10));
  return dice * 3.5; // average d6
}

export function grappleAndDropDamage(flySpeed, strengthMod) {
  const maxHeight = Math.floor(flySpeed / 2); // half speed carrying grappled creature
  return fallingDamage(maxHeight);
}

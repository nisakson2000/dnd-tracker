/**
 * playerTankBuildGuide.js
 * Player Mode: Tank builds — drawing aggro, high AC, and damage mitigation
 * Pure JS — no React dependencies.
 */

export const TANK_PHILOSOPHY = {
  role: 'Absorb damage, control enemy positioning, protect squishies.',
  keyMetrics: ['High AC', 'High HP', 'Threat generation (force enemies to target you)', 'Damage mitigation (resistance, temp HP)'],
  note: '5e has no taunt mechanic. Tanks must use features and positioning to force enemies to deal with them.',
};

export const BEST_TANK_SUBCLASSES = [
  { subclass: 'Bear Totem Barbarian', class: 'Barbarian', rating: 'S+', keyFeature: 'Resistance to ALL damage (except psychic) while raging.', note: 'Effectively double HP. Stand in fire, acid, whatever. You don\'t care.' },
  { subclass: 'Ancestral Guardian Barbarian', class: 'Barbarian', rating: 'S+', keyFeature: 'First creature you hit has disadvantage attacking anyone except you. Others get resistance.', note: 'Best "taunt" in 5e. Force enemies to target you or suffer.' },
  { subclass: 'Armorer Artificer (Guardian)', class: 'Artificer', rating: 'S', keyFeature: 'Thunder Gauntlets: hit = target has disadvantage attacking anyone except you. INT-based.', note: 'INT tank. Heavy armor. Built-in aggro mechanic on every hit.' },
  { subclass: 'Cavalier Fighter', class: 'Fighter', rating: 'A+', keyFeature: 'Unwavering Mark: marked target has disadvantage attacking others. Warding Maneuver.', note: 'Mark + protect allies. Infinite OAs at L18.' },
  { subclass: 'Conquest Paladin', class: 'Paladin', rating: 'S', keyFeature: 'Aura of Conquest: frightened creatures within 10ft have speed 0 + take psychic damage.', note: 'Fear + aura = permanent lockdown. Enemies can\'t move or fight effectively.' },
  { subclass: 'Forge Cleric', class: 'Cleric', rating: 'A+', keyFeature: 'Free +1 armor. Soul of the Forge: +1 AC in heavy armor. Fire immunity at L17.', note: 'Highest AC cleric. Plate + shield + Soul of Forge + Cloak of Protection = 22+ AC.' },
  { subclass: 'Crown Paladin', class: 'Paladin', rating: 'A', keyFeature: 'Champion Challenge: creatures within 30ft can\'t move away (WIS save).', note: 'Lock enemies near you. Spirit Guardians access.' },
  { subclass: 'Twilight Cleric', class: 'Cleric', rating: 'S+', keyFeature: 'Twilight Sanctuary: 1d6+level temp HP to all allies every round.', note: 'Not a traditional tank but: party takes less damage. Walking damage shield.' },
];

export const TANK_AC_MAXIMIZATION = [
  { source: 'Plate Armor', ac: 18, note: 'Base heavy armor.' },
  { source: 'Shield', ac: '+2', note: '+2 AC. Total: 20.' },
  { source: 'Defense Fighting Style', ac: '+1', note: '+1 while wearing armor. Total: 21.' },
  { source: 'Cloak of Protection', ac: '+1', note: '+1 AC + saves. Attunement. Total: 22.' },
  { source: 'Ring of Protection', ac: '+1', note: 'Stacks with Cloak. Attunement. Total: 23.' },
  { source: '+3 Plate Armor', ac: 21, note: 'Replaces regular plate. Total: 26 with all above.' },
  { source: '+3 Shield', ac: '+5', note: 'Replaces regular shield. Even higher.' },
  { source: 'Shield of Faith (spell)', ac: '+2', note: 'Concentration. Temporary boost.' },
  { source: 'Shield (spell)', ac: '+5', note: 'Reaction. Until start of next turn.' },
  { source: 'Haste', ac: '+2', note: 'From ally caster. Concentration.' },
];

export const TANK_FEAT_PRIORITY = [
  { feat: 'Sentinel', rating: 'S+', note: 'OA = speed 0. OA even if they Disengage. OA when ally attacked. Core tank feat.' },
  { feat: 'Polearm Master', rating: 'S (with Sentinel)', note: 'OA when entering 10ft reach. PAM+Sentinel = enemies can\'t approach.' },
  { feat: 'Shield Master', rating: 'A+', note: 'BA shove (prone) after Attack. Add shield AC to DEX saves. Evasion-like.' },
  { feat: 'Heavy Armor Master', rating: 'A (early)', note: '-3 from all nonmagical bludgeoning/piercing/slashing. Falls off at high levels.' },
  { feat: 'Tough', rating: 'A', note: '+2 HP/level. Simple but massive.' },
  { feat: 'Resilient (WIS)', rating: 'A', note: 'Shore up mental saves. Tanks hate being charmed/frightened away.' },
];

export const TANK_TACTICS = [
  'Position between enemies and squishies. Force enemies to go through you.',
  'Sentinel: OA anyone who attacks your ally within 5ft. Speed = 0. They\'re stuck.',
  'Grapple + Shove: grab an enemy, knock them prone. Advantage for all melee allies.',
  'Dodge action when overwhelmed. Disadvantage on ALL attacks against you.',
  'Spirit Guardians + Dodge: AoE damage while being nearly unhittable.',
  'Shield of Faith: +2 AC for 10 minutes. Cast before combat if possible.',
  'Ancestral Guardian: hit the boss → they have disadvantage on everyone else. Best taunt.',
  'Reckless Attack (Barbarian): gives enemies advantage but also gives YOU advantage. Trade AC for damage.',
];

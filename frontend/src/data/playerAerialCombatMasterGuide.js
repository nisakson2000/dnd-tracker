/**
 * playerAerialCombatMasterGuide.js
 * Player Mode: Aerial/flying combat rules and strategies
 * Pure JS — no React dependencies.
 */

export const FLYING_RULES = {
  basic: 'A flying creature that is knocked prone, has its speed reduced to 0, or is otherwise unable to move falls.',
  hover: 'Creatures with hover in their fly speed don\'t fall when knocked prone or at 0 speed.',
  falling: 'You fall 500 feet instantly at the end of your turn. If you hit the ground, take 1d6/10ft (max 20d6).',
  windConditions: 'Strong wind: disadvantage on ranged attacks. DM may require Athletics checks to fly.',
};

export const FLYING_SOURCES_PLAYER = [
  { source: 'Aarakocra race', speed: '50ft fly', note: 'Fastest racial flight. No armor restriction.', rating: 'S' },
  { source: 'Fairy race', speed: '30ft fly', note: 'Small size + flight. Works with armor.', rating: 'S' },
  { source: 'Owlin race', speed: '30ft fly', note: 'Flight + darkvision 120ft + Stealth prof.', rating: 'S' },
  { source: 'Fly spell (L3)', speed: '60ft fly', note: 'Concentration. 10 min. Fastest spell flight.', rating: 'A+' },
  { source: 'Winged Boots', speed: 'Walk speed fly', note: 'Magic item (uncommon). 4 hours/day. No concentration.', rating: 'S' },
  { source: 'Broom of Flying', speed: '50ft fly', note: 'Magic item (uncommon). No attunement.', rating: 'A+' },
  { source: 'Draconic Sorcerer L14', speed: '30ft fly', note: 'Class feature. Always active. No concentration.', rating: 'A+' },
  { source: 'Eagle Totem Barbarian L14', speed: 'Equal to walk', note: 'Only while raging. Falls if you end turn midair.', rating: 'B+' },
  { source: 'Wild Shape (flying forms)', speed: 'Varies', note: 'Druid at L8+. Giant Eagle (80ft fly).', rating: 'A' },
];

export const AERIAL_COMBAT_TACTICS = [
  { tactic: 'Stay out of melee range', detail: 'Fly 30ft+ above enemies. Most melee attackers can\'t reach you.', rating: 'S' },
  { tactic: 'Dive attack', detail: 'Fly down → melee attack → fly back up. Provokes OA unless you Disengage.', rating: 'A' },
  { tactic: 'Ranged superiority', detail: 'Stay at max range in the air. Longbow from 200ft up = untouchable.', rating: 'S' },
  { tactic: 'Drop concentration target', detail: 'Target the flyer\'s concentration. Fly ends = they fall.', rating: 'S (counter)' },
  { tactic: 'Grapple and drop', detail: 'Fly up while grappling → release → enemy falls.', rating: 'A+' },
  { tactic: 'Carry allies', detail: 'Fly speed + carrying capacity = airlift party across obstacles.', rating: 'A' },
];

export const ANTI_FLYING_TACTICS = [
  { method: 'Dispel Magic', detail: 'End Fly spell → target falls. Devastating.', rating: 'S' },
  { method: 'Earthbind (L2)', detail: 'Reduces fly speed to 0. STR save. Falls immediately.', rating: 'A+' },
  { method: 'Hold Person/Monster', detail: 'Paralyzed = can\'t fly = falls.', rating: 'S' },
  { method: 'Ranged attacks', detail: 'Standard counter. Longbow, crossbow, spells.', rating: 'A+' },
  { method: 'Net', detail: 'Restrained = speed 0 = falls if flying.', rating: 'B' },
  { method: 'Telekinesis', detail: 'Grab them and pull them down.', rating: 'A' },
];

export const FALLING_DAMAGE_TACTICS = {
  damage: '1d6 per 10 feet, max 20d6 (200ft)',
  average20d6: 70,
  mitigation: [
    'Feather Fall (reaction): safe landing for 5 creatures.',
    'Slow Fall (Monk): reduce by 5× Monk level.',
    'Wild Shape into flying form before impact.',
    'Misty Step to safety.',
  ],
  weaponize: [
    'Reverse Gravity (L7): 100ft up → 10d6, then again when it ends.',
    'Telekinesis: lift and drop.',
    'Grapple + fly + release.',
    'Dispel Magic on Fly: instant fall damage.',
  ],
};

/**
 * playerFeyCrossingRules.js
 * Player Mode: Feywild and Shadowfell crossing rules and effects
 * Pure JS — no React dependencies.
 */

export const FEYWILD_EFFECTS = {
  name: 'Feywild',
  timeDistortion: 'Time passes differently. 1 hour in the Feywild might be 1 day, 1 week, or even years on the Material Plane (or vice versa). DM rolls on the Feywild Time Warp table.',
  memory: 'Creatures that leave the Feywild may find their memories of the visit become hazy, like a dream.',
  magic: 'Magic feels more vibrant. Colors are brighter, sounds are sharper.',
  mood: 'Emotions are heightened. Joy becomes euphoria, sadness becomes despair.',
  rules: [
    'Food and drink may create dependency — eating fey food can trap you.',
    'Names have power — giving your true name may grant fey influence over you.',
    'Deals are binding — fey bargains are magically enforced.',
    'Iron is harmful to many fey creatures.',
    'Beware circles of mushrooms, standing stones, and twilight crossroads.',
  ],
};

export const SHADOWFELL_EFFECTS = {
  name: 'Shadowfell',
  despair: 'After each long rest in the Shadowfell, DC 10 WIS save or gain a random form of Shadowfell Despair.',
  despairTypes: [
    { type: 'Apathy', effect: 'Disadvantage on death saves and initiative. Overcome by dealing the killing blow on a hostile creature.' },
    { type: 'Dread', effect: 'Disadvantage on all saves. Overcome by spending 10 minutes in prayer/meditation.' },
    { type: 'Madness', effect: 'Disadvantage on ability checks and saves. Overcome by using an action to make a DC 15 WIS save.' },
  ],
  magic: 'Necromancy spells are empowered. Healing spells may be weakened.',
  environment: 'Perpetual gloom. Colors are muted. Sound is dampened.',
  rules: [
    'Undead are more common and may be more powerful here.',
    'Navigation is difficult — landmarks shift and change.',
    'The Raven Queen resides in the Fortress of Memories.',
    'Domains of Dread (Ravenloft) exist within the Shadowfell.',
    'Dark Powers may tempt characters with power in exchange for corruption.',
  ],
};

export const FEYWILD_TIME_WARP = [
  { roll: '1-2', effect: 'Days become minutes', ratio: '1 day = 1 minute' },
  { roll: '3-4', effect: 'Days become hours', ratio: '1 day = 1 hour' },
  { roll: '5-7', effect: 'No change', ratio: '1:1' },
  { roll: '8-9', effect: 'Days become weeks', ratio: '1 day = 1 week' },
  { roll: '10', effect: 'Days become years', ratio: '1 day = 1 year' },
];

export const CROSSING_METHODS = [
  { method: 'Fey Crossing', description: 'Natural thin points between planes. Often at twilight, in mushroom circles, or near ancient trees.' },
  { method: 'Plane Shift (7th)', description: 'Requires tuning fork attuned to Feywild/Shadowfell.' },
  { method: 'Shadow Crossing', description: 'Areas of deep shadow or darkness that connect to the Shadowfell.' },
  { method: 'Fey Patron', description: 'Warlocks with Archfey patron may have connections to the Feywild.' },
  { method: 'Magic Items', description: 'Some items can transport to fey/shadow planes (e.g., Robe of Stars).' },
];

export function rollTimeWarp() {
  const roll = Math.floor(Math.random() * 10) + 1;
  if (roll <= 2) return FEYWILD_TIME_WARP[0];
  if (roll <= 4) return FEYWILD_TIME_WARP[1];
  if (roll <= 7) return FEYWILD_TIME_WARP[2];
  if (roll <= 9) return FEYWILD_TIME_WARP[3];
  return FEYWILD_TIME_WARP[4];
}

export function rollShadowfellDespair() {
  const roll = Math.floor(Math.random() * 3);
  return SHADOWFELL_EFFECTS.despairTypes[roll];
}

/**
 * playerFeywildShadowfell.js
 * Player Mode: Planar travel — Feywild and Shadowfell mechanics, dangers, and survival
 * Pure JS — no React dependencies.
 */

export const FEYWILD = {
  description: 'Echo of the Material Plane. Vibrant, wild, magical. Time flows differently.',
  characteristics: [
    'Colors are more vivid, emotions more intense',
    'Nature is untamed and sentient',
    'Fey creatures (pixies, satyrs, hags, archfey) are the dominant inhabitants',
    'Time distortion: hours in the Feywild can be days, years, or seconds on the Material Plane',
  ],
  dangers: [
    { danger: 'Time distortion', detail: 'DM rolls or decides how time has passed when you return. You might return to find years have passed.', severity: 'S' },
    { danger: 'Memory loss', detail: 'Spending time in the Feywild can cause you to forget your purpose or even your identity.', severity: 'A' },
    { danger: 'Fey bargains', detail: 'Fey take deals literally. Saying "I\'ll give you anything" is binding. Words matter.', severity: 'S' },
    { danger: 'Enchantment', detail: 'Fey magic is heavy on charm and illusion. WIS saves are critical.', severity: 'A' },
    { danger: 'Wild magic zones', detail: 'Some areas cause random magical effects. Wild Magic Surge table or DM-created effects.', severity: 'B' },
    { danger: 'Getting lost', detail: 'The landscape shifts. Maps are unreliable. Navigation is extremely difficult.', severity: 'A' },
  ],
  survivalTips: [
    'Never eat or drink Feywild food/water without knowing the consequences',
    'Never give your true name to a fey creature',
    'Never accept a gift without understanding the implied debt',
    'Carry iron — many fey are vulnerable to cold iron',
    'Keep your emotions in check — the Feywild amplifies them',
    'Mark your path magically (mundane markers move)',
    'WIS saves are the most important saves in the Feywild',
  ],
};

export const SHADOWFELL = {
  description: 'Dark echo of the Material Plane. Dreary, hopeless, necromantic. Drains life and joy.',
  characteristics: [
    'Colors are muted, everything is gray and bleak',
    'Emotions trend toward despair, apathy, and dread',
    'Undead and shadow creatures are everywhere',
    'The Raven Queen and Vecna have domains here',
  ],
  dangers: [
    { danger: 'Shadowfell Despair', detail: 'After every long rest, DC 10 WIS save or gain a despair effect (apathy, dread, or madness).', severity: 'S' },
    { danger: 'Shadow creatures', detail: 'Shadows drain STR (if STR reaches 0, you become a shadow). Extremely dangerous.', severity: 'S' },
    { danger: 'Life drain', detail: 'Healing is less effective. Some areas reduce healing received by half.', severity: 'A' },
    { danger: 'Negative energy', detail: 'Necromantic magic is enhanced. Undead are stronger.', severity: 'A' },
    { danger: 'Domains of Dread', detail: 'Demiplanes ruled by Darklords (Strahd, etc.). You can\'t leave without the Darklord\'s permission.', severity: 'S' },
    { danger: 'Memory corruption', detail: 'Extended stays cause memories to fade and personality to darken.', severity: 'A' },
  ],
  survivalTips: [
    'Carry radiant damage sources — undead and shadows are vulnerable',
    'Cast Daylight or carry Sun Blade — light is rare and precious',
    'Protection from Evil and Good blocks shadow possession',
    'Heroes\' Feast provides immunity to frightened — critical here',
    'Don\'t split the party — shadows attack isolated targets',
    'Keep watch during long rests — Shadowfell Despair saves happen',
    'Bring Remove Curse and Greater Restoration for shadow effects',
  ],
};

export const PLANAR_TRAVEL_METHODS = [
  { method: 'Plane Shift (7th level)', access: 'Cleric, Sorcerer, Warlock, Wizard, Druid', note: 'Requires a tuning fork attuned to the destination plane. Can also banish unwilling creatures (CHA save).' },
  { method: 'Gate (9th level)', access: 'Cleric, Sorcerer, Wizard', note: 'Opens a portal to a specific spot on another plane. Can also summon specific creatures.' },
  { method: 'Fey Crossings', access: 'Anyone (location-based)', note: 'Natural portals between Material Plane and Feywild. Often in ancient forests, fairy rings, or twilight areas.' },
  { method: 'Shadow Crossings', access: 'Anyone (location-based)', note: 'Natural portals to the Shadowfell. Found in dark, haunted, or death-associated locations.' },
  { method: 'Dream (5th level)', access: 'Bard, Warlock, Wizard', note: 'Contact a creature on another plane through dreams. Not physical travel but communication.' },
  { method: 'Banishment (4th level)', access: 'Various', note: 'If target is native to another plane, banished home. If native to current plane, sent to harmless demiplane.' },
];

export const PLANAR_PREP_CHECKLIST = [
  { item: 'Tuning fork for Plane Shift', note: 'Without it, you can\'t get home. Buy/craft before leaving.' },
  { item: 'Protection from Evil and Good', note: 'Blocks possession, charm, and frightened from aberrations, celestials, elementals, fey, fiends, undead.' },
  { item: 'Heroes\' Feast', note: 'Immunity to frightened and poison. Advantage on WIS saves. Critical for Shadowfell.' },
  { item: 'Radiant damage sources', note: 'Sun Blade, Spirit Guardians, Sacred Flame. Essential for Shadowfell.' },
  { item: 'Cold iron weapons', note: 'Effective against fey creatures. May bypass resistances.' },
  { item: 'Remove Curse / Greater Restoration', note: 'For planar corruption, despair, and magical effects.' },
  { item: 'Enough rations', note: 'Don\'t eat planar food unless you know it\'s safe.' },
];

export function getSurvivalTips(plane) {
  if (plane === 'feywild') return FEYWILD.survivalTips;
  if (plane === 'shadowfell') return SHADOWFELL.survivalTips;
  return ['Prepare Protection from Evil and Good', 'Bring Plane Shift materials to return home'];
}

export function getPlanarDangers(plane) {
  if (plane === 'feywild') return FEYWILD.dangers;
  if (plane === 'shadowfell') return SHADOWFELL.dangers;
  return [];
}

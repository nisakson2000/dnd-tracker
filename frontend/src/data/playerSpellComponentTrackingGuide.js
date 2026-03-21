/**
 * playerSpellComponentTrackingGuide.js
 * Player Mode: Spell components — V, S, M tracking and management
 * Pure JS — no React dependencies.
 */

export const COMPONENT_TYPES = {
  verbal: { code: 'V', what: 'Speaking words of power.', note: 'Can\'t cast in Silence. Can\'t cast while gagged.' },
  somatic: { code: 'S', what: 'Hand gestures.', note: 'Need a free hand. Shield + weapon = no free hand.' },
  material: { code: 'M', what: 'Physical components.', note: 'Component pouch OR arcane focus replaces non-cost materials.' },
};

export const MATERIAL_COMPONENT_RULES = {
  noCost: 'Component pouch or focus replaces materials WITHOUT a listed cost.',
  withCost: 'Materials WITH a gold cost must be specifically obtained.',
  consumed: 'If the spell says "consumed", the material is used up.',
  notConsumed: 'If NOT consumed, you keep the material after casting.',
  examples: [
    { spell: 'Chromatic Orb', material: 'Diamond worth 50gp', consumed: false, note: 'Buy once, keep forever.' },
    { spell: 'Revivify', material: 'Diamond worth 300gp', consumed: true, note: 'Used up. Buy multiples.' },
    { spell: 'Identify', material: 'Pearl worth 100gp', consumed: false, note: 'Buy once. Or use focus (no cost listed... wait, Identify has a 100gp pearl).' },
    { spell: 'Resurrection', material: 'Diamond worth 1,000gp', consumed: true, note: 'Expensive. Stock ahead.' },
    { spell: 'True Resurrection', material: 'Diamonds worth 25,000gp', consumed: true, note: 'Endgame cost.' },
    { spell: 'Stoneskin', material: 'Diamond dust worth 100gp', consumed: true, note: 'Consumed each cast.' },
    { spell: 'Clone', material: 'Diamond worth 1,000gp + vessel worth 2,000gp', consumed: true, note: 'Backup body. Expensive.' },
    { spell: 'Heroes\' Feast', material: 'Gem-encrusted bowl worth 1,000gp', consumed: true, note: 'Consumed. Party-wide buff.' },
  ],
};

export const HAND_MANAGEMENT = {
  problem: 'Need free hand for somatic (S) components. Weapons/shields occupy hands.',
  solutions: [
    { solution: 'Component Pouch', rule: 'Same hand that holds the pouch can do somatic.', note: 'Pouch on belt. Free hand draws material and does S.' },
    { solution: 'Arcane Focus (staff/wand)', rule: 'Hand holding focus can do somatic.', note: 'Staff = weapon + focus. One hand does both.' },
    { solution: 'War Caster feat', rule: 'Perform somatic with hands full.', note: 'Shield + weapon = still cast S spells.' },
    { solution: 'Ruby of the War Mage', rule: 'Turn any weapon into a focus.', note: 'Common magic item. Attunement. Weapon = focus.' },
    { solution: 'Drop weapon (free)', rule: 'Drop weapon, cast, pick up on next turn (free object interaction).', note: 'RAW works. Clunky but functional.' },
  ],
};

export const CLASS_FOCUS_OPTIONS = {
  wizard: ['Arcane focus (orb, crystal, rod, staff, wand)', 'Component pouch'],
  sorcerer: ['Arcane focus', 'Component pouch'],
  warlock: ['Arcane focus', 'Component pouch'],
  bard: ['Musical instrument (as focus)', 'Component pouch'],
  cleric: ['Holy symbol (on shield, amulet, or emblem)', 'Component pouch'],
  druid: ['Druidic focus (staff, totem, wooden staff)', 'Component pouch'],
  paladin: ['Holy symbol (on shield)', 'Component pouch'],
  ranger: ['Component pouch (no focus option RAW)', 'Druidic focus (Tasha\'s optional)'],
  artificer: ['Thieves\' tools or artisan\'s tools (as focus)', 'Infused items'],
};

export const COMPONENT_TRACKING_TIPS = [
  'Component pouch replaces all non-cost materials. Just buy one.',
  'Costly materials: track diamonds (300gp, 1,000gp), ruby dust, etc.',
  'Consumed components: buy multiples. Revivify uses up the diamond.',
  'Non-consumed: buy once, keep forever. Chromatic Orb diamond.',
  'Cleric holy symbol on shield: cast with shield hand. No War Caster needed.',
  'War Caster: cast somatic with both hands full. Great for shield users.',
  'Ruby of the War Mage: weapon becomes focus. Common magic item.',
  'Drop weapon, cast, pick up: RAW legal but clunky.',
  'Bard: instrument is your focus. Play to cast. Flavor win.',
  'Always carry 300gp diamond. Revivify saves lives.',
];

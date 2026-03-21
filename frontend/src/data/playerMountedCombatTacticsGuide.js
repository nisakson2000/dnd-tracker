/**
 * playerMountedCombatTacticsGuide.js
 * Player Mode: Mounted combat rules, optimization, and tactics
 * Pure JS — no React dependencies.
 */

export const MOUNTED_COMBAT_RULES = {
  mounting: 'Mount/dismount costs half your movement. Mount must be one size larger than you.',
  control: 'Controlled mount: acts on your turn, can only Dash/Disengage/Dodge. You choose.',
  independent: 'Independent mount: acts on its own initiative, can attack. DM controls it.',
  falling: 'If mount is knocked prone, you must succeed DC 10 DEX save or fall off (prone). Otherwise, you can dismount (reaction, land on feet).',
  forcedMovement: 'If you\'re moved against your will while mounted, DC 10 DEX save or fall off prone.',
  attacks: 'Melee attacks vs creatures smaller than your mount: advantage.',
  spellcasting: 'You can cast spells while mounted normally.',
};

export const BEST_MOUNTS = [
  { mount: 'Warhorse', cr: '1/2', hp: 19, speed: '60ft', note: 'Standard combat mount. Trampling Charge (prone). Most common.', rating: 'A+' },
  { mount: 'Griffon', cr: '2', hp: 59, speed: '80ft fly', note: 'Flying mount. Requires training/quest to obtain.', rating: 'S' },
  { mount: 'Pegasus', cr: '2', hp: 59, speed: '90ft fly', note: 'Flying mount. Good-aligned. Celestial.', rating: 'S' },
  { mount: 'Giant Elk', cr: '2', hp: 42, speed: '60ft', note: 'Large. Charge attack. Good for Druids thematically.', rating: 'A' },
  { mount: 'Elephant', cr: '4', hp: 76, speed: '40ft', note: 'Huge. Trampling Charge. Slow but tanky.', rating: 'A' },
  { mount: 'Phantom Steed (spell)', cr: '-', hp: 1, speed: '100ft', note: 'Ritual spell. 100ft speed. Disappears if damaged. Free.', rating: 'S+' },
  { mount: 'Find Steed (Paladin)', cr: '-', hp: 'varies', speed: '60ft+', note: 'Paladin L2 spell. Permanent. Shares self-target spells. Intelligent.', rating: 'S+' },
  { mount: 'Find Greater Steed (Paladin)', cr: '-', hp: 'varies', speed: '90ft fly', note: 'Paladin L4 spell. Pegasus/Griffon. Flying. Shares spells.', rating: 'S++' },
];

export const MOUNTED_COMBATANT_FEAT = {
  effects: [
    'Advantage on melee attack rolls vs unmounted creatures smaller than your mount.',
    'Force attacks targeting your mount to target you instead.',
    'Mount takes no damage on successful DEX save (half on fail, instead of half/full).',
  ],
  rating: 'S (if mounted build)',
  note: 'Essential for any dedicated mounted build. Protects your mount and boosts your offense.',
};

export const MOUNTED_BUILD_GUIDE = {
  bestClasses: [
    { class: 'Paladin', why: 'Find Steed/Greater Steed. Share buff spells. Lance + Shield. Born mounted combatant.', rating: 'S+' },
    { class: 'Cavalier Fighter', why: 'Subclass built for mounted combat. Unwavering Mark + mount.', rating: 'S' },
    { class: 'Beast Master Ranger', why: 'Animal companion as mount (if Large). Less optimal but thematic.', rating: 'B+' },
    { class: 'Any Small race', why: 'Medium mounts (Mastiff, Wolf) available. Cheaper and easier to obtain.', rating: 'A' },
  ],
  weaponChoice: {
    lance: { damage: '1d12', properties: 'Reach. Disadvantage within 5ft. One-handed while mounted.', note: 'Best mounted weapon. 1d12 one-handed + shield + reach.', rating: 'S+' },
    longsword: { damage: '1d8/1d10', properties: 'Versatile.', note: 'Good fallback if enemies close to 5ft.', rating: 'A' },
  },
  tactics: [
    'Charge in, attack with lance (reach), ride out of range. Mount uses Disengage.',
    'Paladin: cast Haste on yourself — Find Steed shares it with mount too.',
    'Use height advantage: enemies must use movement to reach you.',
    'If mount dies, have a plan B (Misty Step away, or fight on foot).',
  ],
};

export const FIND_STEED_SPELL_SHARING = [
  'Any spell targeting only you can also affect your Find Steed/Greater Steed mount.',
  'Haste on yourself = Haste on mount too. Double speed mount + extra action.',
  'Aid on yourself = mount gets extra HP too.',
  'Death Ward on yourself = mount is also protected.',
  'Crusader\'s Mantle: 30ft aura. Mount\'s attacks also deal +1d4 radiant.',
  'This is why Paladin is the best mounted class. Free double-targeting.',
];

export const MOUNTED_COMBAT_TIPS = [
  'Lance is one-handed while mounted: lance + shield = 1d12 + high AC.',
  'Controlled mounts can only Dash/Disengage/Dodge — use Disengage for hit-and-run.',
  'Phantom Steed (ritual) is FREE and gives 100ft speed. Best non-Paladin mount.',
  'Small races can ride Medium creatures (Mastiff, Wolf). Easier to bring indoors.',
  'Flying mounts are game-changing but DM may restrict them.',
  'Always take Mounted Combatant feat if going mounted build. Protects mount from AoE.',
  'Mount HP is your biggest vulnerability. Protect it or have backup plan.',
  'Dismounting costs half movement. Keep this in mind for action economy.',
];

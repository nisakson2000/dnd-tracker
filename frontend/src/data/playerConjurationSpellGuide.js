/**
 * playerConjurationSpellGuide.js
 * Player Mode: Conjuration spells — summoning, creation, and teleportation
 * Pure JS — no React dependencies.
 */

export const CONJURATION_SPELLS_RANKED = [
  { spell: 'Conjure Animals', level: 3, rating: 'S+', note: '8 wolves = 8 Pack Tactics attacks. Best summon spell. DM chooses creatures RAW.' },
  { spell: 'Web', level: 2, rating: 'S', note: 'Restrained (DEX save). Difficult terrain. Flammable. Best L2 control spell.' },
  { spell: 'Misty Step', level: 2, rating: 'S+', note: 'BA 30ft teleport. Verbal only. Best escape/reposition spell.' },
  { spell: 'Dimension Door', level: 4, rating: 'S', note: '500ft teleport, no LOS, +1 passenger. Through walls.' },
  { spell: 'Conjure Woodland Beings', level: 4, rating: 'S+ (Pixies)', note: '8 Pixies = 8 Polymorphs/Fly spells. Game-breaking if DM allows Pixies.' },
  { spell: 'Fog Cloud', level: 1, rating: 'A+', note: 'Block all vision. Anti-ranged, break line of sight, escape. Cheap and effective.' },
  { spell: 'Summon Beast', level: 2, rating: 'A+', note: 'Tasha\'s summon. You choose form. Scales with slot. Reliable.' },
  { spell: 'Summon Fey', level: 3, rating: 'A+', note: 'Good damage + BA teleport. Tricksy gives advantage on attacks.' },
  { spell: 'Summon Undead', level: 3, rating: 'A+', note: 'Putrid poisons, Ghostly frightens, Skeletal has range. All solid.' },
  { spell: 'Cloud of Daggers', level: 2, rating: 'A', note: '4d4 automatic damage (no save) in 5ft cube. Place in grappled/restrained enemy space.' },
  { spell: 'Animate Objects', level: 5, rating: 'S', note: '10 tiny objects = 10 attacks at +8 for 1d4+4. ~47 DPR. Best damage spell.' },
  { spell: 'Conjure Elemental', level: 5, rating: 'A', note: 'CR5 elemental. Goes hostile if concentration breaks. Earth Elemental is great.' },
  { spell: 'Teleport', level: 7, rating: 'S+', note: 'Travel anywhere on same plane. Carry 8 creatures. Familiarity affects accuracy.' },
  { spell: 'Gate', level: 9, rating: 'S+', note: 'Perfect interplanar portal. Can summon named creatures.' },
  { spell: 'Wish', level: 9, rating: 'S+', note: 'Replicate any L8 or lower spell. Risk losing it forever if used creatively.' },
  { spell: 'Create Food and Water', level: 3, rating: 'B+', note: 'Feed 15 people for 24 hours. Eliminates survival resource management.' },
  { spell: 'Spirit Guardians', level: 3, rating: 'S+', note: 'Technically conjuration. 3d8/enemy/round in 15ft radius. Best sustained damage.' },
  { spell: 'Spiritual Weapon', level: 2, rating: 'S', note: 'BA attack for 1d8+mod. No concentration. Pairs with Spirit Guardians perfectly.' },
];

export const SUMMONING_TIPS = [
  'Tasha\'s summons (Summon Beast/Fey/Undead) > old Conjure spells for reliability. You choose the form.',
  'Conjure Animals: ask DM beforehand what they\'ll summon. Avoids mid-combat arguments.',
  'Animate Objects: 10 tiny coins = 10 attacks. Best pure damage spell at L5.',
  'Spiritual Weapon + Spirit Guardians: cleric\'s bread and butter. BA damage + AoE every round.',
  'Web is the best L2 control spell. Restrained is a powerful condition. DEX save to escape.',
  'Fog Cloud blocks line of sight for EVERYONE. Use it to neutralize ranged enemies or escape.',
  'Cloud of Daggers has no save — damage is automatic. Combo with grapple/shove into the area.',
];

export const CONJURATION_SCHOOL_TIPS = [
  'Conjuration Wizard: Focused Conjuration (L10) means you can\'t lose concentration on conjuration spells from damage.',
  'Minor Conjuration: create any object up to 3ft on a side. Lock picks, caltrops, vials of acid.',
  'Benign Transposition: teleport 30ft or swap with willing creature 1/LR. Recharges when you cast conjuration.',
  'Conjured creatures act on their own initiative. This can slow combat — pre-roll their actions.',
  'Lost concentration on Conjure Elemental = hostile elemental. Be careful with concentration checks.',
];

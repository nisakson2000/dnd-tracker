import { useState, useCallback } from 'react';
import {
  Crown, RefreshCw, Copy, Shield, Heart, Zap,
  Flame, Skull, Swords, Eye, Star, BookOpen,
} from 'lucide-react';

/* ─── CR scaling tables (DMG p.274) ─── */
const CR_TABLE = {
  1:  { hp: [71,85],     ac: 13, atkBonus: 3,  saveDC: 13, dpr: [9,14]     },
  2:  { hp: [86,100],    ac: 13, atkBonus: 3,  saveDC: 13, dpr: [15,20]    },
  3:  { hp: [101,115],   ac: 13, atkBonus: 4,  saveDC: 13, dpr: [21,26]    },
  4:  { hp: [116,130],   ac: 14, atkBonus: 5,  saveDC: 14, dpr: [27,32]    },
  5:  { hp: [131,145],   ac: 15, atkBonus: 6,  saveDC: 15, dpr: [33,38]    },
  6:  { hp: [146,160],   ac: 15, atkBonus: 6,  saveDC: 15, dpr: [39,44]    },
  7:  { hp: [161,175],   ac: 15, atkBonus: 6,  saveDC: 15, dpr: [45,50]    },
  8:  { hp: [176,190],   ac: 16, atkBonus: 7,  saveDC: 16, dpr: [51,56]    },
  9:  { hp: [191,205],   ac: 16, atkBonus: 7,  saveDC: 16, dpr: [57,62]    },
  10: { hp: [206,220],   ac: 17, atkBonus: 7,  saveDC: 16, dpr: [63,68]    },
  11: { hp: [221,235],   ac: 17, atkBonus: 8,  saveDC: 17, dpr: [69,74]    },
  12: { hp: [236,250],   ac: 17, atkBonus: 8,  saveDC: 17, dpr: [75,80]    },
  13: { hp: [251,265],   ac: 18, atkBonus: 8,  saveDC: 18, dpr: [81,86]    },
  14: { hp: [266,280],   ac: 18, atkBonus: 8,  saveDC: 18, dpr: [87,92]    },
  15: { hp: [281,295],   ac: 18, atkBonus: 8,  saveDC: 18, dpr: [93,98]    },
  16: { hp: [296,310],   ac: 18, atkBonus: 9,  saveDC: 18, dpr: [99,104]   },
  17: { hp: [311,325],   ac: 19, atkBonus: 10, saveDC: 19, dpr: [105,110]  },
  18: { hp: [326,340],   ac: 19, atkBonus: 10, saveDC: 19, dpr: [111,116]  },
  19: { hp: [341,355],   ac: 19, atkBonus: 10, saveDC: 19, dpr: [117,122]  },
  20: { hp: [356,400],   ac: 19, atkBonus: 10, saveDC: 19, dpr: [123,140]  },
  21: { hp: [401,445],   ac: 19, atkBonus: 11, saveDC: 20, dpr: [141,158]  },
  22: { hp: [446,490],   ac: 19, atkBonus: 11, saveDC: 20, dpr: [159,176]  },
  23: { hp: [491,535],   ac: 19, atkBonus: 11, saveDC: 20, dpr: [177,194]  },
  24: { hp: [536,580],   ac: 19, atkBonus: 12, saveDC: 21, dpr: [195,212]  },
  25: { hp: [581,625],   ac: 19, atkBonus: 12, saveDC: 21, dpr: [213,230]  },
  26: { hp: [626,670],   ac: 19, atkBonus: 12, saveDC: 21, dpr: [231,248]  },
  27: { hp: [671,715],   ac: 19, atkBonus: 13, saveDC: 22, dpr: [249,266]  },
  28: { hp: [716,760],   ac: 19, atkBonus: 13, saveDC: 22, dpr: [267,284]  },
  29: { hp: [761,805],   ac: 19, atkBonus: 13, saveDC: 22, dpr: [285,302]  },
  30: { hp: [806,850],   ac: 19, atkBonus: 14, saveDC: 23, dpr: [303,320]  },
};

/* ─── Helpers ─── */
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randBetween(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function rollStat(base, crMod) { return Math.max(1, Math.min(30, base + crMod)); }
function mod(score) { const m = Math.floor((score - 10) / 2); return m >= 0 ? `+${m}` : `${m}`; }
function modNum(score) { return Math.floor((score - 10) / 2); }

/* ─── Boss Name Parts ─── */
const NAME_PREFIXES = [
  'Vor', 'Kal', 'Mor', 'Zar', 'Thal', 'Gor', 'Nex', 'Xal', 'Dra', 'Ith',
  'Vel', 'Sar', 'Mal', 'Kha', 'Ash', 'Bal', 'Cor', 'Fen', 'Gul', 'Nar',
  'Oth', 'Pyr', 'Rav', 'Syl', 'Var', 'Aza', 'Dre', 'Hex', 'Lur', 'Myr',
];
const NAME_SUFFIXES = [
  'rax', 'gore', 'muth', 'thas', 'keth', 'xis', 'dak', 'morn', 'vex', 'zul',
  'noth', 'khan', 'mar', 'dros', 'gath', 'lok', 'rath', 'sar', 'thar', 'vok',
  'bane', 'doom', 'rend', 'fang', 'claw', 'dusk', 'wyrd', 'flux', 'grim', 'shade',
];
const TITLES = [
  'the Undying', 'the Accursed', 'of the Abyss', 'the Eternal', 'the Dread',
  'Worldbreaker', 'the Ruinous', 'of Shadow', 'the All-Seeing', 'Bane of Kings',
  'the Tyrant', 'Deathbringer', 'of the Void', 'the Insatiable', 'the Forsaken',
  'Soulrender', 'the Ancient', 'Flamecaller', 'of the Deep', 'Stormheart',
];

function generateName() {
  return `${pick(NAME_PREFIXES)}${pick(NAME_SUFFIXES)}, ${pick(TITLES)}`;
}

/* ─── Archetype Definitions ─── */
const ARCHETYPES = {
  dragon: {
    label: 'Dragon',
    baseStats: { str: 23, dex: 10, con: 21, int: 16, wis: 15, cha: 19 },
    speeds: ['40 ft., fly 80 ft.'],
    damageTypes: ['fire', 'cold', 'lightning', 'poison', 'acid'],
    skills: ['Perception', 'Stealth', 'Intimidation'],
    conditionImmunities: ['frightened'],
    senses: 'Blindsight 60 ft., Darkvision 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The dragon makes three attacks: one with its bite and two with its claws.' },
      { name: 'Bite', desc: 'Melee Weapon Attack: +{atk} to hit, reach 10 ft., one target. Hit: {dpr1} piercing damage plus {dpr2} {element} damage.' },
      { name: 'Claw', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} slashing damage.' },
      { name: 'Breath Weapon (Recharge 5-6)', desc: 'The dragon exhales destructive energy in a {cr_area} cone. Each creature must make a DC {dc} DEX saving throw, taking {dpr_big} {element} damage on a failed save, or half on a success.' },
    ],
    legendaryActions: [
      { name: 'Detect', desc: 'The dragon makes a Wisdom (Perception) check.' },
      { name: 'Tail Attack', desc: 'The dragon makes a tail attack. Melee Weapon Attack: +{atk} to hit, reach 15 ft., one target. Hit: {dpr1} bludgeoning damage.' },
      { name: 'Wing Attack (Costs 2 Actions)', desc: 'The dragon beats its wings. Each creature within 10 ft. must succeed on a DC {dc} DEX save or take {dpr1} bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.' },
    ],
    lairActions: [
      'Magma erupts from a point on the ground within 120 ft. Each creature within 20 ft. must make a DC {dc} DEX save or take 3d6 fire damage.',
      'A tremor shakes the lair. Each creature on the ground must succeed on a DC {dc} DEX save or be knocked prone.',
      'Volcanic gases fill a 20-ft sphere. Each creature inside must succeed on a DC {dc} CON save or be poisoned until the end of its next turn.',
    ],
    loreHooks: [
      'It slumbers atop a hoard containing a key to an ancient dwarven vault.',
      'A cult worships the dragon as a god, offering monthly tributes of gold and captives.',
      'The dragon guards a sealed portal to another plane, bound by an oath older than kingdoms.',
      'Its scales contain fragments of a shattered divine weapon.',
    ],
    weaknessHints: [
      'Vulnerable to its opposing element if struck during breath weapon recharge.',
      'An old wound on its belly reduces AC by 2 when targeted from below.',
      'Loses legendary resistances when its hoard is disturbed.',
    ],
  },
  lich: {
    label: 'Lich',
    baseStats: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
    speeds: ['30 ft.'],
    damageTypes: ['necrotic', 'cold', 'psychic'],
    skills: ['Arcana', 'History', 'Insight', 'Perception'],
    conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned', 'exhaustion'],
    senses: 'Truesight 120 ft.',
    actions: [
      { name: 'Paralyzing Touch', desc: 'Melee Spell Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} cold damage. Target must succeed on a DC {dc} CON save or be paralyzed for 1 minute.' },
      { name: 'Spellcasting', desc: 'The lich casts one of its prepared spells using Intelligence as its spellcasting ability (spell save DC {dc}, +{atk} to hit). At-will: detect magic, mage hand, prestidigitation. 3/day each: counterspell, dispel magic, fireball. 1/day each: dominate monster, power word stun, finger of death.' },
      { name: 'Disrupt Life (Recharge 5-6)', desc: 'Each non-undead creature within 20 ft. must make a DC {dc} CON save, taking {dpr_big} necrotic damage on a failed save, or half on a success. The lich regains HP equal to the highest damage dealt.' },
    ],
    legendaryActions: [
      { name: 'Cantrip', desc: 'The lich casts a cantrip.' },
      { name: 'Paralyzing Touch (Costs 2 Actions)', desc: 'The lich uses its Paralyzing Touch.' },
      { name: 'Frightening Gaze (Costs 2 Actions)', desc: 'The lich fixes its gaze on one creature within 10 ft. The target must succeed on a DC {dc} WIS save or be frightened for 1 minute.' },
    ],
    lairActions: [
      'The lich rolls a d8 and regains a spell slot of that level or lower. Once used, it can\'t use this lair action again until it has used a different one.',
      'The lich targets one creature within 30 ft. A swarm of spectral hands grapples the target (escape DC {dc}).',
      'A wall of shimmering force (as wall of force) springs up at a point within 60 ft., lasting until initiative 20 on the next round.',
    ],
    loreHooks: [
      'Its phylactery is hidden inside a demiplane accessible only through a specific painting in a ruined gallery.',
      'It was once a benevolent archmage who turned to lichdom to protect a city that no longer exists.',
      'The lich seeks to complete a ritual that would merge the material plane with the Shadowfell.',
      'Its spellbook contains the only known copy of a spell that could restore a dead god.',
    ],
    weaknessHints: [
      'The phylactery must be destroyed first, or the lich reforms in 1d10 days.',
      'Radiant damage temporarily suppresses its rejuvenation ability.',
      'Its intellect falters when confronted with memories of its mortal life.',
    ],
  },
  demon_lord: {
    label: 'Demon Lord',
    baseStats: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
    speeds: ['40 ft., fly 60 ft.'],
    damageTypes: ['fire', 'lightning', 'cold', 'poison'],
    skills: ['Deception', 'Intimidation', 'Perception'],
    conditionImmunities: ['charmed', 'frightened', 'poisoned', 'exhaustion'],
    senses: 'Truesight 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The demon lord makes two attacks with its weapon and one with its fiendish power.' },
      { name: 'Abyssal Blade', desc: 'Melee Weapon Attack: +{atk} to hit, reach 10 ft., one target. Hit: {dpr1} slashing damage plus {dpr2} {element} damage.' },
      { name: 'Fiendish Blast', desc: 'Ranged Spell Attack: +{atk} to hit, range 120 ft., one target. Hit: {dpr_big} {element} damage.' },
    ],
    legendaryActions: [
      { name: 'Abyssal Teleport', desc: 'The demon lord teleports up to 120 ft. to an unoccupied space it can see.' },
      { name: 'Fiendish Command', desc: 'One allied fiend within 120 ft. can use its reaction to make one attack.' },
      { name: 'Doom Gaze (Costs 2 Actions)', desc: 'The demon lord targets one creature within 60 ft. The target must succeed on a DC {dc} CHA save or take {dpr2} psychic damage and be stunned until the end of its next turn.' },
    ],
    lairActions: [
      'A portal to the Abyss opens at a point within 60 ft. 1d4 dretches or 1 vrock emerge.',
      'The ground in a 20-ft radius becomes difficult terrain as abyssal ichor seeps through cracks. Creatures starting their turn there take 2d6 acid damage.',
      'Darkness (as the spell) fills a 30-ft radius centered on a point within 120 ft. until initiative 20 of the next round.',
    ],
    loreHooks: [
      'It was imprisoned millennia ago and a cult seeks to shatter the final ward holding it.',
      'The demon lord offers knowledge of a PC\'s deepest desire in exchange for a seemingly trivial favor.',
      'It commands an army gathering at a planar weak point, preparing for invasion.',
      'A fragment of a god\'s power is bound within its form, making it more than a mere fiend.',
    ],
    weaknessHints: [
      'Holy water and consecrated weapons deal additional radiant damage.',
      'It cannot willingly enter an area protected by a hallow spell.',
      'The demon lord loses its regeneration if struck by a weapon blessed by a celestial.',
    ],
  },
  vampire: {
    label: 'Vampire',
    baseStats: { str: 18, dex: 18, con: 18, int: 17, wis: 15, cha: 18 },
    speeds: ['30 ft., climb 30 ft.'],
    damageTypes: ['necrotic'],
    skills: ['Perception', 'Stealth', 'Persuasion', 'Deception'],
    conditionImmunities: ['charmed', 'poisoned'],
    senses: 'Darkvision 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The vampire makes two attacks, only one of which can be a bite attack.' },
      { name: 'Unarmed Strike', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC {dc}).' },
      { name: 'Bite', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one willing, grappled, incapacitated, or restrained creature. Hit: {dpr1} piercing damage plus {dpr_big} necrotic damage. The target\'s HP maximum is reduced by the necrotic damage taken, and the vampire regains HP equal to that amount.' },
      { name: 'Charm', desc: 'One humanoid within 30 ft. must succeed on a DC {dc} WIS save or be magically charmed for 24 hours.' },
    ],
    legendaryActions: [
      { name: 'Move', desc: 'The vampire moves up to its speed without provoking opportunity attacks.' },
      { name: 'Unarmed Strike', desc: 'The vampire makes one unarmed strike.' },
      { name: 'Bite (Costs 2 Actions)', desc: 'The vampire makes one bite attack.' },
    ],
    lairActions: [
      'The vampire summons 2d4 swarms of bats or rats. They act on initiative 20 of the next round and obey the vampire.',
      'A door or passage within the lair magically seals. A DC {dc} STR check is needed to force it open.',
      'Shadows in the lair shift and writhe. Each creature of the vampire\'s choice within 60 ft. must succeed on a DC {dc} WIS save or be frightened until initiative 20 of the next round.',
    ],
    loreHooks: [
      'The vampire has secretly controlled the local noble house for three generations.',
      'It seeks an ancient artifact that would allow it to walk in sunlight permanently.',
      'The vampire was once a great hero who accepted the curse to save a dying loved one.',
      'Its coffin is hidden in the catacombs beneath the city\'s oldest cathedral.',
    ],
    weaknessHints: [
      'Cannot enter a residence without an invitation from a living occupant.',
      'Sunlight deals 20 radiant damage per round and prevents regeneration.',
      'Running water deals 20 acid damage per round.',
      'A stake through the heart while in its resting place paralyzes it.',
    ],
  },
  beholder: {
    label: 'Beholder',
    baseStats: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
    speeds: ['0 ft., fly 20 ft. (hover)'],
    damageTypes: ['force', 'psychic', 'necrotic'],
    skills: ['Perception'],
    conditionImmunities: ['prone'],
    senses: 'Darkvision 120 ft.',
    actions: [
      { name: 'Bite', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} piercing damage.' },
      { name: 'Eye Rays', desc: 'The beholder shoots three eye rays at random (reroll duplicates), choosing one to three targets within 120 ft. See individual ray descriptions.' },
      { name: 'Disintegration Ray', desc: 'The target must succeed on a DC {dc} DEX save or take {dpr_big} force damage. If reduced to 0 HP, the target is disintegrated.' },
    ],
    legendaryActions: [
      { name: 'Eye Ray', desc: 'The beholder uses one random eye ray.' },
      { name: 'Telekinetic Ray (Costs 2 Actions)', desc: 'The beholder targets one creature or object within 60 ft. If a creature, it must succeed on a DC {dc} STR save or be moved up to 30 ft. in any direction.' },
      { name: 'Antimagic Cone', desc: 'The beholder\'s central eye creates an area of antimagic in a 150-ft cone. At the start of each turn, the beholder decides which way the cone faces.' },
    ],
    lairActions: [
      'A 50-ft square area of ground within 120 ft. becomes slimy. It is difficult terrain until initiative 20 of the next round.',
      'Walls within 120 ft. sprout grasping appendages. Each creature of the beholder\'s choice within 10 ft. of a wall must succeed on a DC {dc} DEX save or be grappled.',
      'An eye opens on a solid surface within 60 ft. One random eye ray shoots from it at a target of the beholder\'s choice.',
    ],
    loreHooks: [
      'The beholder believes it is a deposed god and is constructing a reality-altering device in its lair.',
      'It has been mapping the dreams of every creature in the region, searching for a prophesied rival.',
      'A fragment of its consciousness has broken off and formed a separate, allied gazer swarm.',
      'The beholder guards a library of forbidden knowledge it has collected over centuries.',
    ],
    weaknessHints: [
      'Its antimagic cone cannot face backward — flanking negates it.',
      'The central eye can be blinded, disabling the antimagic cone.',
      'Beholders are inherently paranoid — illusions of rival beholders cause it to panic.',
    ],
  },
  archfey: {
    label: 'Archfey',
    baseStats: { str: 14, dex: 20, con: 16, int: 18, wis: 18, cha: 24 },
    speeds: ['40 ft., fly 60 ft. (hover)'],
    damageTypes: ['psychic', 'radiant', 'force'],
    skills: ['Deception', 'Insight', 'Perception', 'Persuasion', 'Performance'],
    conditionImmunities: ['charmed', 'frightened'],
    senses: 'Truesight 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The archfey makes two Glamour Blast attacks.' },
      { name: 'Glamour Blast', desc: 'Ranged Spell Attack: +{atk} to hit, range 120 ft., one target. Hit: {dpr1} psychic damage plus {dpr2} radiant damage.' },
      { name: 'Beguiling Word (Recharge 5-6)', desc: 'Each creature within 60 ft. that can hear the archfey must succeed on a DC {dc} WIS save or be charmed for 1 minute. While charmed, the creature is incapacitated and has a speed of 0.' },
    ],
    legendaryActions: [
      { name: 'Fey Step', desc: 'The archfey teleports up to 60 ft. to an unoccupied space it can see.' },
      { name: 'Glamour Blast', desc: 'The archfey makes one Glamour Blast attack.' },
      { name: 'Bewildering Beauty (Costs 2 Actions)', desc: 'Each creature within 30 ft. must succeed on a DC {dc} CHA save or be stunned until the end of its next turn.' },
    ],
    lairActions: [
      'The archfey conjures a hallucinatory landscape. Each creature must succeed on a DC {dc} INT save or perceive illusory terrain (as mirage arcane) until initiative 20 of the next round.',
      'Roots and vines burst from the ground within 30 ft. of a point. Each creature in the area must succeed on a DC {dc} STR save or be restrained.',
      'Time warps within the lair. One creature of the archfey\'s choice must succeed on a DC {dc} WIS save or lose its next turn as it is trapped in a momentary time loop.',
    ],
    loreHooks: [
      'The archfey collects mortal memories as currency and keeps them in crystallized dewdrops.',
      'It holds an ancient grudge against a deity and will ally with anyone who opposes that god.',
      'The archfey\'s true name is scattered across three riddles in the mortal world.',
      'It rules a fey court of exiled celestials who seek redemption through trickery.',
    ],
    weaknessHints: [
      'Cold iron weapons bypass its resistances and suppress its regeneration.',
      'Speaking its true name forces it to answer one question truthfully.',
      'It cannot break a promise, no matter how carelessly worded.',
    ],
  },
  elemental_lord: {
    label: 'Elemental Lord',
    baseStats: { str: 22, dex: 14, con: 24, int: 14, wis: 16, cha: 18 },
    speeds: ['40 ft., fly 60 ft.'],
    damageTypes: ['fire', 'cold', 'lightning', 'thunder'],
    skills: ['Nature', 'Perception', 'Intimidation'],
    conditionImmunities: ['poisoned', 'petrified', 'paralyzed', 'exhaustion'],
    senses: 'Tremorsense 120 ft., Darkvision 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The elemental lord makes three Elemental Slam attacks.' },
      { name: 'Elemental Slam', desc: 'Melee Weapon Attack: +{atk} to hit, reach 10 ft., one target. Hit: {dpr1} bludgeoning damage plus {dpr2} {element} damage.' },
      { name: 'Elemental Cataclysm (Recharge 5-6)', desc: 'The elemental lord unleashes a {cr_area}-ft radius burst of elemental energy. Each creature in the area must make a DC {dc} CON save, taking {dpr_big} {element} damage on a failed save, or half on a success.' },
    ],
    legendaryActions: [
      { name: 'Elemental Shift', desc: 'The elemental lord moves up to its speed without provoking opportunity attacks and changes its elemental affinity.' },
      { name: 'Slam', desc: 'The elemental lord makes one Elemental Slam attack.' },
      { name: 'Primordial Roar (Costs 2 Actions)', desc: 'Each creature within 30 ft. must succeed on a DC {dc} CON save or take {dpr2} thunder damage and be deafened for 1 minute.' },
    ],
    lairActions: [
      'The lair\'s elemental nature surges. Each creature touching the ground must succeed on a DC {dc} STR save or be knocked prone and pushed 15 ft.',
      'An elemental vortex appears at a point within 60 ft. Each creature within 15 ft. must succeed on a DC {dc} DEX save or take 3d8 {element} damage.',
      'The elemental lord absorbs energy from its lair, regaining {cr_heal} HP.',
    ],
    loreHooks: [
      'The elemental lord is a fragment of a primordial that was shattered during the creation of the world.',
      'It seeks to merge the elemental planes into one, restoring the primordial chaos.',
      'A mortal wizard accidentally bound it and it wants revenge on the wizard\'s descendants.',
      'It guards the entrance to the Elemental Chaos, preventing worse things from escaping.',
    ],
    weaknessHints: [
      'Its opposing element deals double damage and suppresses its regeneration.',
      'Binding runes from the Dawn War can restrain it if inscribed correctly.',
      'When its elemental affinity is disrupted mid-shift, it is stunned for one round.',
    ],
  },
  death_knight: {
    label: 'Death Knight',
    baseStats: { str: 20, dex: 11, con: 20, int: 12, wis: 16, cha: 18 },
    speeds: ['30 ft.'],
    damageTypes: ['necrotic', 'fire'],
    skills: ['Athletics', 'Intimidation', 'Perception'],
    conditionImmunities: ['frightened', 'poisoned', 'exhaustion'],
    senses: 'Darkvision 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The death knight makes three Longsword attacks.' },
      { name: 'Longsword', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} slashing damage plus {dpr2} necrotic damage.' },
      { name: 'Hellfire Orb (1/day)', desc: 'The death knight hurls a magical ball of fire at a point within 120 ft. Each creature in a 20-ft radius must make a DC {dc} DEX save, taking {dpr_big} fire damage plus {dpr2} necrotic damage on a failed save, or half on a success.' },
    ],
    legendaryActions: [
      { name: 'Attack', desc: 'The death knight makes one Longsword attack.' },
      { name: 'Dreadful Command', desc: 'Each undead ally within 60 ft. can use its reaction to move up to its speed and make one attack.' },
      { name: 'Fell Cleave (Costs 2 Actions)', desc: 'The death knight makes one Longsword attack. On a hit, the target must succeed on a DC {dc} CON save or its HP maximum is reduced by the necrotic damage dealt.' },
    ],
    lairActions: [
      'Ghostly warriors rise from the ground. 1d4 specters or shadows appear within 60 ft. and act on initiative 20 of the next round.',
      'A wave of necrotic energy sweeps through the lair. Each non-undead creature must succeed on a DC {dc} CON save or take 2d6 necrotic damage.',
      'The death knight speaks a word of dark command. One creature within 30 ft. must succeed on a DC {dc} WIS save or be compelled to attack its nearest ally.',
    ],
    loreHooks: [
      'The death knight was once a legendary paladin who broke a sacred oath to save an innocent child.',
      'It endlessly relives the battle where it fell, seeking to change the outcome.',
      'The death knight guards the tomb of the sovereign it served in life, unable to rest until relieved.',
      'Its cursed sword contains the soul of a celestial that whispers its redemption is still possible.',
    ],
    weaknessHints: [
      'Radiant damage from a paladin\'s smite disrupts its armor for one round, reducing AC by 3.',
      'If reminded of its oath, it must make a WIS save or lose its next turn.',
      'Destroying its cursed blade permanently removes its spellcasting abilities.',
    ],
  },
  mind_flayer_elder: {
    label: 'Mind Flayer Elder',
    baseStats: { str: 15, dex: 14, con: 17, int: 22, wis: 18, cha: 17 },
    speeds: ['30 ft., fly 30 ft. (hover)'],
    damageTypes: ['psychic'],
    skills: ['Arcana', 'Deception', 'Insight', 'Perception', 'Stealth'],
    conditionImmunities: ['charmed', 'frightened'],
    senses: 'Darkvision 120 ft., Telepathy 120 ft.',
    actions: [
      { name: 'Tentacles', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} psychic damage. If the target is Medium or smaller, it is grappled (escape DC {dc}) and must succeed on a DC {dc} INT save or be stunned until the grapple ends.' },
      { name: 'Extract Brain', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one incapacitated humanoid grappled by the elder. Hit: {dpr_big} piercing damage. If this reduces the target to 0 HP, the elder extracts and devours the target\'s brain.' },
      { name: 'Mind Blast (Recharge 5-6)', desc: 'The elder emits psychic energy in a 60-ft cone. Each creature in that area must succeed on a DC {dc} INT save or take {dpr_big} psychic damage and be stunned for 1 minute.' },
    ],
    legendaryActions: [
      { name: 'Tentacle', desc: 'The elder makes one tentacle attack.' },
      { name: 'Psychic Pulse', desc: 'Each creature within 30 ft. must succeed on a DC {dc} WIS save or take {dpr2} psychic damage.' },
      { name: 'Thrall Mastery (Costs 2 Actions)', desc: 'The elder targets one creature within 60 ft. The target must succeed on a DC {dc} INT save or the elder reads its surface thoughts and can impose disadvantage on the target\'s next attack roll or saving throw.' },
    ],
    lairActions: [
      'The elder reaches into the dreams of a sleeping creature within 1 mile, creating a psychic link. It learns the creature\'s greatest fear.',
      'Psychic static fills a 30-ft radius. Each creature in the area must succeed on a DC {dc} INT save or have disadvantage on concentration checks until initiative 20 of the next round.',
      'The elder summons 1d4 intellect devourers from the Far Realm. They appear within 30 ft. and act on initiative 20 of the next round.',
    ],
    loreHooks: [
      'It is building a new elder brain from the extracted memories of a thousand captive minds.',
      'The mind flayer elder was exiled from its colony for harboring a heretical idea: empathy.',
      'It has discovered a way to pierce the boundary between planes using concentrated psychic energy.',
      'The elder seeks a specific mortal bloodline whose brains contain a unique psychic frequency.',
    ],
    weaknessHints: [
      'Creatures with Intelligence of 4 or lower are immune to its psychic attacks.',
      'A helm of telepathy or similar item can redirect its Mind Blast back at it.',
      'Removing it from its pool of cerebral fluid halves its psychic damage.',
    ],
  },
  giant_king: {
    label: 'Giant King',
    baseStats: { str: 27, dex: 10, con: 22, int: 12, wis: 14, cha: 16 },
    speeds: ['40 ft.'],
    damageTypes: ['bludgeoning', 'thunder', 'cold'],
    skills: ['Athletics', 'Perception', 'Intimidation'],
    conditionImmunities: ['frightened'],
    senses: 'Darkvision 60 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The giant king makes two Greatclub attacks.' },
      { name: 'Greatclub', desc: 'Melee Weapon Attack: +{atk} to hit, reach 15 ft., one target. Hit: {dpr1} bludgeoning damage plus {dpr2} thunder damage.' },
      { name: 'Rock', desc: 'Ranged Weapon Attack: +{atk} to hit, range 60/240 ft., one target. Hit: {dpr_big} bludgeoning damage.' },
      { name: 'Earthshaker (Recharge 5-6)', desc: 'The giant king strikes the ground, creating a shockwave in a 30-ft radius. Each creature must succeed on a DC {dc} STR save or take {dpr_big} thunder damage and be knocked prone.' },
    ],
    legendaryActions: [
      { name: 'Attack', desc: 'The giant king makes one Greatclub or Rock attack.' },
      { name: 'Stomp', desc: 'The giant king stomps. Each creature within 10 ft. must succeed on a DC {dc} DEX save or be knocked prone.' },
      { name: 'Rally (Costs 2 Actions)', desc: 'Each allied giant within 120 ft. gains {cr_temp} temporary HP and advantage on its next attack roll.' },
    ],
    lairActions: [
      'A section of ceiling or cliff face collapses. Each creature in a 20-ft area must succeed on a DC {dc} DEX save or take 3d10 bludgeoning damage.',
      'The ground splits open. Each creature standing on the ground within 30 ft. must succeed on a DC {dc} DEX save or fall into a 20-ft deep fissure.',
      'The giant king hurls a throne-sized boulder at a point within 120 ft. Each creature within 10 ft. of the impact must succeed on a DC {dc} DEX save or take 4d6 bludgeoning damage.',
    ],
    loreHooks: [
      'The giant king seeks to rebuild the ancient Ordning and unite all giant-kind under one rule.',
      'It wields a hammer forged by a god, granting it power over storms.',
      'The giant king\'s throne sits atop a mountain that is actually a sleeping primordial.',
      'It has declared war on the small folk after its heir was slain by adventurers.',
    ],
    weaknessHints: [
      'Its oversized frame makes it vulnerable to targeted strikes at its knees (prone on critical hit).',
      'The ancient crown it wears is its source of authority — removing it causes all giant allies to flee.',
      'It respects the old traditions: a formal challenge of single combat cannot be refused.',
    ],
  },
  medusa_queen: {
    label: 'Medusa Queen',
    baseStats: { str: 14, dex: 18, con: 16, int: 16, wis: 15, cha: 20 },
    speeds: ['30 ft.'],
    damageTypes: ['poison', 'necrotic'],
    skills: ['Deception', 'Insight', 'Perception', 'Stealth'],
    conditionImmunities: ['petrified', 'poisoned'],
    senses: 'Darkvision 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The medusa queen makes two Snake Hair attacks and one Longbow attack, or three Snake Hair attacks.' },
      { name: 'Snake Hair', desc: 'Melee Weapon Attack: +{atk} to hit, reach 5 ft., one target. Hit: {dpr1} piercing damage plus {dpr2} poison damage.' },
      { name: 'Longbow', desc: 'Ranged Weapon Attack: +{atk} to hit, range 150/600 ft., one target. Hit: {dpr1} piercing damage plus {dpr2} poison damage.' },
      { name: 'Petrifying Gaze', desc: 'Each creature within 30 ft. that can see the medusa queen\'s eyes must make a DC {dc} CON save. On a failure, the creature begins turning to stone (restrained). On a second failure, the creature is petrified.' },
    ],
    legendaryActions: [
      { name: 'Snake Hair', desc: 'The medusa queen makes one Snake Hair attack.' },
      { name: 'Glare', desc: 'The medusa queen targets one creature within 30 ft. with its Petrifying Gaze.' },
      { name: 'Venomous Command (Costs 2 Actions)', desc: 'Each poisoned creature within 60 ft. takes {dpr2} additional poison damage and must succeed on a DC {dc} WIS save or use its reaction to move toward the medusa queen.' },
    ],
    lairActions: [
      'Stone statues within the lair animate and attack. 1d3 animated armors appear and act on initiative 20 of the next round.',
      'Pools of venom bubble up from cracks in the floor. Each creature standing on the ground must succeed on a DC {dc} CON save or be poisoned for 1 minute.',
      'The medusa queen\'s gaze reflects off mirrored surfaces in the lair, extending its Petrifying Gaze to creatures around corners or behind cover.',
    ],
    loreHooks: [
      'She was once a high priestess cursed by a jealous god for her beauty and devotion.',
      'Her gallery of petrified victims includes a legendary hero who holds the key to a prophecy.',
      'The medusa queen seeks a cure for her curse and will bargain with those who offer aid.',
      'She rules a hidden city of yuan-ti who worship her as a living goddess.',
    ],
    weaknessHints: [
      'Averting eyes or using a mirror grants advantage on saves against her gaze.',
      'Her serpent hair can be severed (AC 15, 20 HP) — each severed snake reduces her attack count.',
      'She is vulnerable to radiant damage, a remnant of the divine curse that created her.',
    ],
  },
  aboleth: {
    label: 'Aboleth',
    baseStats: { str: 21, dex: 9, con: 15, int: 18, wis: 15, cha: 18 },
    speeds: ['10 ft., swim 40 ft.'],
    damageTypes: ['psychic', 'poison'],
    skills: ['History', 'Perception'],
    conditionImmunities: ['charmed', 'frightened'],
    senses: 'Darkvision 120 ft., Telepathy 120 ft.',
    actions: [
      { name: 'Multiattack', desc: 'The aboleth makes three Tentacle attacks.' },
      { name: 'Tentacle', desc: 'Melee Weapon Attack: +{atk} to hit, reach 10 ft., one target. Hit: {dpr1} bludgeoning damage. If the target is a creature, it must succeed on a DC {dc} CON save or become diseased. The disease has no effect for 1 minute; after that, the creature can only breathe underwater.' },
      { name: 'Enslave (3/day)', desc: 'The aboleth targets one creature within 30 ft. The target must succeed on a DC {dc} WIS save or be magically charmed by the aboleth until the aboleth dies or is on a different plane. The charmed target is under the aboleth\'s control.' },
      { name: 'Psychic Drain (Recharge 5-6)', desc: 'The aboleth releases a psychic wave in a 60-ft radius. Each creature must succeed on a DC {dc} INT save or take {dpr_big} psychic damage and have its INT score reduced by 1d4.' },
    ],
    legendaryActions: [
      { name: 'Detect', desc: 'The aboleth makes a Wisdom (Perception) check.' },
      { name: 'Tail Swipe', desc: 'The aboleth makes one tail attack: +{atk} to hit, reach 10 ft. Hit: {dpr1} bludgeoning damage.' },
      { name: 'Psychic Drain (Costs 2 Actions)', desc: 'One creature charmed by the aboleth takes {dpr2} psychic damage, and the aboleth regains HP equal to the damage dealt.' },
    ],
    lairActions: [
      'The aboleth casts phantasmal force (no components) on any number of creatures within 60 ft. DC {dc} INT save to resist.',
      'Water within 90 ft. surges. Each creature swimming must succeed on a DC {dc} STR save or be pulled 20 ft. toward the aboleth.',
      'Pools of slime coat the floors. Each creature on the ground within 30 ft. must succeed on a DC {dc} DEX save or have its speed reduced to 0 until the end of its next turn.',
    ],
    loreHooks: [
      'The aboleth remembers the time before the gods and seeks to return the world to that age.',
      'It has been manipulating a coastal city\'s leadership for decades through dreams.',
      'The aboleth possesses racial memories spanning millions of years — including knowledge of how to unmake a god.',
      'It dwells in the flooded ruins of a pre-divine civilization it once ruled.',
    ],
    weaknessHints: [
      'On dry land, its speed is severely reduced and its mucous cloud is ineffective.',
      'Psychic immunity renders its most powerful abilities useless.',
      'The aboleth\'s enslaved thralls share a telepathic link — freeing one can cascade into freeing all.',
    ],
  },
};

const ARCHETYPE_KEYS = Object.keys(ARCHETYPES);

/* ─── Scale stats by CR ─── */
function scaleStats(archetype, cr) {
  const clampedCR = Math.max(1, Math.min(30, cr));
  const table = CR_TABLE[clampedCR];
  const base = archetype.baseStats;
  const crMod = Math.floor((clampedCR - 5) / 3);

  const stats = {
    str: rollStat(base.str, Math.floor(crMod * 0.8)),
    dex: rollStat(base.dex, Math.floor(crMod * 0.5)),
    con: rollStat(base.con, Math.floor(crMod * 0.7)),
    int: rollStat(base.int, Math.floor(crMod * 0.6)),
    wis: rollStat(base.wis, Math.floor(crMod * 0.4)),
    cha: rollStat(base.cha, Math.floor(crMod * 0.5)),
  };

  const hp = randBetween(table.hp[0], table.hp[1]);
  const ac = table.ac + (clampedCR >= 10 ? 1 : 0);
  const element = pick(archetype.damageTypes);
  const atkBonus = table.atkBonus;
  const saveDC = table.saveDC;
  const dprAvg = Math.floor((table.dpr[0] + table.dpr[1]) / 2);

  // Calculate individual damage values
  const dpr1 = Math.max(1, Math.floor(dprAvg * 0.35));
  const dpr2 = Math.max(1, Math.floor(dprAvg * 0.2));
  const dprBig = Math.max(1, Math.floor(dprAvg * 0.8));
  const crArea = Math.min(90, 30 + clampedCR * 2);
  const crHeal = Math.floor(hp * 0.1);
  const crTemp = Math.floor(clampedCR * 2);

  // Proficiency bonus
  const prof = Math.floor((clampedCR - 1) / 4) + 2;

  // Pick saves (2-3 strong saves)
  const allSaves = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const statMap = { STR: stats.str, DEX: stats.dex, CON: stats.con, INT: stats.int, WIS: stats.wis, CHA: stats.cha };
  const sortedSaves = [...allSaves].sort((a, b) => statMap[b] - statMap[a]);
  const numSaves = clampedCR >= 10 ? 3 : 2;
  const saves = sortedSaves.slice(0, numSaves).map(s => `${s} +${modNum(statMap[s]) + prof}`);

  // Skills with bonus
  const skills = archetype.skills.map(s => `${s} +${prof + Math.floor(clampedCR / 4)}`);

  // Damage resistances / immunities
  const allDmg = ['bludgeoning', 'piercing', 'slashing'];
  const resistances = clampedCR >= 5
    ? `${pick(archetype.damageTypes)}; ${allDmg.join(', ')} from nonmagical attacks`
    : pick(archetype.damageTypes);
  const immunities = clampedCR >= 10
    ? `${pick(archetype.damageTypes)}, poison`
    : 'poison';

  // Replace template placeholders in actions
  const replaceTemplates = (text) => {
    return text
      .replace(/\{atk\}/g, `${atkBonus}`)
      .replace(/\{dc\}/g, `${saveDC}`)
      .replace(/\{dpr1\}/g, `${dpr1}`)
      .replace(/\{dpr2\}/g, `${dpr2}`)
      .replace(/\{dpr_big\}/g, `${dprBig}`)
      .replace(/\{element\}/g, element)
      .replace(/\{cr_area\}/g, `${crArea}`)
      .replace(/\{cr_heal\}/g, `${crHeal}`)
      .replace(/\{cr_temp\}/g, `${crTemp}`);
  };

  const actions = archetype.actions.map(a => ({
    name: a.name,
    desc: replaceTemplates(a.desc),
  }));

  const legendaryActions = archetype.legendaryActions.map(a => ({
    name: a.name,
    desc: replaceTemplates(a.desc),
  }));

  const lairActions = archetype.lairActions.map(a => replaceTemplates(a));

  return {
    name: generateName(),
    cr: clampedCR,
    hp, ac,
    speed: archetype.speeds[0],
    stats,
    saves,
    skills,
    resistances,
    immunities,
    conditionImmunities: archetype.conditionImmunities.join(', '),
    senses: archetype.senses,
    element,
    actions,
    legendaryActions,
    lairActions,
    loreHook: pick(archetype.loreHooks),
    weaknessHint: pick(archetype.weaknessHints),
  };
}

/* ─── Styles ─── */
const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '16px',
};

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '13px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23888\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

const sectionLabel = {
  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-mute)',
  fontFamily: 'var(--font-mono, monospace)',
  marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
};

const btnPrimary = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 16px', borderRadius: '8px',
  background: '#c084fc22', border: '1px solid #c084fc44',
  color: '#c084fc', fontSize: '12px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
  transition: 'all 0.15s',
};

const btnSecondary = {
  ...btnPrimary,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-dim)',
};

const statBoxStyle = {
  textAlign: 'center', padding: '6px 4px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  minWidth: '48px',
};

const actionBlock = {
  padding: '8px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  marginBottom: '6px',
};

/* ─── Component ─── */
export default function BossGenerator() {
  const [targetCR, setTargetCR]       = useState(10);
  const [archetype, setArchetype]     = useState('random');
  const [boss, setBoss]               = useState(null);
  const [copied, setCopied]           = useState(false);

  const generate = useCallback(() => {
    const key = archetype === 'random' ? pick(ARCHETYPE_KEYS) : archetype;
    const arch = ARCHETYPES[key];
    const result = scaleStats(arch, targetCR);
    result.archetypeLabel = arch.label;
    setBoss(result);
    setCopied(false);
  }, [targetCR, archetype]);

  const copyStatBlock = useCallback(() => {
    if (!boss) return;
    const s = boss.stats;
    const lines = [
      `=== ${boss.name} ===`,
      `${boss.archetypeLabel} | CR ${boss.cr}`,
      '',
      `AC ${boss.ac} | HP ${boss.hp} | Speed ${boss.speed}`,
      '',
      `STR ${s.str} (${mod(s.str)}) | DEX ${s.dex} (${mod(s.dex)}) | CON ${s.con} (${mod(s.con)})`,
      `INT ${s.int} (${mod(s.int)}) | WIS ${s.wis} (${mod(s.wis)}) | CHA ${s.cha} (${mod(s.cha)})`,
      '',
      `Saving Throws: ${boss.saves.join(', ')}`,
      `Skills: ${boss.skills.join(', ')}`,
      `Damage Resistances: ${boss.resistances}`,
      `Damage Immunities: ${boss.immunities}`,
      `Condition Immunities: ${boss.conditionImmunities}`,
      `Senses: ${boss.senses}`,
      '',
      '--- Actions ---',
      ...boss.actions.map(a => `${a.name}. ${a.desc}`),
      '',
      '--- Legendary Actions (3/round) ---',
      ...boss.legendaryActions.map(a => `${a.name}. ${a.desc}`),
      '',
      '--- Lair Actions (Initiative 20) ---',
      ...boss.lairActions.map((a, i) => `${i + 1}. ${a}`),
      '',
      `--- Lore ---`,
      boss.loreHook,
      '',
      `--- Weakness Hint ---`,
      boss.weaknessHint,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [boss]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: '#c084fc18', border: '1px solid #c084fc33',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Crown size={16} color="#c084fc" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
            Boss Generator
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
            CR-scaled stat blocks with legendary and lair actions
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Target CR</label>
            <input
              type="number" min={1} max={30}
              value={targetCR}
              onChange={e => setTargetCR(Math.max(1, Math.min(30, +e.target.value || 1)))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Archetype</label>
            <select
              value={archetype}
              onChange={e => setArchetype(e.target.value)}
              style={selectStyle}
            >
              <option value="random">Random</option>
              {ARCHETYPE_KEYS.map(k => (
                <option key={k} value={k}>{ARCHETYPES[k].label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={generate} style={{ ...btnPrimary, justifyContent: 'center', width: '100%' }}>
          <Crown size={14} />
          Generate Boss
        </button>
      </div>

      {/* Result */}
      {boss && (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name + archetype + buttons */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-ui)' }}>
                {boss.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', marginTop: '2px' }}>
                {boss.archetypeLabel} — CR {boss.cr}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={generate} style={btnSecondary} title="Regenerate">
                <RefreshCw size={12} /> Reroll
              </button>
              <button onClick={copyStatBlock} style={btnSecondary} title="Copy Stat Block">
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* AC / HP / Speed */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
            padding: '10px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Shield size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />AC
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>
                {boss.ac}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Heart size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />HP
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono, monospace)' }}>
                {boss.hp}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Speed
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', marginTop: '4px' }}>
                {boss.speed}
              </div>
            </div>
          </div>

          {/* Ability Scores */}
          <div>
            <div style={sectionLabel}>Ability Scores</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
              {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => (
                <div key={s} style={statBoxStyle}>
                  <div style={{ fontSize: '9px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {s}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {boss.stats[s]}
                  </div>
                  <div style={{ fontSize: '10px', color: '#c084fc', fontFamily: 'var(--font-mono, monospace)' }}>
                    {mod(boss.stats[s])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saves, Skills, Immunities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-ui)' }}>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Saving Throws </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.saves.join(', ')}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Skills </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.skills.join(', ')}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Damage Resistances </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.resistances}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Damage Immunities </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.immunities}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Condition Immunities </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.conditionImmunities}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-mute)', fontWeight: 600 }}>Senses </span>
              <span style={{ color: 'var(--text-dim)' }}>{boss.senses}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Actions */}
          <div>
            <div style={sectionLabel}><Swords size={11} /> Actions</div>
            {boss.actions.map((a, i) => (
              <div key={i} style={actionBlock}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-ui)', marginBottom: '3px' }}>
                  {a.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}>
                  {a.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Legendary Actions */}
          <div>
            <div style={sectionLabel}><Star size={11} /> Legendary Actions (3/round)</div>
            <div style={{
              fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)',
              marginBottom: '8px', fontStyle: 'italic', lineHeight: 1.4,
            }}>
              The boss can take 3 legendary actions, choosing from the options below. Only one can be used at a time and only at the end of another creature's turn. Spent legendary actions are regained at the start of each turn.
            </div>
            {boss.legendaryActions.map((a, i) => (
              <div key={i} style={actionBlock}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#facc15', fontFamily: 'var(--font-ui)', marginBottom: '3px' }}>
                  {a.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}>
                  {a.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Lair Actions */}
          <div>
            <div style={sectionLabel}><Eye size={11} /> Lair Actions (Initiative 20)</div>
            <div style={{
              fontSize: '11px', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)',
              marginBottom: '8px', fontStyle: 'italic', lineHeight: 1.4,
            }}>
              On initiative count 20 (losing initiative ties), the boss takes a lair action to cause one of the following effects. It can't use the same effect two rounds in a row.
            </div>
            {boss.lairActions.map((a, i) => (
              <div key={i} style={{ ...actionBlock, display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono, monospace)', flexShrink: 0 }}>
                  {i + 1}.
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}>
                  {a}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Lore Hook */}
          <div>
            <div style={sectionLabel}><BookOpen size={11} /> Lore Hook</div>
            <div style={{
              fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)',
              padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              lineHeight: 1.5, fontStyle: 'italic',
            }}>
              {boss.loreHook}
            </div>
          </div>

          {/* Weakness Hint */}
          <div>
            <div style={sectionLabel}><Skull size={11} /> Weakness Hint</div>
            <div style={{
              fontSize: '12px', color: '#facc15', fontFamily: 'var(--font-ui)',
              padding: '8px 12px', borderRadius: '6px',
              background: '#facc1508',
              border: '1px solid #facc1522',
              lineHeight: 1.5,
            }}>
              {boss.weaknessHint}
            </div>
          </div>
        </div>
      )}

      {!boss && (
        <div style={{
          textAlign: 'center', padding: '32px 16px', color: 'var(--text-mute)',
          fontSize: '12px', fontFamily: 'var(--font-ui)',
        }}>
          Select an archetype and CR, then click Generate Boss.
        </div>
      )}
    </div>
  );
}

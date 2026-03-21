/**
 * playerWildShapeFormGuide.js
 * Player Mode: Druid Wild Shape — best forms by level, combat vs utility
 * Pure JS — no React dependencies.
 */

export const WILD_SHAPE_RULES = {
  uses: '2/SR. Regain on short or long rest.',
  duration: 'Level ÷ 2 hours (rounded down). Minimum 1 hour.',
  crLimit: 'Moon: CR 1 at L2, CR equals L÷3 at L6+. Others: CR 1/4 (no fly until L8, no swim until L4).',
  hp: 'You gain the beast\'s HP. When it drops to 0, you revert with remaining HP.',
  restrictions: 'Can\'t cast spells (until L18). Can concentrate on existing spells.',
  note: 'Moon Druids are the Wild Shape combat class. Others use it for utility/scouting.',
};

export const BEST_COMBAT_FORMS = [
  { form: 'Brown Bear', cr: 1, hp: 34, attacks: 'Bite (1d8+4) + Claws (2d6+4)', rating: 'S', note: 'Multiattack at CR 1. Best early Moon form. Available at L2.' },
  { form: 'Dire Wolf', cr: 1, hp: 37, attacks: 'Bite (2d6+3) + knockdown', rating: 'S', note: 'Pack Tactics + prone on hit. Great with melee allies.' },
  { form: 'Giant Constrictor Snake', cr: 2, hp: 60, attacks: 'Bite (2d6+4) + Constrict (2d8+4, grapple + restrain)', rating: 'S+', note: 'Grapple + restrain. Best CR 2 form.' },
  { form: 'Giant Scorpion', cr: 3, hp: 52, attacks: 'Multiattack (2 claws + sting, poison)', rating: 'A+', note: '3 attacks + poison. Good at CR 3.' },
  { form: 'Giant Ape', cr: 7, hp: 157, attacks: 'Multiattack (2 fists, 3d10+6)', rating: 'S+', note: 'Best high-CR form. 157 HP + massive damage. Available at Moon L21 (but Conjure Animals summons one at spell level).' },
  { form: 'Earth Elemental', cr: 5, hp: 126, attacks: 'Multiattack (2 slams, 2d8+5)', rating: 'S (Moon L10)', note: 'Elemental Wild Shape at Moon L10. Earth Glide. Resistance to nonmagical weapons.' },
  { form: 'Fire Elemental', cr: 5, hp: 102, attacks: 'Multiattack + fire form (contact damage)', rating: 'A+', note: 'Ignites enemies on contact. Good AoE but less tanky.' },
  { form: 'Water Elemental', cr: 5, hp: 114, attacks: 'Multiattack + Whelm (grapple + restrain)', rating: 'A+', note: 'Grapple in water form. Resistance to nonmagical. Good underwater.' },
  { form: 'Air Elemental', cr: 5, hp: 90, attacks: 'Multiattack + Whirlwind', rating: 'A', note: 'Fly speed 90ft. Whirlwind AoE. Lowest HP of elementals.' },
  { form: 'Mammoth', cr: 6, hp: 126, attacks: 'Gore (4d8+7) + Stomp (4d10+7, prone targets)', rating: 'S', note: 'Trampling Charge: prone + stomp. Massive damage.' },
];

export const BEST_UTILITY_FORMS = [
  { form: 'Cat', cr: 0, use: 'Scouting. Tiny, 40ft climb, no one suspects a cat.', rating: 'S+' },
  { form: 'Spider', cr: 0, use: 'Tiny. Web sense. Wall climbing. Perfect infiltration.', rating: 'S+' },
  { form: 'Rat', cr: 0, use: 'Tiny. Fits through any small opening. Darkvision 30ft.', rating: 'S' },
  { form: 'Hawk', cr: 0, use: 'Fly 60ft. Keen Sight (advantage Perception). Best aerial scout.', rating: 'S+ (L8 for non-Moon)' },
  { form: 'Octopus', cr: 0, use: 'Swim + squeeze through 1-inch spaces. Underwater infiltration.', rating: 'A+' },
  { form: 'Horse', cr: '1/4', use: 'Travel mount. 60ft speed. Carry allies.', rating: 'A' },
  { form: 'Fish (Quipper)', cr: 0, use: 'Swim 40ft. Breathe underwater. Tiny.', rating: 'A' },
  { form: 'Weasel', cr: 0, use: 'Tiny. Advantage on Perception (smell). Good for tracking.', rating: 'A' },
];

export const WILD_SHAPE_TIPS = [
  'Moon Druid L2: Brown Bear is your go-to. 34 HP buffer + multiattack.',
  'Wild Shape HP is a second health pool. You\'re effectively doubling your HP.',
  'Giant Constrictor Snake: grapple + restrain. Target can\'t escape easily.',
  'Cat/Spider for scouting. No one suspects a cat in a dungeon.',
  'You CAN maintain concentration while Wild Shaped. Cast a spell THEN transform.',
  'Healing Word on yourself works while in Wild Shape (ally casts it on you).',
  'At L18: cast spells in Wild Shape. Moon Druid becomes nearly immortal.',
  'Elemental Wild Shape (Moon L10): earth elemental for tankiness, air for mobility.',
  'Wild Shape 2/SR. Short rest to refresh. Use it liberally.',
  'Keep stat blocks ready for your favorite forms. Don\'t slow down the table.',
];

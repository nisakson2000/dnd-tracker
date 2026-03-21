/**
 * playerBardCollegeGuide.js
 * Player Mode: Bard College (subclass) comparison and optimization
 * Pure JS — no React dependencies.
 */

export const BARD_COLLEGES = [
  {
    college: 'College of Eloquence',
    rating: 'S+',
    source: 'TCE',
    keyFeature: 'Unsettling Words: BA subtract Bardic Inspiration die from target\'s next save. Universal Speech.',
    strengths: ['Min 10 on Persuasion/Deception (Eloquence)', 'Unfailing Inspiration: failed BI isn\'t spent', 'Unsettling Words + save-or-suck = guaranteed fail'],
    weaknesses: ['No combat features', 'Purely support/social focused'],
    playstyle: 'Ultimate face. Debuff saves, never waste Inspiration, always persuade.',
  },
  {
    college: 'College of Lore',
    rating: 'S',
    source: 'PHB',
    keyFeature: 'Cutting Words: reaction subtract BI from attack/ability/damage. Additional Magical Secrets at L6.',
    strengths: ['Extra Magical Secrets at L6 (steal ANY two spells)', 'Cutting Words is incredible defense', '3 extra proficiencies'],
    weaknesses: ['Cutting Words uses BI dice', 'Squishier than Valor/Swords'],
    bestL6Steals: ['Counterspell (S+)', 'Fireball (S)', 'Aura of Vitality (S)', 'Spirit Guardians (S)', 'Haste (S)'],
    playstyle: 'Versatile caster. Steal the best spells from every class. Control and debuff.',
  },
  {
    college: 'College of Swords',
    rating: 'A+',
    source: 'XGE',
    keyFeature: 'Blade Flourish: add BI to damage + special effect (defensive, slashing, mobile). Extra Attack.',
    strengths: ['Extra Attack at L6', 'Fighting Style (Dueling or TWF)', 'Can use weapon as focus', 'Flourishes add damage + utility'],
    weaknesses: ['Flourishes consume Bardic Inspiration', 'Less support than Lore/Eloquence'],
    playstyle: 'Melee bard. Fight with flourishes. Full caster with Extra Attack.',
  },
  {
    college: 'College of Valor',
    rating: 'A',
    source: 'PHB',
    keyFeature: 'Combat Inspiration: BI adds to damage or AC. Extra Attack. Medium armor + shields + martial weapons.',
    strengths: ['Extra Attack at L6', 'Medium armor + shields', 'Combat Inspiration lets allies boost AC'],
    weaknesses: ['Less damage than Swords', 'BI for AC is situational', 'Outclassed by Swords in most ways'],
    playstyle: 'Armored bard. Martial support. Solid but Swords does it better.',
  },
  {
    college: 'College of Creation',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Performance of Creation: create nonmagical object (worth up to 20×level gp). Animating Performance.',
    strengths: ['Create items from nothing (tools, supplies, equipment)', 'Dancing Item at L6: animated object fights for you', 'Creative problem solving'],
    weaknesses: ['Created items are temporary', 'Dancing Item has limited HP', 'Niche utility'],
    playstyle: 'Creator bard. Manifest objects. Animate items to fight. Creative solutions.',
  },
  {
    college: 'College of Glamour',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Mantle of Inspiration: temp HP + free movement to CHA mod allies (BA).',
    strengths: ['Incredible repositioning (allies move without OA)', 'Temp HP to multiple allies', 'Enthralling Performance for social'],
    weaknesses: ['Uses BI', 'Less damage than martial colleges'],
    playstyle: 'Fey enchanter. Reposition your party. Buff and charm.',
  },
  {
    college: 'College of Whispers',
    rating: 'B+',
    source: 'XGE',
    keyFeature: 'Psychic Blades: add BI die as psychic damage to weapon hit. Shadow Lore: charm humanoid.',
    strengths: ['Extra psychic damage on hits', 'Mantle of Whispers: steal dead creature\'s identity', 'Good for intrigue campaigns'],
    weaknesses: ['Psychic Blades are single-target only', 'Very niche features', 'Worst in standard dungeon-crawl'],
    playstyle: 'Spy bard. Kill and impersonate. Intrigue and deception.',
  },
  {
    college: 'College of Spirits',
    rating: 'B+',
    source: 'VRGR',
    keyFeature: 'Tales from Beyond: roll on Spirit Tales table for random effects using BI.',
    strengths: ['Some tales are very powerful (extra damage, teleport, healing)', 'Spiritual Focus: +1d6 to spell damage/healing', 'Fun randomness'],
    weaknesses: ['Random effects — can\'t plan around them', 'Some tales are weak', 'Unreliable compared to other colleges'],
    playstyle: 'Spirit medium. Channel random ghostly effects. Unpredictable but fun.',
  },
];

export const BARD_GENERAL_TIPS = [
  'Bardic Inspiration: CHA mod/LR (SR at L5). Give allies +1d6→d12 to attacks, saves, or checks.',
  'Jack of All Trades: +half PB to ALL ability checks you\'re not proficient in. Includes initiative and Counterspell checks.',
  'Magical Secrets (L10, L14, L18): steal ANY spells from any class list. Bard\'s signature feature.',
  'Best Magical Secrets: Find Greater Steed (S+), Counterspell (S+), Wall of Force (S+), Simulacrum (S), Swift Quiver (S for Swords).',
  'Font of Inspiration (L5): recover BI on short rest. Huge improvement.',
  'Bards are the best skill monkeys. Expertise at L3 and L10. Jack of All Trades covers everything else.',
  'Countercharm is bad. Don\'t try to use it. It uses your action and is almost never worth it.',
  'Song of Rest: allies heal extra 1d6→d12 when spending HD during SR. Free value.',
];

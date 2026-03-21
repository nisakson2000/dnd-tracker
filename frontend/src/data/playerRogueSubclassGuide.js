/**
 * playerRogueSubclassGuide.js
 * Player Mode: Rogue subclass comparison and optimization
 * Pure JS — no React dependencies.
 */

export const ROGUE_SUBCLASSES = [
  {
    subclass: 'Arcane Trickster',
    rating: 'S',
    source: 'PHB',
    keyFeature: 'Wizard spellcasting (Illusion/Enchantment focus). Mage Hand Legerdemain.',
    strengths: ['Shield and Absorb Elements access', 'Find Familiar for free advantage', 'Magical Ambush at L9 (disadvantage on saves from Hidden)'],
    weaknesses: ['INT dependency', 'Limited spell slots', 'Restricted school access (mostly)'],
    playstyle: 'Magical thief. Invisible Mage Hand, Shield for defense, familiar for advantage.',
  },
  {
    subclass: 'Soulknife',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'Psychic Blades: summon weapons (no evidence). Psi-Bolstered Knack: add die to failed checks.',
    strengths: ['Never unarmed', 'Telepathy (60ft)', 'Psychic damage (rarely resisted)', 'Psi die boosts skills'],
    weaknesses: ['Psychic Blades aren\'t magical (resistance issues)', 'Can\'t be enchanted'],
    playstyle: 'Psychic assassin. Silent, traceless kills. Telepathic communication.',
  },
  {
    subclass: 'Phantom',
    rating: 'A+',
    source: 'TCE',
    keyFeature: 'Wails from the Grave: deal Sneak Attack damage to a SECOND creature on SA hit.',
    strengths: ['AoE Sneak Attack (half dice to second target)', 'Flexible skill proficiencies from the dead', 'Ghost Walk at L13 (fly + phase through objects)'],
    weaknesses: ['Uses limited per PB/LR', 'Wails damage is half SA dice'],
    playstyle: 'Death-touched rogue. Damage two targets. Channel the dead for skills.',
  },
  {
    subclass: 'Swashbuckler',
    rating: 'S',
    source: 'XGE',
    keyFeature: 'Rakish Audacity: SA even in 1v1 (no ally needed). Free Disengage from anyone you attack.',
    strengths: ['Easiest Sneak Attack condition', 'CHA to initiative', 'Perfect for melee rogues', 'Never need to Disengage (free from targets you attack)'],
    weaknesses: ['Less utility than Arcane Trickster', 'Melee-focused (riskier than ranged)'],
    playstyle: 'Duelist. Walk up, stab, walk away. No OA, no ally needed.',
  },
  {
    subclass: 'Assassin',
    rating: 'B+',
    source: 'PHB',
    keyFeature: 'Assassinate: advantage + auto-crit on surprised creatures in first round.',
    strengths: ['Devastating when surprise works', 'Double damage on surprised enemies', 'Infiltration and disguise expertise'],
    weaknesses: ['Surprise is DM-dependent and rare', 'Useless after round 1', 'Party stealth required for surprise', 'Features assume social infiltration campaigns'],
    playstyle: 'One-shot specialist. Incredible when surprise works. Mediocre otherwise.',
  },
  {
    subclass: 'Scout',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Skirmisher: move half speed as reaction when enemy ends turn near you. Nature/Survival expertise.',
    strengths: ['Free disengage as reaction', 'Extra expertise (Nature + Survival)', 'Ambush Master at L13 (advantage on initiative + allies get advantage)'],
    weaknesses: ['Ranger-flavored rogue', 'Less impactful in dungeon campaigns'],
    playstyle: 'Wilderness rogue. Skirmish, scout, and kite enemies.',
  },
  {
    subclass: 'Thief',
    rating: 'A',
    source: 'PHB',
    keyFeature: 'Fast Hands: Use Object as BA. Second-Story Work: climbing speed. Use Magic Device at L13.',
    strengths: ['BA caltrops, oil, acid, healer\'s kit', 'Use any magic item at L13 (scrolls, wands, everything)', 'Climbing speed'],
    weaknesses: ['Fast Hands items are DM-dependent', 'Weak at early levels', 'Use Magic Device comes very late'],
    playstyle: 'Gadget rogue. Use items as BA. Eventually use ALL magic items.',
  },
  {
    subclass: 'Inquisitive',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Insightful Fighting: Insight vs Deception to get SA without advantage for 1 minute.',
    strengths: ['Reliable SA condition (no ally needed, no advantage needed)', 'Excellent detective skills', 'Eye for Detail (BA Perception/Investigation)'],
    weaknesses: ['Less damage than other subclasses', 'Features are skill-focused, not combat-focused'],
    playstyle: 'Detective. Guaranteed Sneak Attack through observation. Social/investigation specialist.',
  },
  {
    subclass: 'Mastermind',
    rating: 'B',
    source: 'XGE',
    keyFeature: 'Master of Tactics: Help as BA at 30ft range.',
    strengths: ['Give advantage to any ally within 30ft every turn', 'Disguise and deception expertise', 'Good support rogue'],
    weaknesses: ['BA Help competes with Cunning Action', 'Less personal damage', 'Support features are niche'],
    playstyle: 'Tactical support. Help allies from range. Mastermind behind the scenes.',
  },
];

export const ROGUE_GENERAL_TIPS = [
  'Sneak Attack once per TURN (not round). OA on enemy turn = second SA that round.',
  'Cunning Action: BA Dash, Disengage, or Hide every turn. Defines rogue combat.',
  'Steady Aim (Tasha\'s): BA to gain advantage on your next attack (can\'t move this turn). Ranged rogues love it.',
  'Uncanny Dodge (L5): halve ONE attack\'s damage as reaction. Use on the biggest hit.',
  'Evasion (L7): DEX save for half damage → 0 damage. Half on fail. You basically ignore Fireballs.',
  'Reliable Talent (L11): minimum 10 on any proficient check. Your floor is 10+mod+PB. Incredible.',
  'Expertise: double proficiency on two skills at L1, two more at L6. Be the best at what you do.',
  'Rogues don\'t need feats as badly as fighters. Max DEX first, then consider Alert, Lucky, or Sentinel.',
];

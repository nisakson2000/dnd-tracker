/**
 * playerStealthInfiltrationGuide.js
 * Player Mode: Stealth and infiltration — rules, optimization, and tactics
 * Pure JS — no React dependencies.
 */

export const STEALTH_RULES = {
  hiding: {
    requirement: 'Must be heavily obscured or behind total cover to attempt to hide.',
    check: 'Stealth check vs observer\'s passive Perception (10 + WIS mod + PB if proficient).',
    broken: 'Hidden status ends when you attack, cast a spell, or are discovered.',
    advantage: 'Attacks from hidden have advantage. Target doesn\'t add DEX to AC vs unseen attacker.',
  },
  surprise: {
    rule: 'If ALL party members beat enemies\' passive Perception with Stealth, enemies are surprised.',
    effect: 'Surprised creatures can\'t take actions or reactions on their first turn.',
    alert: 'Alert feat: can\'t be surprised. Still act on first round even if allies would be surprised.',
    note: 'Surprise is ALL or nothing per creature. Some enemies may be surprised, others not.',
  },
  unseen: {
    advantage: 'Attacks against targets that can\'t see you have advantage.',
    disadvantage: 'Attacks against targets you can\'t see have disadvantage.',
    both: 'If neither can see each other, advantages and disadvantages cancel out.',
  },
};

export const STEALTH_OPTIMIZATION = [
  { method: 'Pass Without Trace', effect: '+10 to ALL party Stealth checks.', source: 'Ranger/Druid L2 spell', rating: 'S+', note: 'Party minimum Stealth of 12+DEX. Entire party can stealth.' },
  { method: 'Expertise (Stealth)', effect: 'Double proficiency bonus to Stealth.', source: 'Rogue/Bard/Skill Expert', rating: 'S', note: 'Reliable Talent at Rogue L11 = minimum 20+ Stealth.' },
  { method: 'Invisibility', effect: 'Invisible = heavily obscured. Can hide anywhere.', source: 'L2 spell', rating: 'S', note: 'Don\'t need cover to hide. Advantage on Stealth inherent.' },
  { method: 'Gloom Stalker (Ranger)', effect: 'Invisible to Darkvision in darkness.', source: 'Ranger L3', rating: 'S+', note: 'In darkness, most monsters can\'t see you even with Darkvision.' },
  { method: 'Cloak of Elvenkind', effect: 'Advantage on Stealth. Disadvantage on Perception to spot you.', source: 'Magic item (uncommon)', rating: 'A+', note: 'Double advantage for stealth.' },
  { method: 'Boots of Elvenkind', effect: 'Advantage on Stealth to move silently.', source: 'Magic item (uncommon)', rating: 'A', note: 'Specifically for movement noise.' },
  { method: 'Mask of Many Faces', effect: 'Disguise Self at will.', source: 'Warlock invocation', rating: 'A+', note: 'Unlimited disguises. Walk past guards as one of them.' },
];

export const INFILTRATION_TACTICS = [
  { tactic: 'Familiar scout', detail: 'Send owl ahead. Share senses. Map enemy positions. Risk-free scouting.', rating: 'S' },
  { tactic: 'Disguise + social', detail: 'Disguise Self/Mask of Many Faces + Persuasion/Deception. Walk right in.', rating: 'S' },
  { tactic: 'Wild Shape (tiny creature)', detail: 'Druid becomes cat/spider. Slip through cracks. Scout undetected.', rating: 'A+' },
  { tactic: 'Dimension Door through walls', detail: '500ft teleport, no LOS. Bypass any physical barrier.', rating: 'S' },
  { tactic: 'Gaseous Form', detail: 'Become mist. Fly 10ft. Fit through any crack. Resistance to damage.', rating: 'A' },
  { tactic: 'Pass Without Trace + party', detail: '+10 Stealth for everyone. Even the Paladin in plate can sneak.', rating: 'S+' },
  { tactic: 'Silence + stealth', detail: '20ft radius of silence. No sound from inside. Perfect for noisy party members.', rating: 'A+' },
  { tactic: 'Knock spell', detail: 'Open any lock. Problem: it\'s EXTREMELY LOUD (300ft audible).', rating: 'B', fixNote: 'Cast Silence first, then Knock. No sound.' },
];

export const STEALTH_MISTAKES = [
  'Don\'t split the party for stealth if only one person is stealthy. Group stealth or nothing.',
  'Armor disadvantage: heavy armor and some medium armor impose disadvantage on Stealth.',
  'Light sources: your torch reveals you. Use Darkvision or Light on a pebble you can cover.',
  'Verbal spells: casting spells with verbal components breaks stealth.',
  'Opening doors: DM may require Stealth check to open doors quietly.',
  'Pass Without Trace solves most problems. If a Ranger/Druid has it, always use it.',
  'Stealth is a GROUP effort. One failed check can alert everyone. Help the lowest-Stealth member.',
];

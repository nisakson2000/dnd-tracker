/**
 * playerBardSubclassRankingGuide.js
 * Player Mode: Bard College (subclass) ranking
 * Pure JS — no React dependencies.
 */

export const BARD_COLLEGE_RANKING = [
  {
    college: 'Eloquence',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Silver Tongue: minimum 10 on Persuasion/Deception. Unsettling Words: BA subtract Inspiration die from enemy save. Universal Speech: speak to any creature.',
    keyFeatures: ['Silver Tongue (min 10 on Persuasion/Deception)', 'Unsettling Words (subtract from enemy saves)', 'Unfailing Inspiration (unused BI not lost)', 'Infectious Inspiration (chain BI on success)'],
    note: 'Best debuffer Bard. Unsettling Words + party save spell = near-guaranteed failure.',
  },
  {
    college: 'Lore',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Cutting Words: subtract BI die from enemy attack/check/damage. Additional Magical Secrets at L6 (steal Wizard/Cleric spells early). Three bonus skill proficiencies.',
    keyFeatures: ['Cutting Words (reaction debuff)', 'Bonus proficiencies (3 skills)', 'Additional Magical Secrets L6', 'Peerless Skill (add BI to own checks)'],
    note: 'Most versatile Bard. Early Magical Secrets = Find Familiar, Counterspell, Fireball at L6.',
  },
  {
    college: 'Creation',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Animating Performance: animate a Large or smaller item as a construct. Dancing Item is a solid combatant.',
    keyFeatures: ['Note of Potential (add d6 to BI effects)', 'Performance of Creation (create nonmagical items)', 'Animating Performance (animate item as combatant)', 'Creative Crescendo'],
    note: 'Dancing Item is a reliable combatant. Performance of Creation is creative utility.',
  },
  {
    college: 'Swords',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Extra Attack. Blade Flourishes (spend BI for combat maneuvers). Medium armor + scimitar. The martial Bard.',
    keyFeatures: ['Extra Attack', 'Blade Flourishes (defensive, slashing, mobile)', 'Fighting Style (Dueling or TWF)', 'Master\'s Flourish (free flourish at L14)'],
    note: 'Best melee Bard. Extra Attack + spellcasting. Hexblade 1/Swords Bard X is S-tier multiclass.',
  },
  {
    college: 'Valor',
    source: "Player's Handbook",
    tier: 'B+',
    reason: 'Extra Attack. Medium armor + shields + martial weapons. Combat Inspiration for allies. Outclassed by Swords.',
    keyFeatures: ['Extra Attack', 'Combat Inspiration (add to damage or AC)', 'Medium armor + shield + martial', 'Battle Magic (BA attack after spell at L14)'],
    note: 'Similar to Swords but strictly worse. Swords gets Blade Flourishes; Valor gets Combat Inspiration.',
  },
  {
    college: 'Glamour',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Mantle of Inspiration: BA to give temp HP + move allies without OA. Enthralling Performance: charm audience.',
    keyFeatures: ['Mantle of Inspiration (temp HP + free movement for allies)', 'Enthralling Performance (charm audience)', 'Mantle of Majesty (free Command each turn)', 'Unbreakable Majesty'],
    note: 'Great battlefield control. Mantle of Inspiration repositions party without OA. Underrated.',
  },
  {
    college: 'Spirits',
    source: "Van Richten's Guide to Ravenloft",
    tier: 'B',
    reason: 'Tales from Beyond: random effects from spirit table. Spiritual Focus: extra psychic damage. Random = unreliable.',
    keyFeatures: ['Spiritual Focus (+d6 to spell damage through focus)', 'Tales from Beyond (random spirit effects)', 'Spirit Session (ritual to learn spells)', 'Mystical Connection'],
    note: 'Fun flavor but randomness hurts reliability. Spirit Session is great utility.',
  },
  {
    college: 'Whispers',
    source: "Xanathar's Guide to Everything",
    tier: 'B',
    reason: 'Psychic Blades: spend BI for extra psychic damage on weapon hit. Shadow Lore: charm + compel obedience.',
    keyFeatures: ['Psychic Blades (BI → extra damage)', 'Words of Terror (frighten over 1 min)', 'Mantle of Whispers (steal identity of dead humanoid)', 'Shadow Lore (charm + obey at L14)'],
    note: 'Great for intrigue campaigns. Weak in pure combat. Identity theft is incredibly powerful in RP.',
  },
];

export function bardInspirationDie(bardLevel) {
  if (bardLevel >= 15) return { die: 'd12', note: 'Bardic Inspiration: d12' };
  if (bardLevel >= 10) return { die: 'd10', note: 'Bardic Inspiration: d10' };
  if (bardLevel >= 5) return { die: 'd8', note: 'Bardic Inspiration: d8' };
  return { die: 'd6', note: 'Bardic Inspiration: d6' };
}

/**
 * playerBardCollegeRankingGuide.js
 * Player Mode: All Bard Colleges ranked
 * Pure JS — no React dependencies.
 */

export const BARD_COLLEGES_RANKED = [
  { college: 'Eloquence', rating: 'S+', role: 'Support/Social', key: 'Unsettling Words: BA reduce save by BI die. Failed BI not expended.', note: 'Best Bard. BI never wasted.' },
  { college: 'Lore', rating: 'S', role: 'Versatile', key: 'Cutting Words: reduce enemy roll. Magical Secrets at L6.', note: 'Early Secrets. Most versatile.' },
  { college: 'Creation', rating: 'A+', role: 'Versatile', key: 'Create nonmagical items. Animate Large object L6.', note: 'Create anything. Animate it.' },
  { college: 'Glamour', rating: 'A+', role: 'Support', key: 'BI = temp HP + reposition allies without OAs.', note: 'Party repositioning. Great opener.' },
  { college: 'Spirits', rating: 'A+', role: 'Damage/Utility', key: 'Random powerful tale effects. +1d6 from Spiritual Focus.', note: 'All effects are strong.' },
  { college: 'Swords', rating: 'A+', role: 'Melee', key: 'Blade Flourish: BI for damage + effects. Extra Attack.', note: 'Best martial Bard.' },
  { college: 'Valor', rating: 'A', role: 'Martial', key: 'Combat Inspiration. Extra Attack. Medium armor + shields.', note: 'Swords usually better.' },
  { college: 'Whispers', rating: 'A', role: 'Infiltration', key: 'BI die as psychic damage on hit. Shadow Lore L14.', note: 'Best single-target damage Bard.' },
];

export const BARD_COLLEGE_TIPS = [
  'Eloquence: BI never wasted + BA save reduction. Best support.',
  'Lore: Magical Secrets at L6 — Counterspell + anything.',
  'Swords > Valor for melee Bards.',
  'Jack of All Trades: +half PB to Counterspell checks. Best counterspeller.',
  'Bardic Inspiration: short rest recovery at L5+. Use every fight.',
  'Glamour Mantle: repositions allies without OAs. Incredible opener.',
  'All Bards: Hypnotic Pattern, Polymorph, Animate Objects are top spells.',
];

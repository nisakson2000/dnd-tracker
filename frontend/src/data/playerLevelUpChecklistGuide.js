/**
 * playerLevelUpChecklistGuide.js
 * Player Mode: Level-up checklist — what to do when you gain a level
 * Pure JS — no React dependencies.
 */

export const LEVEL_UP_CHECKLIST = [
  { step: 1, task: 'Increase Hit Points', detail: 'Roll hit die OR take average (recommended). Add CON modifier.', note: 'Average is usually better for consistency.' },
  { step: 2, task: 'Check class features', detail: 'Read what you gain at this level. New features, improvements.', note: 'Don\'t skip subclass features at L3.' },
  { step: 3, task: 'New spells (if caster)', detail: 'Learn/prepare new spells. Check if you gain new spell levels.', note: 'L5 = 3rd level spells. Huge power spike.' },
  { step: 4, task: 'ASI or Feat (at L4, 8, 12, 16, 19)', detail: '+2 to one stat, +1 to two stats, or a feat.', note: 'Max primary stat to 20 before most feats.' },
  { step: 5, task: 'Update attack bonuses', detail: 'Proficiency bonus increases at L5, 9, 13, 17.', note: 'Attack bonus, spell DC, and save DC all change.' },
  { step: 6, task: 'Update spell save DC', detail: '8 + PB + spellcasting mod.', note: 'Goes up when PB increases.' },
  { step: 7, task: 'Update proficiency bonus', detail: 'L1-4: +2. L5-8: +3. L9-12: +4. L13-16: +5. L17-20: +6.', note: 'Affects attacks, saves, skills, DCs.' },
  { step: 8, task: 'Check cantrip scaling', detail: 'Cantrips scale at L5, 11, 17 (character level).', note: 'Extra die at each breakpoint.' },
  { step: 9, task: 'Update passive scores', detail: 'Passive Perception = 10 + WIS mod + PB (if proficient).', note: 'Changes with PB increases.' },
  { step: 10, task: 'Read subclass features', detail: 'Subclass gains features at specific levels.', note: 'Check your subclass progression chart.' },
];

export const POWER_SPIKE_LEVELS = [
  { level: 1, spike: 'Starting features. Origin/background.', note: 'Character creation.' },
  { level: 2, spike: 'Class-defining features (Action Surge, Spellcasting, Cunning Action).', note: 'Many classes come online at L2.' },
  { level: 3, spike: 'SUBCLASS CHOICE. Major power boost.', note: 'Most important level-up. Choose wisely.' },
  { level: 4, spike: 'First ASI/Feat.', note: 'Max primary stat or take GWM/SS.' },
  { level: 5, spike: 'BIGGEST POWER SPIKE. Extra Attack. 3rd level spells. PB → +3.', note: 'L5 is where the game changes dramatically.' },
  { level: 6, spike: 'Subclass feature #2.', note: 'Paladin Aura of Protection at L6.' },
  { level: 7, spike: 'Subclass feature #3.', note: 'Evasion for Rogue/Monk.' },
  { level: 8, spike: 'Second ASI/Feat.', note: 'Second chance to boost stats.' },
  { level: 9, spike: '5th level spells (full casters).', note: 'Wall of Force, Animate Objects, Hold Monster.' },
  { level: 11, spike: 'Fighter: 3rd attack. Casters: 6th level spells.', note: 'Another major spike.' },
  { level: 17, spike: '9th level spells. Wish. True Polymorph.', note: 'God-tier.' },
  { level: 20, spike: 'Capstone features.', note: 'Many are underwhelming. Multiclass instead?' },
];

export const HP_AVERAGES = {
  d6: { avg: 4, classes: ['Wizard', 'Sorcerer'] },
  d8: { avg: 5, classes: ['Bard', 'Cleric', 'Druid', 'Monk', 'Rogue', 'Warlock'] },
  d10: { avg: 6, classes: ['Fighter', 'Paladin', 'Ranger'] },
  d12: { avg: 7, classes: ['Barbarian'] },
  note: 'Average = (die max / 2) + 1. Take average for consistency.',
};

export const LEVEL_UP_TIPS = [
  'L5 is the biggest power spike. Extra Attack + 3rd level spells.',
  'Take average HP. Rolling is gambling with your survivability.',
  'L3: subclass choice. Research before choosing.',
  'ASI levels: max primary stat first.',
  'Update ALL numbers: attack, DC, saves, passive Perception.',
  'New spell levels: L3=2nd, L5=3rd, L7=4th, L9=5th spells.',
  'Cantrips scale at L5, 11, 17. Character level, not class.',
  'PB increases at L5, 9, 13, 17. Everything changes.',
  'Read your new features carefully. Don\'t miss abilities.',
  'L20 capstones are often weak. Consider multiclass at L17-19.',
];

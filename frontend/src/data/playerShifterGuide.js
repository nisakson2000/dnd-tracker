/**
 * playerShifterGuide.js
 * Player Mode: Shifter race guide — the lycanthrope-blooded
 * Pure JS — no React dependencies.
 */

export const SHIFTER_BASICS = {
  race: 'Shifter',
  source: 'Eberron: Rising from the Last War / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: 'Varies by subrace (original) or flexible (MotM)',
  theme: 'Lycanthropic heritage. Bonus action shifting grants temp HP and bonuses.',
  note: 'Shifting is a solid bonus action buff. Temp HP + subrace bonus. PB times per long rest. Good for martials.',
};

export const SHIFTER_SUBRACES = [
  {
    subrace: 'Beasthide',
    asi: '+2 CON, +1 STR (original)',
    shiftBonus: '+1 AC while shifted',
    tempHP: '1d6 + CON mod + level',
    note: 'Best tank Shifter. +1 AC + temp HP. Great for Barbarian/Fighter.',
    rating: 'A',
  },
  {
    subrace: 'Longtooth',
    asi: '+2 STR, +1 DEX (original)',
    shiftBonus: 'Fangs: bonus action bite attack (1d6+STR piercing) while shifted',
    tempHP: 'Level + CON mod',
    note: 'Extra bonus action attack. Great for classes without good bonus actions.',
    rating: 'A',
  },
  {
    subrace: 'Swiftstride',
    asi: '+2 DEX, +1 CHA (original)',
    shiftBonus: '+10ft speed. When creature ends turn within 5ft: reaction to move 10ft (no OA)',
    tempHP: 'Level + CON mod',
    note: 'Hit and run. Good for Rogues and Rangers. Free disengage-like reaction.',
    rating: 'B',
  },
  {
    subrace: 'Wildhunt',
    asi: '+2 WIS, +1 DEX (original)',
    shiftBonus: 'Advantage on WIS checks. No creature within 30ft can have advantage on attacks against you.',
    tempHP: 'Level + CON mod',
    note: 'Anti-advantage is powerful. Pack Tactics, flanking, Reckless Attack — all negated while shifted.',
    rating: 'A',
  },
];

export const SHIFTER_BUILDS = [
  { build: 'Beasthide Barbarian', detail: '+2 CON. Shift for +1 AC + temp HP while raging. Double tanking buffs.', rating: 'S' },
  { build: 'Longtooth Fighter', detail: '+2 STR. Shift for bonus action bite. Fighters lack bonus action attacks. Extra attack per turn.', rating: 'A' },
  { build: 'Swiftstride Rogue', detail: '+2 DEX. +10ft speed + reaction movement. Hit and run synergy.', rating: 'A' },
  { build: 'Wildhunt Druid/Cleric', detail: '+2 WIS. Anti-advantage while concentrating on spells. Enemies can\'t easily gain advantage on you.', rating: 'A' },
  { build: 'Longtooth Paladin', detail: '+2 STR. Shift for bonus action bite. Paladins lack bonus action attacks (except Smite spells).', rating: 'A' },
];

export const SHIFTING_ANALYSIS = {
  action: 'Bonus action',
  duration: '1 minute',
  usesPerDay: 'PB times per long rest',
  tempHP: 'Varies by subrace',
  note: 'Shifting is efficient. Bonus action, 1 minute, temp HP + bonus. Use at start of combat.',
};

export function shiftingTempHP(subrace, level, conMod) {
  if (subrace === 'beasthide') return Math.max(1, Math.floor(Math.random() * 6) + 1 + conMod + level); // 1d6+CON+level (use avg)
  return level + conMod; // Other subraces: level + CON
}

export function shiftingTempHPAvg(subrace, level, conMod) {
  if (subrace === 'beasthide') return 3.5 + conMod + level;
  return level + conMod;
}

export function shiftingUses(proficiencyBonus) {
  return proficiencyBonus;
}

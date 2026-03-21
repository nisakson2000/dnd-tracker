/**
 * playerTrapDetectionGuide.js
 * Player Mode: Trap detection, disarming, and avoidance strategies
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION_BASICS = {
  passivePerception: 'DM compares trap DC vs passive Perception. If passive ≥ DC: you notice the trap.',
  activeSearch: 'Investigation or Perception check (player choice, DM may specify). Takes time (1 minute per 10ft area).',
  trapDCs: [
    { difficulty: 'Easy', dc: 10, note: 'Obvious pressure plates, tripwires at eye level.' },
    { difficulty: 'Moderate', dc: 15, note: 'Hidden pit covers, disguised tripwires.' },
    { difficulty: 'Hard', dc: 20, note: 'Magical triggers, expertly concealed mechanisms.' },
    { difficulty: 'Nearly Impossible', dc: 25, note: 'Archmage-level wards, impossible without expertise.' },
  ],
};

export const TRAP_DISARM_METHODS = [
  { method: 'Thieves\' Tools', skill: 'DEX (Thieves\' Tools)', note: 'Standard disarm. Match or beat trap DC. Failure by 5+ may trigger trap.' },
  { method: 'Dispel Magic', skill: 'Spellcasting', note: 'Dispels magical traps. DC = 10 + trap spell level. Auto-success if your slot ≥ trap level.' },
  { method: 'Mage Hand', skill: 'None', note: 'Trigger trap from 30ft away. Safe if you know the trigger. Can\'t disarm — only trigger.' },
  { method: 'Find Traps spell', skill: 'None', note: 'L2 Cleric/Druid. Reveals presence of traps within 120ft. Does NOT locate or identify them. Disappointing spell.' },
  { method: 'Detect Magic', skill: 'None', note: 'Reveals magical traps. Identifies school. Doesn\'t disarm but helps plan.' },
  { method: '10-foot pole', skill: 'None', note: 'Classic. Prod ahead of you. Triggers pressure plates, tripwires from 10ft away.' },
  { method: 'Unseen Servant', skill: 'None', note: 'Ritual. Send servant ahead. Triggers traps. Servant has 1 HP, invisible.' },
];

export const TRAP_TYPES = [
  { type: 'Pit Trap', detection: 'Perception (see cracks/seams)', disarm: 'Thieves\' tools or spike the cover', avoid: 'Jump over, Misty Step, fly', damage: '1d6 per 10ft + possible spikes (1d10 piercing)' },
  { type: 'Poison Dart', detection: 'Perception (tiny holes in walls)', disarm: 'Thieves\' tools (block holes or disarm trigger)', avoid: 'Shield, high DEX save', damage: '1d4 piercing + poison (varies)' },
  { type: 'Falling Block/Portcullis', detection: 'Perception (cracks above, pressure plate)', disarm: 'Thieves\' tools or jam mechanism', avoid: 'DEX save, dash through', damage: '2d10-4d10 bludgeoning' },
  { type: 'Glyph of Warding', detection: 'Investigation (magical, nearly invisible)', disarm: 'Dispel Magic or don\'t trigger', avoid: 'Find it first. Can\'t dodge if you\'re in range.', damage: '5d8 elemental or spell effect (up to L9)' },
  { type: 'Symbol', detection: 'Investigation DC 15+', disarm: 'Dispel Magic (high DC)', avoid: 'Don\'t read it. Don\'t enter area.', damage: 'Varies: death, fear, insanity, pain, sleep, stun' },
  { type: 'Collapsing Ceiling', detection: 'Perception (cracks, dust, unstable)', disarm: 'Shore up with pillars or Mold Earth', avoid: 'DEX save. Don\'t step on trigger.', damage: '4d10 bludgeoning, restrained by rubble' },
];

export const BEST_TRAP_FINDERS = [
  { class: 'Rogue', why: 'Expertise in Perception + Thieves\' Tools. Reliable Talent (L11): can\'t roll below 10. Best trap handler.', rating: 'S' },
  { class: 'Artificer', why: 'Tool proficiencies. Flash of Genius +INT to checks. Magical trap knowledge.', rating: 'A' },
  { class: 'Ranger', why: 'Primeval Awareness. Natural Explorer. Perception proficiency common.', rating: 'B' },
  { class: 'Wizard (Divination)', why: 'Portent can replace Perception/Investigation rolls. Detect Magic as ritual. Find Traps.', rating: 'B' },
];

export const TRAP_AVOIDANCE_TIPS = [
  { tip: 'Always check doors before opening', note: 'Perception check on doors. Look for tripwires, pressure plates, discoloration.' },
  { tip: 'Send familiar/Unseen Servant first', note: 'Expendable scouts. Trigger traps safely. Familiar can fly over pit traps.' },
  { tip: 'Check floors in treasure rooms', note: 'Treasure rooms are ALWAYS trapped. Floor tiles, chest traps, glyph wards.' },
  { tip: 'Listen for mechanical sounds', note: 'Perception (hearing): clicking, grinding, hissing. Signs of armed mechanisms.' },
  { tip: 'Arcana check on magical traps', note: 'Once detected: Arcana check can identify the spell and its trigger conditions.' },
  { tip: 'Carry a bag of sand/ball bearings', note: 'Drop on floors to reveal pressure plates. Roll ball bearings to trigger from distance.' },
];

export function passivePerception(wisMod, isProficient, profBonus, hasAdvantage = false, hasDisadvantage = false) {
  let base = 10 + wisMod + (isProficient ? profBonus : 0);
  if (hasAdvantage) base += 5;
  if (hasDisadvantage) base -= 5;
  return base;
}

export function trapDisarmDC(trapDifficulty) {
  const dcs = { easy: 10, moderate: 15, hard: 20, nearlyImpossible: 25 };
  return dcs[trapDifficulty] || 15;
}

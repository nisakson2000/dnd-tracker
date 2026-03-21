/**
 * playerNecromancyGuide.js
 * Player Mode: Necromancy spells — raising undead, death effects, and dark magic
 * Pure JS — no React dependencies.
 */

export const NECROMANCY_SPELLS_RANKED = [
  { spell: 'Toll the Dead', level: 0, rating: 'S', note: 'Best damage cantrip for Clerics. 1d12 if already damaged. WIS save.' },
  { spell: 'Spare the Dying', level: 0, rating: 'A', note: 'Stabilize at 0 HP. Range of touch (30ft for Grave Cleric). Niche but life-saving.' },
  { spell: 'Inflict Wounds', level: 1, rating: 'A', note: '3d10 necrotic (melee). Highest L1 single-target damage. Risky at touch range.' },
  { spell: 'False Life', level: 1, rating: 'B+', note: '1d4+4 temp HP. Quick pre-combat buffer. Short duration limits value.' },
  { spell: 'Ray of Enfeeblement', level: 2, rating: 'B', note: 'Half STR weapon damage. Concentration + CON save each turn. Niche.' },
  { spell: 'Gentle Repose', level: 2, rating: 'A', note: 'Extend Revivify window to 10 days. Ritual castable. Critical for resurrection plans.' },
  { spell: 'Animate Dead', level: 3, rating: 'S', note: 'Raise skeleton or zombie. Lasts 24 hrs. Recast to maintain. Build an army.' },
  { spell: 'Vampiric Touch', level: 3, rating: 'B+', note: '3d6 necrotic melee + heal half. Concentration. Risky but self-sustaining.' },
  { spell: 'Speak with Dead', level: 3, rating: 'A', note: 'Ask corpse 5 questions. Incredible investigation tool. No secrets are safe.' },
  { spell: 'Revivify', level: 3, rating: 'S+', note: 'Bring back from death within 1 minute. 300gp diamond. ALWAYS prepare.' },
  { spell: 'Blight', level: 4, rating: 'B', note: '8d8 necrotic. CON save for half. Kills plants instantly. Single-target nuke.' },
  { spell: 'Death Ward', level: 4, rating: 'S', note: 'First time target drops to 0, instead drop to 1. 8 hour duration. Pre-cast before boss.' },
  { spell: 'Raise Dead', level: 5, rating: 'A+', note: '10-day death window. 500gp diamond. -4 penalty (reduces by 1 per LR).' },
  { spell: 'Contagion', level: 5, rating: 'A', note: '3 failed CON saves = diseased for 7 days. Slimy Doom = disadvantage on CON saves.' },
  { spell: 'Danse Macabre', level: 5, rating: 'A', note: 'Animate 5 corpses. +spellcasting mod to attacks. Concentration but powerful army.' },
  { spell: 'Create Undead', level: 6, rating: 'A+', note: '3 ghouls (or higher undead at higher slots). Stronger than Animate Dead summons.' },
  { spell: 'Soul Cage', level: 6, rating: 'A', note: 'Capture humanoid soul. Heal 2d8, ask questions, or gain advantage. 6 uses.' },
  { spell: 'Finger of Death', level: 7, rating: 'A+', note: '7d8+30 necrotic. If it kills humanoid, they rise as permanent zombie under your control.' },
  { spell: 'Clone', level: 8, rating: 'S+', note: 'Grow a backup body. If you die, your soul enters the clone. Immortality insurance.' },
  { spell: 'True Resurrection', level: 9, rating: 'S', note: 'Resurrect anyone who died within 200 years. 25,000gp diamond. Ultimate revival.' },
];

export const UNDEAD_ARMY_MANAGEMENT = {
  animateDead: {
    creates: '1 skeleton or zombie per casting. Upcast: +2 per slot level above 3rd.',
    maintenance: 'Recast every 24 hours to maintain control. Each casting reasserts control over 4 raised.',
    scaling: 'L5 Wizard: 1 undead. L7: 3 undead (L3+L4 slots). L9: 6+ undead.',
    maxArmy: 'Limited by spell slots for maintenance. Realistically 6-12 at mid levels.',
  },
  skeletonVsZombie: [
    { type: 'Skeleton', hp: 13, ac: 13, attack: '+4 (1d6+2 shortsword or 1d6+2 shortbow)', advantage: 'Ranged attacks, better AC', rating: 'A+' },
    { type: 'Zombie', hp: 22, ac: 8, attack: '+3 (1d6+1 slam)', advantage: 'Undead Fortitude (CON save to not die at 0 HP)', rating: 'B+' },
  ],
  tips: [
    'Skeletons are better. Higher AC, ranged option, better damage.',
    'Equip skeletons with better weapons/armor if available.',
    'Necromancy Wizard: undead have +PB HP and +PB damage. Makes them viable longer.',
    'Keep undead out of sight in towns. NPCs WILL react negatively.',
    'Use undead as scouts, pack mules, and trap triggers, not just combat.',
  ],
};

export const NECROMANCY_TIPS = [
  'Death Ward is the most underrated necromancy spell. 8 hours, no concentration. Cast before every boss fight.',
  'Gentle Repose + Revivify: cast Gentle Repose on corpse to preserve it. Revivify within 10 days instead of 1 minute.',
  'Clone is the best L8 spell. Grow a backup body. You\'re functionally immortal.',
  'Finger of Death creates PERMANENT zombies. They never need reasserting. Build a free army over time.',
  'Toll the Dead: best cleric cantrip. 1d12 on damaged targets outperforms Sacred Flame.',
  'Speak with Dead: the corpse doesn\'t have to be willing. Ask murder victims who killed them.',
];

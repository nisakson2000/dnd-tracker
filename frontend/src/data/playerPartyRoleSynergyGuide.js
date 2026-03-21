/**
 * playerPartyRoleSynergyGuide.js
 * Player Mode: Party roles and how to synergize — tank, healer, DPS, control, support
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = {
  tank: {
    role: 'Tank / Frontline',
    job: 'Absorb damage. Control space. Protect squishies.',
    bestClasses: ['Paladin', 'Fighter', 'Barbarian', 'Moon Druid', 'Cleric (Forge/Life)'],
    keyFeatures: ['High AC (18+)', 'High HP', 'Sentinel feat', 'Compelled Duel', 'Goading Attack'],
    note: 'D&D has no aggro system. Use Sentinel, Goading Attack, or positioning.',
  },
  healer: {
    role: 'Healer',
    job: 'Keep allies alive. Healing Word when someone goes down. Revivify when needed.',
    bestClasses: ['Cleric (Life/Grave)', 'Druid (Shepherd)', 'Bard', 'Paladin', 'Celestial Warlock'],
    keyFeatures: ['Healing Word (bonus action)', 'Revivify', 'Aura of Vitality', 'Mass Healing Word'],
    note: 'Reactive healing. Don\'t waste actions on proactive Cure Wounds.',
  },
  striker: {
    role: 'Striker / DPS',
    job: 'Deal maximum damage. Focus fire priority targets. Nova on bosses.',
    bestClasses: ['Fighter', 'Rogue', 'Ranger', 'Paladin (smite)', 'Warlock (EB)', 'Monk'],
    keyFeatures: ['Extra Attack', 'Sneak Attack', 'Divine Smite', 'Action Surge', 'Eldritch Blast'],
    note: 'Focus fire. Don\'t spread damage. Kill one enemy at a time.',
  },
  controller: {
    role: 'Controller',
    job: 'Disable enemies. Area denial. Crowd control. Battlefield shaping.',
    bestClasses: ['Wizard', 'Sorcerer', 'Druid', 'Bard'],
    keyFeatures: ['Hypnotic Pattern', 'Web', 'Wall of Force', 'Entangle', 'Slow', 'Fear'],
    note: 'Best controller spell first, then let party clean up.',
  },
  support: {
    role: 'Support / Buffer',
    job: 'Enhance allies. Grant advantage, bonuses, temp HP. Counterspell.',
    bestClasses: ['Bard', 'Cleric', 'Paladin', 'Artificer'],
    keyFeatures: ['Bless', 'Faerie Fire', 'Bardic Inspiration', 'Aura of Protection', 'Haste'],
    note: 'Supporting one ally to double their effectiveness > your own mediocre attack.',
  },
  utility: {
    role: 'Utility / Scout',
    job: 'Solve problems outside combat. Scout, disable traps, gather info.',
    bestClasses: ['Rogue', 'Ranger', 'Wizard (ritual)', 'Artificer', 'Bard'],
    keyFeatures: ['Expertise', 'Thieves\' Tools', 'Ritual Casting', 'Pass Without Trace', 'Guidance'],
    note: 'Exploration and social pillars. Equally important as combat.',
  },
};

export const ROLE_COMBOS = [
  { combo: 'Paladin + Bard', synergy: 'Paladin tanks + Aura of Protection. Bard buffs + heals + controls.', note: 'Both CHA-based. Paladin aura protects Bard. Bard inspires Paladin.' },
  { combo: 'Fighter + Wizard', synergy: 'Fighter holds frontline. Wizard controls battlefield behind.', note: 'Sculpt Spells: Wizard Fireballs around Fighter safely.' },
  { combo: 'Rogue + Cleric', synergy: 'Rogue scouts and DPS. Cleric heals, buffs, controls undead.', note: 'Rogue finds traps. Cleric handles everything else.' },
  { combo: 'Barbarian + Moon Druid', synergy: 'Both are HP sponges. Alternate tanking. Wild Shape + Rage both absorb.', note: 'Two meat shields. Enemies can\'t focus either down.' },
  { combo: 'Warlock + Sorcerer', synergy: 'Warlock sustains with EB. Sorcerer nova with Metamagic.', note: 'Both CHA. Warlock short rest, Sorcerer long rest. Cover all bases.' },
];

export const CLASS_CONTRIBUTION = [
  { class: 'Fighter', contributes: 'Consistent damage, Action Surge nova, tank.', partyRole: 'Striker/Tank.' },
  { class: 'Wizard', contributes: 'Control, AoE, ritual utility, knowledge.', partyRole: 'Controller/Utility.' },
  { class: 'Cleric', contributes: 'Healing, buffs, control, melee tank (some).', partyRole: 'Healer/Support/Tank.' },
  { class: 'Rogue', contributes: 'Single-target DPS, skills, scouting, traps.', partyRole: 'Striker/Utility.' },
  { class: 'Paladin', contributes: 'Smite nova, tanking, aura, healing.', partyRole: 'Tank/Striker/Support.' },
  { class: 'Barbarian', contributes: 'HP tank, damage resistance, consistent DPR.', partyRole: 'Tank/Striker.' },
  { class: 'Bard', contributes: 'Inspiration, healing, control, skills, face.', partyRole: 'Support/Controller/Utility.' },
  { class: 'Druid', contributes: 'Control, healing, Wild Shape tank, utility.', partyRole: 'Controller/Healer/Tank.' },
  { class: 'Ranger', contributes: 'Sustained DPR, scouting, Pass Without Trace.', partyRole: 'Striker/Utility.' },
  { class: 'Warlock', contributes: 'EB sustained DPR, control, short rest recovery.', partyRole: 'Striker/Controller.' },
  { class: 'Sorcerer', contributes: 'Metamagic nova, Twinned buffs, Subtle counterspell.', partyRole: 'Controller/Striker.' },
  { class: 'Monk', contributes: 'Stunning Strike, mobility, skirmishing.', partyRole: 'Striker/Controller.' },
  { class: 'Artificer', contributes: 'Infusions, support, utility, half-caster.', partyRole: 'Support/Utility.' },
];

export const PARTY_SYNERGY_TIPS = [
  'Every party needs: damage, healing, tanking, and control.',
  'Paladin Aura of Protection: best party feature. +CHA to all saves.',
  'Bless: +1d4 to attacks AND saves. Best support concentration.',
  'Focus fire: entire party attacks same target. Kill fast.',
  'Tank + Controller: tank holds line, controller disables from behind.',
  'Don\'t all play the same role. Diversify.',
  'Rogue needs an ally adjacent to target for Sneak Attack. Position for it.',
  'Two healers is luxury. One healer + good prevention is better.',
  'Counterspell user: at least one party member should have this.',
  'Revivify: someone must have it. 300gp diamond. Non-negotiable.',
];

/**
 * playerPartyCompositionGuide.js
 * Player Mode: Party composition advice — roles, gaps, and synergies
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Frontliner/Tank', description: 'Takes hits. High AC/HP. Melee damage. Controls enemy positioning.', classes: ['Fighter', 'Barbarian', 'Paladin', 'Cleric (heavy armor)'], essentialness: 'High', note: 'Someone needs to be between enemies and casters. Without a frontliner, casters get overwhelmed.' },
  { role: 'Healer', description: 'Restores HP. Removes conditions. Revives downed allies.', classes: ['Cleric', 'Druid', 'Bard', 'Paladin', 'Celestial Warlock'], essentialness: 'High', note: 'At minimum, someone needs Healing Word. Full healer not required but greatly helps survival.' },
  { role: 'Damage Dealer (Striker)', description: 'Focuses on killing enemies quickly. Single-target or AoE damage.', classes: ['Fighter', 'Rogue', 'Warlock', 'Ranger', 'Monk', 'Sorcerer'], essentialness: 'High', note: 'Every party needs damage output. The best defense is killing enemies before they kill you.' },
  { role: 'Controller', description: 'Area denial, crowd control, battlefield shaping. Removes enemies from combat without killing them.', classes: ['Wizard', 'Druid', 'Sorcerer', 'Bard'], essentialness: 'Medium', note: 'Hypnotic Pattern, Web, Wall of Force. Controllers turn deadly encounters into manageable ones.' },
  { role: 'Utility/Face', description: 'Skills, social interaction, problem-solving outside combat.', classes: ['Bard', 'Rogue', 'Ranger', 'Wizard'], essentialness: 'Medium', note: 'Someone needs social skills (Persuasion, Deception). Someone needs trap/lock skills.' },
  { role: 'Scout', description: 'Reconnaissance, stealth, information gathering.', classes: ['Rogue', 'Ranger', 'Druid (Wild Shape)', 'Warlock (Pact of Chain)'], essentialness: 'Low', note: 'Nice to have. Familiar can substitute. Prevents ambushes and reveals dangers.' },
];

export const ESSENTIAL_PARTY_CHECKLIST = [
  { need: 'Healing Word access', importance: 'Critical', classes: ['Bard', 'Cleric', 'Druid'], note: 'Someone MUST have bonus action ranged healing. The #1 must-have spell in the game.' },
  { need: 'Revivify access', importance: 'High', classes: ['Cleric', 'Paladin', 'Druid', 'Artificer', 'Divine Soul Sorcerer'], note: 'By L5, someone should be able to bring back the dead. Carry the 300gp diamond.' },
  { need: 'Dispel Magic/Counterspell', importance: 'High', classes: ['Wizard', 'Sorcerer', 'Warlock', 'Bard', 'Cleric', 'Druid'], note: 'By L5-7, enemy spellcasters become common. Need magical countermeasures.' },
  { need: 'Perception proficiency', importance: 'High', classes: ['Any'], note: 'At least 2 party members should have Perception proficiency for passive detection.' },
  { need: 'Thieves\' tools proficiency', importance: 'Medium', classes: ['Rogue', 'Artificer', 'anyone via background'], note: 'Locked chests, trapped doors, pick locks. Someone needs this.' },
  { need: 'Ranged damage option', importance: 'Medium', classes: ['Any'], note: 'Not all enemies are reachable in melee. At least 1-2 members need ranged attacks.' },
  { need: 'Magical damage', importance: 'Medium (high at L5+)', classes: ['Any caster', 'Monk (L6)'], note: 'Many monsters resist nonmagical damage. Need magic weapons or spell attacks.' },
];

export const PARTY_SIZE_ADJUSTMENTS = {
  three: { note: 'Each member must cover multiple roles. Flexibility is key. Consider classes with versatility (Bard, Cleric, Druid).', tip: 'Moon Druid + Bard + Fighter covers healing, control, frontline, skills, and damage.' },
  four: { note: 'Standard party. Each member takes 1-2 primary roles. Classic: Fighter, Rogue, Cleric, Wizard.', tip: 'The "classic four" covers all roles. Any combination works if you cover healing + frontline + damage.' },
  five: { note: 'Luxury of specialization. Can afford niche builds. Extra striker or controller.', tip: 'Fifth member can be anything. Pure damage (Barbarian, Warlock) or pure utility (Bard, Artificer).' },
  six: { note: 'Full coverage. Someone for every situation. DM needs to increase encounter difficulty.', tip: 'More members = more action economy = easier fights. DM should use Deadly encounters as baseline.' },
};

export const STRONG_CLASS_SYNERGIES = [
  { combo: 'Paladin + Bard', synergy: 'Bard gives Bardic Inspiration for Paladin attacks. Paladin Aura boosts Bard saves. Both CHA classes.', rating: 'S' },
  { combo: 'Rogue + Order Cleric', synergy: 'Voice of Authority: when Cleric casts spell on Rogue, Rogue gets reaction attack = extra Sneak Attack.', rating: 'S' },
  { combo: 'Druid + Warlock (Repelling Blast)', synergy: 'Druid casts Spike Growth. Warlock pushes enemies through it with EB. 2d4 per 5ft × 40ft push = 16d4.', rating: 'S' },
  { combo: 'Wizard + Fighter', synergy: 'Wizard controls the battlefield (Web, Wall of Force). Fighter kills trapped enemies. Clear roles.', rating: 'A' },
  { combo: 'Life Cleric + Shepherd Druid', synergy: 'Double healing synergies. Life Cleric boosts all heals. Shepherd Druid Unicorn Totem adds party-wide healing.', rating: 'A' },
  { combo: 'Barbarian + Ancestral Guardian', synergy: 'Ancestral Guardians debuff enemy damage to anyone but you. Party takes less damage. You take more but resist it.', rating: 'A' },
];

export function partyRoleCoverage(members) {
  const roles = { frontliner: false, healer: false, striker: false, controller: false, utility: false };
  for (const member of members) {
    if (member.roles) member.roles.forEach(r => { roles[r] = true; });
  }
  const covered = Object.values(roles).filter(Boolean).length;
  return { roles, coverage: `${covered}/5 roles covered`, gaps: Object.entries(roles).filter(([, v]) => !v).map(([k]) => k) };
}

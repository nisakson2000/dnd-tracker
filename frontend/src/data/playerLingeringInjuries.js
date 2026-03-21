/**
 * playerLingeringInjuries.js
 * Player Mode: Optional lingering injuries table (DMG)
 * Pure JS — no React dependencies.
 */

export const LINGERING_INJURIES = [
  { roll: 1, injury: 'Lose an Eye', effect: 'Disadvantage on Perception (sight) and ranged attacks. Cured by Regenerate.', severity: 'major' },
  { roll: 2, injury: 'Lose an Arm or Hand', effect: 'Can\'t hold two-handed items. Can\'t hold items in lost hand. Cured by Regenerate.', severity: 'major' },
  { roll: 3, injury: 'Lose a Foot or Leg', effect: 'Speed halved. Can\'t Dash. Disadvantage on DEX checks for balance. Cured by Regenerate.', severity: 'major' },
  { roll: 4, injury: 'Limp', effect: 'Speed reduced by 5 feet. Cured by magical healing or DC 15 Medicine.', severity: 'moderate' },
  { roll: 5, injury: 'Internal Injury', effect: 'Whenever you attempt an action in combat, DC 15 CON save or lose the action. Cured by Heal or DC 15 Medicine.', severity: 'moderate' },
  { roll: '6-7', injury: 'Broken Ribs', effect: 'Whenever you attempt an action, DC 10 CON save or lose the action. Cured by magical healing or 10 days rest.', severity: 'moderate' },
  { roll: '8-10', injury: 'Horrible Scar', effect: 'No mechanical effect, but disadvantage on Persuasion, advantage on Intimidation. Cured by Heal or Greater Restoration.', severity: 'minor' },
  { roll: '11-13', injury: 'Festering Wound', effect: 'Max HP reduced by 1 per 24 hours until cured. Cured by DC 15 Medicine or any magical healing.', severity: 'moderate' },
  { roll: '14-16', injury: 'Minor Scar', effect: 'No mechanical effect. Cosmetic only.', severity: 'minor' },
];

export const INJURY_TRIGGERS = [
  'Critical hit against you (optional rule)',
  'Dropping to 0 hit points (optional rule)',
  'Failing a death save by 5 or more',
  'DM discretion (narrative moments)',
];

export const INJURY_CURES = [
  { cure: 'Regenerate (7th)', cures: 'All lingering injuries, regrows lost limbs/organs.' },
  { cure: 'Heal (6th)', cures: 'Scars, internal injuries, festering wounds.' },
  { cure: 'Greater Restoration (5th)', cures: 'Horrible scars.' },
  { cure: 'Any magical healing', cures: 'Festering wounds, minor injuries.' },
  { cure: 'Medicine check (DC 15)', cures: 'Some injuries with 10 days of treatment.' },
  { cure: 'Prosthetic limb', cures: 'Replaces lost limb function (Eberron, Tasha\'s).' },
];

export function rollLingeringInjury() {
  const roll = Math.floor(Math.random() * 20) + 1;
  if (roll <= 1) return LINGERING_INJURIES[0];
  if (roll <= 2) return LINGERING_INJURIES[1];
  if (roll <= 3) return LINGERING_INJURIES[2];
  if (roll <= 4) return LINGERING_INJURIES[3];
  if (roll <= 5) return LINGERING_INJURIES[4];
  if (roll <= 7) return LINGERING_INJURIES[5];
  if (roll <= 10) return LINGERING_INJURIES[6];
  if (roll <= 13) return LINGERING_INJURIES[7];
  return LINGERING_INJURIES[8];
}

export function getInjuryCure(injuryName) {
  const injury = LINGERING_INJURIES.find(i => i.injury.toLowerCase().includes((injuryName || '').toLowerCase()));
  return injury || null;
}

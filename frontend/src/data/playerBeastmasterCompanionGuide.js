/**
 * playerBeastmasterCompanionGuide.js
 * Player Mode: Beast Master Ranger companion optimization and tactics
 * Pure JS — no React dependencies.
 */

export const COMPANION_RULES = {
  size: 'Medium or smaller. CR 1/4 or lower.',
  hp: 'Companion HP = max of its normal HP or 4x your Ranger level.',
  commands: 'Use your action to command Attack, Dash, Disengage, Dodge, or Help.',
  proficiency: 'Add your proficiency bonus to AC, attacks, damage, saves, and skills.',
  savingThrows: 'Proficient in all saves it wasn\'t already proficient in.',
  death: 'Can be revived with 8 hours + 25 gp of herbs. Or find a new one (8 hours).',
  primalCompanion: 'Tasha\'s: Beast of Land/Sea/Sky. Scales properly. Use bonus action to command.',
};

export const BEST_COMPANIONS_PHB = [
  { beast: 'Wolf', why: 'Pack Tactics (advantage when ally adjacent). Prone on hit (DC 11).', rating: 'S' },
  { beast: 'Panther', why: 'Pounce: charge + prone + bonus bite. 40ft speed + climb 20ft.', rating: 'S' },
  { beast: 'Giant Poisonous Snake', why: '10ft reach. 3d6 poison on failed DC 11 CON save.', rating: 'A+' },
  { beast: 'Flying Snake', why: 'Flyby (no OA). 60ft fly speed. 3d4 poison damage.', rating: 'A+' },
  { beast: 'Hawk (Blood Hawk)', why: 'Flyby + Pack Tactics. Scout and Help action.', rating: 'A' },
  { beast: 'Giant Crab', why: 'Grapple on hit (two claws). Blindsight 30ft. Amphibious.', rating: 'A' },
  { beast: 'Mastiff', why: 'Prone on hit. 40ft speed. Can be ridden by Small races.', rating: 'B+' },
  { beast: 'Giant Frog', why: 'Swallow Small creatures. Restrained + damage each turn.', rating: 'B+' },
];

export const PRIMAL_COMPANIONS_TASHAS = [
  { type: 'Beast of the Land', hp: '5 + 5x Ranger level', attack: '1d8 + 2 + PB', speed: '40ft climb 40ft', special: 'Charge: prone on hit if moved 20ft (STR save).', rating: 'S' },
  { type: 'Beast of the Sky', hp: '4 + 4x Ranger level', attack: '1d6 + 2 + PB', speed: '60ft fly', special: 'Flyby. Best scout and mobile striker.', rating: 'A+' },
  { type: 'Beast of the Sea', hp: '5 + 5x Ranger level', attack: '1d6 + 2 + PB', speed: '5ft swim 60ft', special: 'Binding Strike: grapple on hit. Best underwater.', rating: 'A (niche)' },
];

export const COMPANION_TACTICS = [
  'Wolf/Land Beast: charge → prone → party gets advantage on prone target.',
  'Flyby companions: attack then retreat. Never provoke OA.',
  'Use Help action: give advantage to an ally\'s attack.',
  'Position companion to flank (if using flanking rules).',
  'Companion can grapple: Giant Crab, Sea Beast. Lock down enemies.',
  'Small PCs: ride Medium companions (Wolf, Panther, Mastiff).',
  'Scout with flying companions. Hawk has keen sight.',
  'Companion can take Dodge: tank hits while party deals damage.',
];

export const COMPANION_TIPS = [
  'Tasha\'s Primal Companions >> PHB Beast Master. Always use Tasha\'s if allowed.',
  'PHB: Wolf is best all-rounder. Pack Tactics + prone.',
  'Tasha\'s: Beast of Land is best. Charge + prone + highest HP.',
  'Bonus action command (Tasha\'s) frees your action for attacks/spells.',
  'PHB: Action to command = you lose your own attacks. Major drawback.',
  'Companion scales with Ranger level. Gets your proficiency bonus.',
  'Revive dead companion: 8 hours + 25 gp herbs.',
  'At L11 (PHB): companion attacks twice when you command Attack.',
  'Healing Word on companion: bonus action, keeps it fighting.',
  'Protect companion from AoE. Position behind cover.',
];

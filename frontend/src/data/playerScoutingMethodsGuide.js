/**
 * playerScoutingMethodsGuide.js
 * Player Mode: Scouting — familiar, wildshape, spells, and stealth approaches
 * Pure JS — no React dependencies.
 */

export const SCOUTING_METHODS = [
  { method: 'Find Familiar', level: 1, class: 'Wizard (ritual)', range: '100ft telepathy', rating: 'S+', note: 'Best scouting tool. Owl: fly 60ft, flyby. See through its senses.' },
  { method: 'Wild Shape (Druid)', level: 2, class: 'Druid', range: 'Your movement', rating: 'S+', note: 'Cat, spider, rat. Tiny and inconspicuous. Full senses.' },
  { method: 'Arcane Eye', level: 4, class: 'Wizard', range: '30ft from you, moves 30ft/round', rating: 'S', note: 'Invisible floating eye. 1-hour concentration. Through 1-inch gaps.' },
  { method: 'Clairvoyance', level: 3, class: 'Bard, Cleric, Sorcerer, Wizard', range: '1 mile', rating: 'A+', note: 'See or hear at a familiar point within 1 mile. 10-minute concentration.' },
  { method: 'Stealth (Rogue/Ranger)', level: 'Any', class: 'Rogue, Ranger, any stealthy', range: 'Movement', rating: 'S', note: 'Physical scouting. Pass without Trace (+10) helps.' },
  { method: 'Invisible Scout', level: 2, class: 'Any with Invisibility', range: 'Movement', rating: 'S', note: 'Invisible scouting. Detected by special senses only.' },
  { method: 'Gaseous Form', level: 3, class: 'Sorcerer, Warlock, Wizard', range: 'Movement (fly 10ft)', rating: 'A', note: 'Squeeze through any gap. Very slow but undetectable.' },
  { method: 'Ghostly Gaze (Warlock)', level: 7, class: 'Warlock (invocation)', range: '30ft through walls', rating: 'A+', note: 'See through solid objects for 30ft. 1/SR.' },
  { method: 'Commune/Divination', level: 5, class: 'Cleric', range: 'Any (ask deity)', rating: 'A', note: 'Ask yes/no questions (Commune) or general guidance (Divination).' },
  { method: 'Sending Stones/Sending', level: 3, class: 'Bard, Cleric, Wizard', range: 'Any plane', rating: 'A', note: '25-word message. Good for scout + party communication.' },
];

export const BEST_FAMILIAR_FORMS = [
  { form: 'Owl', rating: 'S+', why: 'Flyby (no OAs). 120ft darkvision. Advantage on Perception (sight/hearing). Best combat scout.' },
  { form: 'Cat', rating: 'S', why: 'Tiny. 30ft climb. No one suspects a cat. Best urban scout.' },
  { form: 'Spider', rating: 'S', why: 'Tiny. Wall climbing. Web sense. Best dungeon infiltration.' },
  { form: 'Bat', rating: 'A+', why: 'Blindsight 60ft. Fly 30ft. Works in total darkness.' },
  { form: 'Hawk', rating: 'A+', why: 'Fly 60ft. Advantage on Perception (sight). Best outdoor scout.' },
  { form: 'Octopus', rating: 'A', why: 'Swim. Squeeze through 1-inch gaps. Best underwater scout.' },
  { form: 'Rat', rating: 'A', why: 'Tiny. 30ft darkvision. Fits through small holes.' },
];

export const SCOUTING_TIPS = [
  'Find Familiar: see through its eyes. Owl for combat, cat for stealth.',
  'Wild Shape into a spider or cat. Scout entire dungeons undetected.',
  'Arcane Eye: invisible, moves 30ft/round, fits through 1-inch gaps. Best spell scout.',
  'Pass without Trace: +10 Stealth for physical scouting. Near-invisible.',
  'Communicate findings: Sending, Message, or agreed signals.',
  'Invisible scouting: still makes noise. Stealth check may still be needed.',
  'Familiar can deliver touch spells. Scout → Shocking Grasp on enemy.',
  'Clairvoyance: no physical presence. Can\'t be detected. 1 mile range.',
  'Ghostly Gaze: see through walls for 30ft. Warlock exclusive.',
  'Always scout before entering new rooms. Information prevents TPKs.',
];

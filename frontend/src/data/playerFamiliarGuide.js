/**
 * playerFamiliarGuide.js
 * Player Mode: Find Familiar spell options and familiar tactics
 * Pure JS — no React dependencies.
 */

export const FAMILIAR_FORMS = [
  { name: 'Bat', ac: 12, hp: 1, speed: '5ft walk, 30ft fly', senses: 'Blindsight 60ft', bestFor: 'Scouting in dark areas' },
  { name: 'Cat', ac: 12, hp: 2, speed: '40ft walk, 30ft climb', senses: 'Darkvision 60ft', bestFor: 'Urban scouting, stealth (+4)' },
  { name: 'Crab', ac: 11, hp: 2, speed: '20ft walk, 20ft swim', senses: 'Blindsight 30ft', bestFor: 'Underwater scouting' },
  { name: 'Frog', ac: 11, hp: 1, speed: '20ft walk, 20ft swim', senses: 'Darkvision 30ft', bestFor: 'Amphibious scouting' },
  { name: 'Hawk', ac: 13, hp: 1, speed: '10ft walk, 60ft fly', senses: 'Perception +4', bestFor: 'Aerial scouting, best Perception' },
  { name: 'Lizard', ac: 10, hp: 2, speed: '20ft walk, 20ft climb', senses: 'Darkvision 30ft', bestFor: 'Climbing/wall scouting' },
  { name: 'Octopus', ac: 12, hp: 3, speed: '5ft walk, 30ft swim', senses: 'Darkvision 30ft', bestFor: 'Aquatic missions, ink cloud' },
  { name: 'Owl', ac: 11, hp: 1, speed: '5ft walk, 60ft fly', senses: 'Darkvision 120ft', bestFor: 'Best overall — Flyby, 120ft darkvision' },
  { name: 'Poisonous Snake', ac: 13, hp: 2, speed: '30ft walk, 30ft swim', senses: 'Blindsight 10ft', bestFor: 'Amphibious with decent AC' },
  { name: 'Fish (Quipper)', ac: 13, hp: 1, speed: '40ft swim', senses: 'Darkvision 60ft', bestFor: 'Fast underwater scout' },
  { name: 'Rat', ac: 10, hp: 1, speed: '20ft walk', senses: 'Darkvision 30ft', bestFor: 'Tiny, fits in tight spaces' },
  { name: 'Raven', ac: 12, hp: 1, speed: '10ft walk, 50ft fly', senses: 'Normal', bestFor: 'Can mimic sounds, good flyer' },
  { name: 'Sea Horse', ac: 11, hp: 1, speed: '20ft swim', senses: 'Normal', bestFor: 'Limited — aquatic only' },
  { name: 'Spider', ac: 12, hp: 1, speed: '20ft walk, 20ft climb', senses: 'Darkvision 30ft', bestFor: 'Web Sense, tiny, climbs walls' },
  { name: 'Weasel', ac: 13, hp: 1, speed: '30ft walk', senses: 'Perception +3', bestFor: 'Good Perception, decent speed' },
];

export const FAMILIAR_RULES = {
  casting: 'Find Familiar: 1st level, 1 hour ritual, 10 gp of incense/herbs.',
  telepathy: 'Communicate telepathically within 100 feet.',
  senses: 'Action to see/hear through familiar\'s senses (blind and deaf to your own).',
  deliver: 'Familiar can deliver touch spells. Uses its reaction when you cast.',
  combat: 'Familiar can\'t attack but can take other actions (Help, Dodge, Dash, etc.).',
  death: 'If familiar drops to 0 HP, it disappears. Recast the spell (1 hour, 10 gp) to resummon.',
  dismiss: 'Action to dismiss to a pocket dimension. Action to resummon within 30 feet.',
  newForm: 'When you recast, you can choose a different form.',
};

export const FAMILIAR_TACTICS = [
  { tactic: 'Help Action', description: 'Familiar uses Help to give you (or an ally) advantage on the next attack. Owl is best — Flyby means no opportunity attacks.' },
  { tactic: 'Scouting', description: 'Send familiar ahead to scout. Use your action to see through its senses.' },
  { tactic: 'Touch Spell Delivery', description: 'Familiar moves to target, you cast a touch spell (Shocking Grasp, Cure Wounds), familiar delivers it.' },
  { tactic: 'Flanking', description: 'If using flanking rules, familiar provides flanking (though it can\'t attack).' },
  { tactic: 'Distraction', description: 'Familiar can trigger traps, open doors, carry small items, or create diversions.' },
  { tactic: 'Message Carrier', description: 'Send familiar (especially raven) to deliver messages to NPCs.' },
];

export const WARLOCK_FAMILIARS = [
  { name: 'Imp', special: 'Invisible at will, Devil\'s Sight 120ft, shapechanger, sting attack (3d6 poison).' },
  { name: 'Pseudodragon', special: 'Magic Resistance, 10ft blindsight, sting (poisoned + unconscious), telepathy 100ft.' },
  { name: 'Quasit', special: 'Invisible at will, shapechanger, scare (frightened), claw attack (2d4 + poison).' },
  { name: 'Sprite', special: 'Invisible, Heart Sight (detect alignment), shortbow with poison (unconscious).' },
];

export function getFamiliarInfo(name) {
  return FAMILIAR_FORMS.find(f => f.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getBestFamiliarFor(purpose) {
  const p = (purpose || '').toLowerCase();
  if (p.includes('fly') || p.includes('scout') || p.includes('help')) return getFamiliarInfo('Owl');
  if (p.includes('swim') || p.includes('water')) return getFamiliarInfo('Octopus');
  if (p.includes('dark') || p.includes('underground')) return getFamiliarInfo('Bat');
  if (p.includes('city') || p.includes('urban') || p.includes('stealth')) return getFamiliarInfo('Cat');
  if (p.includes('climb') || p.includes('wall')) return getFamiliarInfo('Spider');
  return getFamiliarInfo('Owl'); // default best
}

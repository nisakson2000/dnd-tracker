/**
 * playerPactBoons.js
 * Player Mode: Warlock Pact Boon reference
 * Pure JS — no React dependencies.
 */

export const PACT_BOONS = [
  {
    name: 'Pact of the Blade',
    level: 3,
    description: 'Create a magical melee weapon. Proficient with it. Can make a magic weapon your pact weapon.',
    combatTips: [
      'Can be any melee weapon form — change it each time you create it.',
      'Improved Pact Weapon invocation makes it +1 and allows ranged.',
      'Thirsting Blade (5th level) gives Extra Attack with pact weapon.',
      'Lifedrinker (12th level) adds CHA mod as necrotic damage.',
      'Eldritch Smite adds force damage + prone on hit.',
    ],
  },
  {
    name: 'Pact of the Chain',
    level: 3,
    description: 'Find Familiar spell with enhanced familiar options (imp, pseudodragon, quasit, sprite).',
    combatTips: [
      'Familiar can take the Attack action (unlike normal familiars).',
      'Imp: invisible at will, sting with poison, fly.',
      'Give up your attack to have familiar attack with your bonus.',
      'Gift of the Ever-Living Ones: maximize your healing dice.',
      'Investment of the Chain Master: bonus action to command, use your spell save DC.',
    ],
  },
  {
    name: 'Pact of the Tome',
    level: 3,
    description: 'Book of Shadows with 3 cantrips from any class list.',
    combatTips: [
      'Great cantrip picks: Shillelagh, Guidance, Spare the Dying.',
      'Book of Ancient Secrets invocation = ritual casting from any class.',
      'Far Scribe (Tasha\'s): cast Sending to contacts written in your book.',
      'Combine with Aspect of the Moon for no-sleep watches.',
    ],
  },
  {
    name: 'Pact of the Talisman',
    level: 3,
    description: 'Talisman that adds 1d4 to failed ability checks (uses = proficiency bonus).',
    combatTips: [
      'Works on ANY ability check, not just yours if given to ally.',
      'Protection of the Talisman: add 1d4 to saving throws too.',
      'Rebuke of the Talisman: push attacker 10ft when wearer is hit.',
      'Bond of the Talisman: teleport to talisman wearer.',
    ],
  },
];

export function getPactBoon(name) {
  return PACT_BOONS.find(p => p.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getPactShortName(name) {
  const boon = getPactBoon(name);
  if (!boon) return name;
  return boon.name.replace('Pact of the ', '');
}

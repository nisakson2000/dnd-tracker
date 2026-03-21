/**
 * playerInitiativeTips.js
 * Player Mode: Initiative optimization and first-turn planning
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_BONUSES = [
  { source: 'DEX modifier', type: 'base', value: 'DEX mod', note: 'Base initiative modifier. Higher DEX = faster.' },
  { source: 'Alert feat', type: 'feat', value: '+5', note: 'Can\'t be surprised. +5 initiative. Best initiative feat.' },
  { source: 'Swashbuckler (Rogue 3)', type: 'class', value: '+CHA mod', note: 'Add Charisma modifier to initiative. Stacks with DEX.' },
  { source: 'Dread Ambusher (Ranger 3)', type: 'class', value: '+WIS mod', note: 'Add Wisdom modifier to initiative.' },
  { source: 'War Wizard (Wizard 2)', type: 'class', value: '+INT mod', note: 'Add Intelligence modifier to initiative.' },
  { source: 'Chronurgy Wizard (Wizard 2)', type: 'class', value: '+INT mod', note: 'Same as War Wizard.' },
  { source: 'Gift of Alacrity (1st)', type: 'spell', value: '+1d8', note: 'Dunamancy spell (Wildemount). Lasts 8 hours, no concentration.' },
  { source: 'Weapon of Warning', type: 'item', value: 'Advantage', note: 'Advantage on initiative. Can\'t be surprised.' },
  { source: 'Sentinel Shield', type: 'item', value: 'Advantage', note: 'Advantage on initiative and Perception checks.' },
  { source: 'Guidance (cantrip)', type: 'spell', value: '+1d4', note: 'If cast before combat starts. DM may or may not allow.' },
  { source: 'Jack of All Trades (Bard 2)', type: 'class', value: '+half prof', note: 'Initiative is a DEX check — JoAT applies.' },
  { source: 'Remarkable Athlete (Fighter 7)', type: 'class', value: '+half prof', note: 'Same as JoAT but for Champions.' },
];

export const GOING_FIRST_TIPS = [
  'Control casters: going first lets you drop Hypnotic Pattern or Web before enemies scatter.',
  'Assassin Rogues NEED to go first — advantage + auto-crit on surprised creatures.',
  'Dread Ambushers get an extra attack + 1d8 damage on their first turn. Initiative is critical.',
  'If you go first, consider using your action to position and set up for the party.',
  'Going last isn\'t always bad — you see what enemies do and can react accordingly.',
];

export const GOING_LAST_TIPS = [
  'You see where enemies position — choose your targets wisely.',
  'You can coordinate with allies who already acted.',
  'Ready action if your turn comes before the optimal moment.',
  'Going last means enemies already used their reactions — less risk of Counterspell.',
];

export const SURPRISE_ROUND_TIPS = [
  'Surprised creatures can\'t act on their first turn and can\'t use reactions until that turn ends.',
  'Even ONE party member who fails Stealth prevents surprise for all who noticed them.',
  'Alert feat makes you immune to surprise. Always worth it for scouts.',
  'After the surprise round, combat proceeds normally — initiative order stands.',
];

export function calculateInitiative(dexMod, bonuses = []) {
  const total = dexMod + bonuses.reduce((sum, b) => sum + (typeof b === 'number' ? b : 0), 0);
  return { modifier: total, hasAdvantage: bonuses.includes('advantage') };
}

export function getInitiativeBonusesForClass(className) {
  return INITIATIVE_BONUSES.filter(b =>
    b.type === 'base' || b.type === 'feat' || b.type === 'item' ||
    (b.source.toLowerCase().includes((className || '').toLowerCase()))
  );
}

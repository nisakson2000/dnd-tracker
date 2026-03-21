/**
 * playerInitiativeModifiers.js
 * Player Mode: Initiative bonuses and special rules
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_RULES = {
  base: 'Roll d20 + DEX modifier.',
  ties: 'DM decides (usually players choose among themselves, or DEX score breaks ties).',
};

export const INITIATIVE_BONUSES = [
  { source: 'Alert feat', bonus: '+5', type: 'feat' },
  { source: 'Dread Ambusher (Ranger: Gloom Stalker)', bonus: '+WIS modifier', type: 'class' },
  { source: 'Swashbuckler (Rogue)', bonus: '+CHA modifier', type: 'class' },
  { source: 'War Wizard (Wizard)', bonus: '+INT modifier', type: 'class' },
  { source: 'Remarkable Athlete (Champion Fighter)', bonus: '+half proficiency (rounded up)', type: 'class' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half proficiency (rounded down)', type: 'class' },
  { source: 'Gift of Alacrity (spell)', bonus: '+1d8', type: 'spell' },
  { source: 'Weapon of Warning', bonus: 'Advantage on initiative', type: 'item' },
  { source: 'Sentinel Shield', bonus: 'Advantage on initiative', type: 'item' },
  { source: 'Feral Instinct (Barbarian 7)', bonus: 'Advantage on initiative', type: 'class' },
];

export function calculateInitiativeModifier(dexScore, bonusSources = []) {
  let mod = Math.floor((dexScore - 10) / 2);
  let hasAdvantage = false;

  for (const source of bonusSources) {
    const info = INITIATIVE_BONUSES.find(b => b.source.toLowerCase().includes(source.toLowerCase()));
    if (info) {
      if (info.bonus === 'Advantage on initiative') {
        hasAdvantage = true;
      } else if (info.bonus.startsWith('+')) {
        const num = parseInt(info.bonus.replace('+', ''));
        if (!isNaN(num)) mod += num;
      }
    }
  }

  return { modifier: mod, hasAdvantage };
}

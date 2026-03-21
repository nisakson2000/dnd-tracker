/**
 * playerSupportBuffBuildGuide.js
 * Player Mode: Support/buffer builds — best classes and spells for enabling allies
 * Pure JS — no React dependencies.
 */

export const SUPPORT_SUBCLASSES = [
  { subclass: 'Peace Cleric', rating: 'S+ (often banned)', keyFeature: 'Emboldening Bond: +1d4 to attacks/saves/checks for PB creatures permanently (no conc).', note: 'Stacks with Bless. Party gets +2d4 to everything.' },
  { subclass: 'Twilight Cleric', rating: 'S+ (often banned)', keyFeature: 'Twilight Sanctuary: 1d6+level temp HP to all allies in 30ft every round.', note: 'Walking damage sponge. Party takes dramatically less damage.' },
  { subclass: 'Eloquence Bard', rating: 'S', keyFeature: 'Unfailing Inspiration: unused BI not spent. Unsettling Words: debuff saves.', note: 'Bardic Inspiration never wasted. Debuff + save-or-suck combo.' },
  { subclass: 'Order Cleric', rating: 'A+', keyFeature: 'Voice of Authority: cast spell on ally → they get reaction attack.', note: 'Healing Word on Rogue → free Sneak Attack. Incredible action economy.' },
  { subclass: 'Glamour Bard', rating: 'A+', keyFeature: 'Mantle of Inspiration: temp HP + free movement (no OA) for CHA mod allies.', note: 'Reposition entire party + temp HP as BA. Incredible opener.' },
  { subclass: 'Divine Soul Sorcerer', rating: 'S', keyFeature: 'Twin any single-target buff. Cleric + Sorcerer list.', note: 'Twin Haste, Twin Greater Invisibility, Twin Polymorph. Best buff caster.' },
  { subclass: 'Shepherd Druid', rating: 'A+', keyFeature: 'Spirit Totem: Bear (temp HP to summons), Hawk (advantage on attacks for allies), Unicorn (AoE heal).', note: 'Best summoner support. Hawk Totem = party-wide advantage.' },
  { subclass: 'Valor/Swords Bard', rating: 'A', keyFeature: 'Bardic Inspiration to damage/AC. Martial capability. Magical Secrets for any buff spell.', note: 'Fight + support. Less dedicated than pure support builds.' },
];

export const BEST_BUFF_SPELLS = [
  { spell: 'Bless', level: 1, rating: 'S+', note: '+1d4 to attacks AND saves for 3 creatures. Best L1 concentration. Always worth casting.' },
  { spell: 'Haste', level: 3, rating: 'S+', note: '+2 AC, double speed, extra action. Best martial buff. Twin Haste = 2 allies buffed.' },
  { spell: 'Aid', level: 2, rating: 'S', note: '+5 max HP to 3 creatures for 8 hours. No concentration. Scales with slot level.' },
  { spell: 'Death Ward', level: 4, rating: 'S', note: 'Survive lethal hit once. 8 hours. No concentration. Pre-fight mandatory.' },
  { spell: 'Greater Invisibility', level: 4, rating: 'S', note: 'Invisible while attacking. Advantage on all attacks, disadvantage on attacks against.' },
  { spell: 'Heroes\' Feast', level: 6, rating: 'S', note: 'Immune frightened/poison. Advantage WIS saves. +2d10 max HP. 24 hours.' },
  { spell: 'Holy Weapon', level: 5, rating: 'A+', note: '+2d8 radiant damage per hit. BA: dismiss for 4d8 AoE radiant. Concentration.' },
  { spell: 'Polymorph', level: 4, rating: 'S', note: 'Turn ally into T-Rex (136 HP). Offensive buff and massive HP buffer.' },
  { spell: 'Shield of Faith', level: 1, rating: 'A', note: '+2 AC. Concentration but only L1 slot. Good early game.' },
  { spell: 'Longstrider', level: 1, rating: 'A', note: '+10ft speed. No concentration. 1 hour. Cast on whole party before combat.' },
  { spell: 'Freedom of Movement', level: 4, rating: 'A+', note: 'Can\'t be paralyzed/restrained. Ignore difficult terrain. 1 hour.' },
  { spell: 'Foresight', level: 9, rating: 'S+', note: 'Advantage on everything + can\'t be surprised. 8 hours. No concentration. Best L9 buff.' },
];

export const SUPPORT_TIPS = [
  'Bless on 3 attackers is better than you attacking. +1d4 × 3 allies × multiple rounds > your action.',
  'Haste on the Fighter/Paladin/Barbarian. Extra action = extra attack = massive DPR boost.',
  'Twin Haste: two allies get Haste. Best use of Twinned Spell metamagic.',
  'Aid + Death Ward before boss fights. Prevention > healing.',
  'Don\'t just heal. Buffer/control is usually more impactful than healing damage.',
  'Bardic Inspiration on the ally about to make the most important roll (attack or save).',
  'Foresight (L9): advantage on EVERYTHING for 8 hours. No concentration. Cast before dungeon.',
  'Heroes\' Feast before the final boss. Immune to fear, poison, +HP. Worth every gold piece.',
];

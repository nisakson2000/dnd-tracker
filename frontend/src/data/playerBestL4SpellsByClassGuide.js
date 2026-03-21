/**
 * playerBestL4SpellsByClassGuide.js
 * Player Mode: Best level 4 spells by class — mid-tier power
 * Pure JS — no React dependencies.
 */

export const BARD_L4 = [
  { spell: 'Polymorph', rating: 'S+', why: 'Turn ally into Giant Ape (157 HP). Or enemy into snail. WIS save.' },
  { spell: 'Greater Invisibility', rating: 'S', why: 'Invisible even while attacking/casting. Concentration. Advantage + disadvantage.' },
  { spell: 'Dimension Door', rating: 'A+', why: '500ft teleport. Bring one ally. No line of sight needed. Escape anything.' },
  { spell: 'Freedom of Movement', rating: 'A', why: 'Ignore difficult terrain, restrained, paralyzed (from spells). No concentration.' },
  { spell: 'Charm Monster', rating: 'A', why: 'Charm any creature (not just humanoids). WIS save.' },
];

export const CLERIC_L4 = [
  { spell: 'Banishment', rating: 'S+', why: 'Remove one creature from combat. CHA save. If extraplanar = permanent.' },
  { spell: 'Death Ward', rating: 'S', why: 'Drop to 1 HP instead of 0. Once. No concentration. 8 hours. Pre-cast.' },
  { spell: 'Guardian of Faith', rating: 'A+', why: 'Spectral guardian. 20 damage per creature entering area. No concentration.' },
  { spell: 'Freedom of Movement', rating: 'A', why: 'No concentration. Immune to restrained/paralyzed from spells.' },
  { spell: 'Stone Shape', rating: 'A', why: 'Reshape 5ft of stone. Create doors, block passages, escape rooms.' },
  { spell: 'Divination', rating: 'A', why: 'Ritual. Ask DM about a plan. Get cryptic guidance.' },
];

export const DRUID_L4 = [
  { spell: 'Polymorph', rating: 'S+', why: 'Giant Ape = 157 HP. Best defensive and offensive L4 spell.' },
  { spell: 'Conjure Woodland Beings', rating: 'S (DM-dependent)', why: 'Pixies can cast Polymorph, Fly, etc. If DM lets you choose.' },
  { spell: 'Guardian of Nature', rating: 'A+', why: 'Great Beast: advantage on STR attacks, +1d6 force, +10ft speed.' },
  { spell: 'Ice Storm', rating: 'A', why: '2d8 bludgeoning + 4d6 cold + difficult terrain. Good AoE.' },
  { spell: 'Wall of Fire', rating: 'S', why: '5d8 fire when entering/starting near. Area denial. Concentration.' },
  { spell: 'Freedom of Movement', rating: 'A', why: 'No concentration. Grapple/restrain immunity from spells.' },
];

export const PALADIN_L4 = [
  { spell: 'Banishment', rating: 'S+', why: 'Remove biggest threat. CHA save. Extraplanar = permanent.' },
  { spell: 'Death Ward', rating: 'S', why: 'Pre-cast on self or ally. 8 hours. No concentration. Life insurance.' },
  { spell: 'Find Greater Steed', rating: 'S+', why: 'Pegasus, griffon, or other mount. Shares targeting spells. Flight.' },
  { spell: 'Staggering Smite', rating: 'B+', why: '4d6 psychic + stunned (WIS save). Concentration but devastating on crit.' },
  { spell: 'Aura of Life', rating: 'B+', why: '30ft aura: resistance to necrotic, 1 HP to unconscious allies at start of their turn.' },
];

export const RANGER_L4 = [
  { spell: 'Guardian of Nature', rating: 'A+', why: 'Great Beast mode: advantage on STR attacks, +1d6 force. Great Tree: CON save advantage.' },
  { spell: 'Freedom of Movement', rating: 'A', why: 'No concentration. Anti-grapple, anti-restrain.' },
  { spell: 'Conjure Woodland Beings', rating: 'S (DM-dependent)', why: 'Pixies = insane value. DM chooses what appears though.' },
  { spell: 'Stoneskin', rating: 'B', why: 'Resistance to BPS. Concentration + 100gp. Expensive but defensive.' },
  { spell: 'Summon Elemental', rating: 'A', why: 'Tasha\'s summon. Reliable and scales.' },
];

export const SORCERER_L4 = [
  { spell: 'Polymorph', rating: 'S+', why: 'Giant Ape. Turn enemy into turtle. Best L4 spell.' },
  { spell: 'Banishment', rating: 'S+', why: 'Remove threat. CHA save. Upcasts to multiple targets.' },
  { spell: 'Greater Invisibility', rating: 'S', why: 'Attack while invisible. Advantage on attacks, disadvantage on enemy attacks.' },
  { spell: 'Dimension Door', rating: 'A+', why: '500ft teleport + 1 ally. Escape or reposition.' },
  { spell: 'Wall of Fire', rating: 'S', why: 'Area denial. 5d8 fire. Controls the battlefield.' },
  { spell: 'Vitriolic Sphere', rating: 'A', why: '10d4 acid + 5d4 next turn. DEX save. Good AoE damage.' },
  { spell: 'Storm Sphere', rating: 'A', why: 'Area damage + BA lightning bolts each turn. Good sustained.' },
];

export const WARLOCK_L4 = [
  { spell: 'Banishment', rating: 'S+', why: 'Remove extraplanar creatures permanently. CHA save.' },
  { spell: 'Dimension Door', rating: 'A+', why: '500ft teleport. Bring one creature. Escape tool.' },
  { spell: 'Shadow of Moil', rating: 'S', why: 'Heavily obscured in darkness. 2d8 necrotic to melee attackers. Warlock exclusive.' },
  { spell: 'Summon Greater Demon', rating: 'A', why: 'Powerful demon ally. Risk of losing control. High reward.' },
  { spell: 'Sickening Radiance', rating: 'A+', why: '4d10 radiant + exhaustion on fail. CON save. Exhaustion stacks = death.' },
];

export const WIZARD_L4 = [
  { spell: 'Polymorph', rating: 'S+', why: 'Best L4. Giant Ape ally or snail enemy.' },
  { spell: 'Banishment', rating: 'S+', why: 'Remove threats. CHA save. Scales with upcast.' },
  { spell: 'Greater Invisibility', rating: 'S', why: 'Invisible while attacking. Concentration.' },
  { spell: 'Dimension Door', rating: 'A+', why: '500ft teleport + ally. Escape.' },
  { spell: 'Wall of Fire', rating: 'S', why: 'Area denial. 5d8 fire. Battlefield control.' },
  { spell: 'Arcane Eye', rating: 'A+', why: 'Invisible scouting eye. 30ft darkvision. 1 hour. See through walls.' },
  { spell: 'Fabricate', rating: 'A', why: 'Create any object from raw materials. Craft anything instantly.' },
  { spell: 'Summon Construct/Elemental', rating: 'A+', why: 'Tasha\'s summons. Reliable, scales with slot level.' },
];

export const L4_SPELL_TIPS = [
  'Polymorph: best L4 spell. Giant Ape for 157 HP shield. Or remove an enemy.',
  'Banishment: remove the biggest threat. CHA save. Permanent if extraplanar.',
  'Greater Invisibility: attack while invisible. Best self-buff for damage.',
  'Wall of Fire: split the battlefield. 5d8 fire on entry/start.',
  'Death Ward: pre-cast before combat. 8 hours, no concentration. Life insurance.',
  'Find Greater Steed (Paladin): flying mount that shares your buff spells.',
  'Dimension Door: 500ft teleport. No line of sight. Bring one ally.',
  'Shadow of Moil (Warlock): darkness + damage to attackers. Amazing.',
  'L4 slots: use for Polymorph and Banishment primarily.',
  'Giant Ape via Polymorph: 157 HP, +9 to hit, 3d10+6 damage. Insane.',
];

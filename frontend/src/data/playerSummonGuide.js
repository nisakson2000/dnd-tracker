/**
 * playerSummonGuide.js
 * Player Mode: Summoning spells strategy and management
 * Pure JS — no React dependencies.
 */

export const SUMMON_SPELLS = [
  { spell: 'Find Familiar', level: 1, concentration: false, duration: 'Until dismissed/killed', creatures: '1 familiar (fey/celestial/fiend spirit)', bestForm: 'Owl (Flyby + Help action) or Hawk (Perception)', tip: 'Use Help action for advantage. Deliver touch spells. Scout with shared senses. Best 1st-level spell in the game.' },
  { spell: 'Conjure Animals', level: 3, concentration: true, duration: '1 hour', creatures: '8 CR 1/4, 4 CR 1/2, 2 CR 1, or 1 CR 2', bestForm: '8 wolves (Pack Tactics + prone chance) or 8 velociraptors', tip: 'DM chooses the creatures (RAW). Discuss with DM beforehand. 8 creatures = 8 attacks = broken action economy.' },
  { spell: 'Summon Beast', level: 2, concentration: true, duration: '1 hour', creatures: '1 bestial spirit (air/land/water)', bestForm: 'Land (Pack Tactics) or Air (Flyby)', tip: 'Tasha\'s version. YOU choose the type. Scales well with upcasting. Much simpler than Conjure Animals.' },
  { spell: 'Summon Fey', level: 3, concentration: true, duration: '1 hour', creatures: '1 fey spirit (Fuming/Mirthful/Tricksy)', bestForm: 'Tricksy (advantage on attacks, allies too)', tip: 'Scales well. Teleport as bonus action. Good consistent damage.' },
  { spell: 'Summon Undead', level: 3, concentration: true, duration: '1 hour', creatures: '1 undead spirit (Ghostly/Putrid/Skeletal)', bestForm: 'Putrid (poison aura) or Ghostly (phasing through walls)', tip: 'Frightening Touch is clutch. Ghostly form can scout through walls.' },
  { spell: 'Animate Dead', level: 3, concentration: false, duration: '24 hours (recast to maintain)', creatures: '1 skeleton or zombie per casting', bestForm: 'Skeletons with shortbows', tip: 'NOT concentration! Build an army. Each upcast = +2 undead. Recast daily to maintain.' },
  { spell: 'Conjure Elemental', level: 5, concentration: true, duration: '1 hour', creatures: '1 elemental (CR 5 or lower)', bestForm: 'Air Elemental (fly, whirlwind) or Earth Elemental (tunnel, tank)', tip: 'WARNING: If concentration breaks, elemental goes hostile and attacks nearest creature (possibly you).' },
  { spell: 'Summon Draconic Spirit', level: 5, concentration: true, duration: '1 hour', creatures: '1 draconic spirit', bestForm: 'Choose damage type to match enemy vulnerability', tip: 'Breath weapon AoE + multiattack. Strong sustained damage.' },
];

export const SUMMON_ETIQUETTE = [
  'Pre-roll your summon\'s attacks and damage to speed up combat.',
  'Know your summon\'s stat block BEFORE you cast the spell.',
  'Keep summon turns to 15 seconds or less. Other players are waiting.',
  'Group identical summons: roll once and apply to all (DM permitting).',
  'Don\'t summon 8 creatures if it will slow the game to a crawl. Consider fewer, stronger summons.',
  'Have stat blocks printed or on a phone/tablet for quick reference.',
  'Let the DM narrate the summons\' appearance. You describe the summoning.',
];

export const SUMMON_TACTICS = [
  { tactic: 'Action Economy Flood', detail: 'Summon multiple creatures. Each gets an attack. 8 wolves = 8 attacks per round. Overwhelms single enemies.' },
  { tactic: 'Flank Bot', detail: 'Position summons to provide flanking advantage (if using flanking rules) for your martials.' },
  { tactic: 'Concentration Guard', detail: 'Summons can take hits meant for you. Position them between you and enemies.' },
  { tactic: 'Scout', detail: 'Familiars and spirits can scout ahead. Shared senses for familiars. Send them into danger, not yourself.' },
  { tactic: 'Grapple Lock', detail: 'Some summons can grapple. Multiple grapplers can lock down a boss while the party focuses fire.' },
];

export function getSummonInfo(spellName) {
  return SUMMON_SPELLS.find(s =>
    s.spell.toLowerCase().includes((spellName || '').toLowerCase())
  ) || null;
}

export function getBestSummonForLevel(spellLevel) {
  return SUMMON_SPELLS.filter(s => s.level <= spellLevel).sort((a, b) => b.level - a.level);
}

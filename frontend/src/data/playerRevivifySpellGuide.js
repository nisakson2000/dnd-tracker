/**
 * playerRevivifySpellGuide.js
 * Player Mode: Revivify and resurrection spells compared
 * Pure JS — no React dependencies.
 */

export const REVIVIFY_BASICS = {
  spell: 'Revivify',
  level: 3,
  school: 'Necromancy',
  castTime: '1 action',
  range: 'Touch',
  duration: 'Instantaneous',
  components: 'V, S, M (diamonds worth 300gp, consumed)',
  classes: ['Cleric', 'Paladin', 'Druid (Wildfire)', 'Artificer', 'Celestial Warlock', 'Divine Soul Sorcerer'],
  effect: 'Touch a creature dead no more than 1 minute. It returns with 1 HP.',
  note: 'THE emergency resurrection. Buy diamonds. Always have diamonds. 300gp diamonds save campaigns.',
};

export const RESURRECTION_SPELLS_COMPARED = [
  { spell: 'Revivify', level: 3, timeLimit: '1 minute', cost: '300gp diamonds', condition: 'Returns with 1 HP. No missing body parts restored.', rating: 'S', note: 'Best emergency rez. Must act fast.' },
  { spell: 'Raise Dead', level: 5, timeLimit: '10 days', cost: '500gp diamond', condition: '-4 to attacks/saves/checks for 4 long rests. Body must be intact.', rating: 'A', note: 'More time but harsh penalty and body required.' },
  { spell: 'Reincarnate', level: 5, timeLimit: '10 days', cost: '1000gp oils', condition: 'New random body/race. Only need a piece of the body.', rating: 'A', note: 'Different race = RP gold. Druid exclusive.' },
  { spell: 'Resurrection', level: 7, timeLimit: '100 years', cost: '1000gp diamond', condition: 'Restores missing body parts. -4 penalty for 4 LRs.', rating: 'A+', note: 'Handles old deaths and damaged bodies.' },
  { spell: 'True Resurrection', level: 9, timeLimit: '200 years', cost: '25,000gp diamonds', condition: 'Full restoration. New body if needed. No penalty.', rating: 'S', note: 'Perfect resurrection. Incredibly expensive.' },
  { spell: 'Wish', level: 9, timeLimit: 'Any', cost: 'None (but risk)', condition: 'Duplicate Resurrection (no cost). Or custom wish (risky).', rating: 'S+', note: 'Can duplicate any rez spell for free.' },
];

export const REVIVIFY_TIPS = [
  'BUY DIAMONDS. Every town, every shop, ask for 300gp diamonds. Stockpile them.',
  'Keep diamonds on multiple party members — if the Cleric dies, someone else might have Revivify access.',
  'Artificer Homunculus or familiar can carry diamonds as backup.',
  'Gentle Repose extends the 1-minute timer indefinitely (pauses the death clock for 10 days per cast).',
  'Revivify doesn\'t restore missing body parts — a beheaded creature needs Resurrection or higher.',
  'Some DMs use resurrection challenges (Mercer rules). Ask your DM beforehand.',
  'Death Ward (L4) prevents going to 0 HP once — can prevent needing Revivify entirely.',
];

export const GENTLE_REPOSE_COMBO = {
  spell: 'Gentle Repose',
  level: 2,
  ritual: true,
  effect: 'Pauses decay and the death timer. Extends Revivify window to 10 days per cast.',
  combo: 'Ally dies → Gentle Repose (ritual, no slot) → take time to find diamonds or a caster → Revivify within 10 days.',
  rating: 'S',
  note: 'ESSENTIAL combo. Turns Revivify from "must use in 1 minute" to "use whenever convenient."',
};

export const DEATH_PREVENTION = [
  { method: 'Death Ward (L4)', detail: 'When ally drops to 0 HP, they go to 1 HP instead. Once per cast.', rating: 'S' },
  { method: 'Healing Word', detail: 'Pick up downed ally before they fail death saves.', rating: 'S' },
  { method: 'Spare the Dying', detail: 'Stabilize at 0 HP. Cantrip. No slot cost.', rating: 'B' },
  { method: 'Periapt of Wound Closure', detail: 'Attunement item: auto-stabilize. Doubles healing dice.', rating: 'A' },
  { method: 'Redemption Paladin Aura', detail: 'Take damage instead of ally. Redirect lethal hits.', rating: 'A' },
  { method: 'Twilight Sanctuary', detail: 'Temp HP every round prevents dropping to 0 in the first place.', rating: 'S' },
];

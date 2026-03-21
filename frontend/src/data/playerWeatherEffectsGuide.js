/**
 * playerWeatherEffectsGuide.js
 * Player Mode: Weather effects on combat and exploration
 * Pure JS — no React dependencies.
 */

export const WEATHER_EFFECTS = [
  {
    weather: 'Heavy Rain',
    visibility: 'Lightly obscured. Disadvantage on Perception (sight).',
    combat: 'Extinguishes open flames. Disadvantage on Perception checks relying on sight.',
    movement: 'No movement penalty (unless flooding).',
    spells: 'Fire spells work (magic). Natural fires extinguished.',
    note: 'Lightly obscured = disadvantage on Perception but NOT attacks (you can still see targets).',
  },
  {
    weather: 'Heavy Snow/Blizzard',
    visibility: 'Heavily obscured (blizzard). Lightly obscured (heavy snow).',
    combat: 'Blizzard: effectively blind beyond the area. Disadvantage on ranged attacks.',
    movement: 'Difficult terrain (2× movement cost). Possible exhaustion from cold (CON saves).',
    spells: 'Fire spells work. Create Bonfire for warmth.',
    note: 'Heavily obscured = blind. Can\'t target with spells requiring sight. Opportunity attacks at disadvantage.',
  },
  {
    weather: 'Extreme Heat',
    visibility: 'Normal.',
    combat: 'No direct combat effects.',
    movement: 'CON save (DC 5, +1 per hour) or gain 1 level of exhaustion. Disadvantage with heavy armor/clothing.',
    spells: 'Create Water, Prestidigitation (cooling) help.',
    note: 'Heavy armor wearers suffer most. Exhaustion is devastating — monitor it closely.',
  },
  {
    weather: 'Extreme Cold',
    visibility: 'Normal.',
    combat: 'No direct combat effects.',
    movement: 'CON save DC 10 per hour or gain 1 level of exhaustion. Cold resistance/immunity = auto-pass.',
    spells: 'Endure Elements equivalent. Cold resistance helps.',
    note: 'Cold resistance races (Goliath, Genasi) auto-succeed. Others need warm clothing.',
  },
  {
    weather: 'Fog',
    visibility: 'Heavily obscured (thick fog). Lightly obscured (light fog).',
    combat: 'Thick fog: effectively blind. Can\'t see targets. Attacks have disadvantage, enemies have advantage vs you (or both have disadvantage — blind vs blind).',
    movement: 'No movement penalty. Navigation more difficult.',
    spells: 'Gust of Wind clears fog. Wind Wall creates fog-free zone.',
    note: 'Fog is one of the strongest natural effects. Blocks line of sight for most spells.',
  },
  {
    weather: 'Strong Wind',
    visibility: 'Normal (may be lightly obscured if carrying debris).',
    combat: 'Disadvantage on ranged weapon attacks. Extinguishes open flames. Flying creatures may have difficulty.',
    movement: 'Against wind: difficult terrain for flying creatures.',
    spells: 'Ranged spell attacks unaffected (usually). Sound is harder to hear (disadvantage on Perception hearing).',
    note: 'Ranged WEAPON attacks at disadvantage. Spell attacks are usually fine (DM discretion).',
  },
];

export const OBSCUREMENT_RULES = {
  lightlyObscured: {
    effect: 'Disadvantage on Perception checks that rely on sight.',
    examples: 'Dim light, patchy fog, moderate foliage, heavy rain.',
    combat: 'Can still see creatures. Attacks are normal. Perception suffers.',
    note: 'NOT the same as concealment. You can still target creatures and attack normally.',
  },
  heavilyObscured: {
    effect: 'Effectively blind. Can\'t see anything in the area.',
    examples: 'Darkness, opaque fog, dense foliage, blizzard.',
    combat: 'Blinded condition: attacks have disadvantage, attacks against you have advantage. Can\'t target with sight-required spells.',
    note: 'Both attacker and target being blind = disadvantage + advantage = cancels out = straight roll.',
  },
};

export const WEATHER_COUNTERMEASURES = [
  { spell: 'Control Weather (L8)', effect: 'Change weather in 5-mile radius. 8-hour duration.', note: 'Nuclear option. Change any weather. High level but definitive.' },
  { spell: 'Endure Elements (not 5e)', effect: 'Not in 5e base rules. Use cold/fire resistance or appropriate clothing.', note: 'There\'s no Endure Elements in 5e. Rely on resistance or equipment.' },
  { spell: 'Fog Cloud / Gust of Wind', effect: 'Create or clear obscurement.', note: 'Gust of Wind disperses gases and fog in a line.' },
  { item: 'Cold Weather Gear', effect: 'Auto-succeed on CON saves vs extreme cold.', note: '10gp. Essential for cold environments. Always buy it.' },
  { item: 'Endurance feat options', effect: 'No direct feat. Ask DM about homebrew cold/heat resistance.', note: 'Racial cold/fire resistance is the best defense.' },
];

export function exhaustionFromWeather(hoursExposed, hasColdResistance = false) {
  if (hasColdResistance) return { saves: 0, note: 'Auto-pass with resistance' };
  return { saves: hoursExposed, dc: 10, note: `${hoursExposed} CON saves DC 10 over ${hoursExposed} hours` };
}

/**
 * Fantasy Calendar — Named months, holidays, moon phases, seasonal effects.
 * Based on the Calendar of Harptos (Forgotten Realms) as a default,
 * but designed for easy customization.
 */

export const CALENDAR_MONTHS = [
  { name: 'Hammer', common: 'Deepwinter', days: 30, season: 'winter', description: 'The coldest month. Travel is dangerous.' },
  { name: 'Alturiak', common: 'The Claw of Winter', days: 30, season: 'winter', description: 'Winter holds firm. Supplies run low in isolated settlements.' },
  { name: 'Ches', common: 'The Claw of Sunsets', days: 30, season: 'spring', description: 'The first thaw. Rivers flood. Trade routes reopen.' },
  { name: 'Tarsakh', common: 'The Claw of Storms', days: 30, season: 'spring', description: 'Storms and rain. Roads are muddy but flowers bloom.' },
  { name: 'Mirtul', common: 'The Melting', days: 30, season: 'spring', description: 'Spring fully arrives. Farmers plant crops. Festivals of renewal.' },
  { name: 'Kythorn', common: 'The Time of Flowers', days: 30, season: 'summer', description: 'Early summer. Perfect traveling weather.' },
  { name: 'Flamerule', common: 'Summertide', days: 30, season: 'summer', description: 'Peak summer heat. Droughts in arid regions.' },
  { name: 'Eleasis', common: 'Highsun', days: 30, season: 'summer', description: 'Hot days, warm nights. Festivals and tournaments.' },
  { name: 'Eleint', common: 'The Fading', days: 30, season: 'autumn', description: 'The harvest begins. Leaves turn. Days shorten.' },
  { name: 'Marpenoth', common: 'Leaffall', days: 30, season: 'autumn', description: 'Cool winds. Markets fill with harvest goods.' },
  { name: 'Uktar', common: 'The Rotting', days: 30, season: 'autumn', description: 'Decay sets in. Preparations for winter begin.' },
  { name: 'Nightal', common: 'The Drawing Down', days: 30, season: 'winter', description: 'Winter returns. The longest nights of the year.' },
];

export const HOLIDAYS = [
  { name: 'Midwinter', month: 0, day: 30, description: 'A feast day marking the midpoint of winter. Lords renew oaths.' },
  { name: 'Greengrass', month: 4, day: 30, description: 'The official start of spring. Dancing, music, and flower crowns.' },
  { name: 'Midsummer', month: 6, day: 30, description: 'The longest day. Feasting, bonfires, and declarations of love.' },
  { name: 'Shieldmeet', month: 6, day: 31, description: 'Every four years. Tournaments, truces, and political gatherings.' },
  { name: 'Highharvestide', month: 8, day: 30, description: 'Harvest festival. Feasts, games, and thanks to the earth.' },
  { name: 'Feast of the Moon', month: 10, day: 30, description: 'Honoring the dead. Stories of ancestors. Solemn ceremonies.' },
];

export const MOON_PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

export const SEASONAL_EFFECTS = {
  winter: {
    travel: 'Movement halved in snow. Blizzards possible.',
    combat: 'Cold damage resistance useful. Fire magic extra effective.',
    social: 'Communities huddle together. Strangers are suspicious.',
    resources: 'Food scarce. Fuel expensive. Warm clothing required.',
  },
  spring: {
    travel: 'Roads muddy after thaw. Rivers swollen and dangerous.',
    combat: 'Rain and fog reduce visibility. Ground is soft.',
    social: 'Spirits lift. Markets reopen. Hiring season for mercenaries.',
    resources: 'New growth. Herbs become available. Animals emerge.',
  },
  summer: {
    travel: 'Best traveling weather. Long days for distance.',
    combat: 'Heat exhaustion risk in heavy armor. Forest fires possible.',
    social: 'Festivals, tournaments, celebrations. NPCs are relaxed.',
    resources: 'Abundance. Prices at yearly low. Fresh food everywhere.',
  },
  autumn: {
    travel: 'Comfortable but days shorten. Storms increase.',
    combat: 'Fallen leaves crunch underfoot (no stealth bonus). Wind affects ranged.',
    social: 'Harvest anxiety. Preparations for winter drive urgency.',
    resources: 'Final harvest. Preservation of goods. Prices begin rising.',
  },
};

export function getMoonPhase(dayOfYear) {
  // Lunar cycle of ~30 days
  const phase = Math.floor((dayOfYear % 30) / 3.75);
  return MOON_PHASES[Math.min(phase, 7)];
}

export function getCurrentSeason(monthIndex) {
  if (monthIndex < 0 || monthIndex >= CALENDAR_MONTHS.length) return 'summer';
  return CALENDAR_MONTHS[monthIndex].season;
}

export function getSeasonalEffects(season) {
  return SEASONAL_EFFECTS[season] || SEASONAL_EFFECTS.summer;
}

export function getHolidaysInMonth(monthIndex) {
  return HOLIDAYS.filter(h => h.month === monthIndex);
}

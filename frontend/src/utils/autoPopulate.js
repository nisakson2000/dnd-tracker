// Auto-populate character stats from class/race/level selection
// Uses existing CLASSES and RACES data from the ruleset

import { calcMod, calcProfBonus } from './dndHelpers';

/**
 * Calculate auto HP: max hit die at level 1, then (avg + CON mod) per subsequent level.
 */
function calcAutoHP(hitDie, level, conMod) {
  if (!hitDie || level < 1) return null;
  const avg = Math.floor(hitDie / 2) + 1;
  const hpAtOne = hitDie + conMod;
  const hpAfterOne = (level - 1) * (avg + conMod);
  return Math.max(1, hpAtOne + hpAfterOne);
}

/**
 * Build auto-populated character data from class + race + level.
 *
 * @param {Object} params
 * @param {Object} params.classData    - class object from ruleset CLASSES array
 * @param {Object} params.raceData     - race object from ruleset RACES array
 * @param {number} params.level        - character level
 * @param {Object} params.overview     - current overview state
 * @param {Array}  params.abilities    - current ability scores [{ability, score}, ...]
 * @param {Array}  params.saves        - current saving throws [{ability, proficient}, ...]
 * @param {boolean} params.respectManualEdits - if true, skip fields that have non-default values
 *
 * @returns {{ overview, abilities, saves, summary }}
 */
export function autoPopulateStats({
  classData,
  raceData,
  level,
  overview,
  abilities,
  saves,
  respectManualEdits = true,
}) {
  const changes = [];
  const newOverview = { ...overview };
  let newAbilities = abilities.map(a => ({ ...a }));
  let newSaves = saves.map(s => ({ ...s }));

  // --- Racial Ability Score Bonuses ---
  if (raceData?.abilityBonuses && Object.keys(raceData.abilityBonuses).length > 0) {
    const bonusEntries = Object.entries(raceData.abilityBonuses);
    let appliedBonuses = [];
    for (const [ab, bonus] of bonusEntries) {
      const abilityEntry = newAbilities.find(a => a.ability === ab);
      if (abilityEntry) {
        const currentScore = abilityEntry.score || 10;
        // Only apply if score is at default (10) or if not respecting manual edits
        if (!respectManualEdits || currentScore === 10) {
          abilityEntry.score = currentScore + bonus;
          appliedBonuses.push(`${ab} +${bonus}`);
        }
      }
    }
    if (appliedBonuses.length > 0) {
      changes.push(`Racial bonuses: ${appliedBonuses.join(', ')}`);
    }
  }

  // --- HP Calculation ---
  if (classData?.hitDie) {
    const conScore = newAbilities.find(a => a.ability === 'CON')?.score || 10;
    const conMod = calcMod(conScore);
    const autoHP = calcAutoHP(classData.hitDie, level, conMod);

    // Hit dice total
    const suggestedHitDice = `${level}d${classData.hitDie}`;
    if (!respectManualEdits || !newOverview.hit_dice_total || newOverview.hit_dice_total === '' || newOverview.hit_dice_total === '0') {
      newOverview.hit_dice_total = suggestedHitDice;
    }

    // HP
    if (autoHP !== null && (!respectManualEdits || !newOverview.max_hp || newOverview.max_hp === 0)) {
      newOverview.max_hp = autoHP;
      newOverview.current_hp = autoHP;
      newOverview.hp_calc_method = 'auto';
      changes.push(`HP: ${autoHP}`);
    }
  }

  // --- Speed from Race ---
  if (raceData?.speed) {
    if (!respectManualEdits || !newOverview.speed || newOverview.speed === 0 || newOverview.speed === 30) {
      newOverview.speed = raceData.speed;
      changes.push(`Speed: ${raceData.speed} ft`);
    }
  }

  // --- Saving Throw Proficiencies ---
  if (classData?.savingThrows) {
    const noSavesSet = newSaves.every(s => !s.proficient);
    if (!respectManualEdits || noSavesSet) {
      newSaves = newSaves.map(s => ({
        ...s,
        proficient: classData.savingThrows.includes(s.ability),
      }));
      changes.push(`Saves: ${classData.savingThrows.join(' & ')}`);
    }
  }

  // --- Armor Proficiencies ---
  if (classData?.armorProficiencies) {
    const armorProf = classData.armorProficiencies.join(', ');
    if (!respectManualEdits || !newOverview.proficiencies_armor || newOverview.proficiencies_armor === '') {
      newOverview.proficiencies_armor = armorProf;
      changes.push(`Armor: ${armorProf}`);
    }
  }

  // --- Weapon Proficiencies ---
  if (classData?.weaponProficiencies) {
    const weaponProf = classData.weaponProficiencies.join(', ');
    if (!respectManualEdits || !newOverview.proficiencies_weapons || newOverview.proficiencies_weapons === '') {
      newOverview.proficiencies_weapons = weaponProf;
      changes.push(`Weapons: ${weaponProf}`);
    }
  }

  // --- Languages from Race ---
  if (raceData?.languages) {
    const langStr = raceData.languages.join(', ');
    if (!respectManualEdits || !newOverview.languages || newOverview.languages === '') {
      newOverview.languages = langStr;
      changes.push(`Languages: ${langStr}`);
    }
  }

  // --- Senses (Darkvision from Race) ---
  if (raceData?.darkvision && raceData.darkvision > 0) {
    const senseStr = `Darkvision ${raceData.darkvision} ft`;
    if (!respectManualEdits || !newOverview.senses || newOverview.senses === '') {
      newOverview.senses = senseStr;
      changes.push(senseStr);
    }
  }

  // --- Proficiency Bonus (display only, computed from level) ---
  const profBonus = calcProfBonus(level);

  // --- Build Summary ---
  const raceName = raceData
    ? (raceData.subrace ? `${raceData.name} (${raceData.subrace})` : raceData.name)
    : 'Unknown';
  const className = classData?.name || 'Unknown';
  const hp = newOverview.max_hp || '?';
  const speed = newOverview.speed || '?';

  const summary = `Auto-populated ${className} Level ${level} / ${raceName}. HP: ${hp}, Speed: ${speed}, Prof: +${profBonus}`;

  return {
    overview: newOverview,
    abilities: newAbilities,
    saves: newSaves,
    summary,
    changes,
  };
}

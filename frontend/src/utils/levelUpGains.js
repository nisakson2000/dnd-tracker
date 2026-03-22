import { getRuleset } from '../data/rulesets';

const ORDINALS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

export function getLevelUpGains(className, level, rulesetId) {
  const ruleset = getRuleset(rulesetId);
  const { CLASSES, PROFICIENCY_BONUS, SPELL_SLOTS, CLASS_FEATURES, ASI_LEVELS } = ruleset;

  const cls = CLASSES.find(c => c.name === className);

  const gains = {
    hitDie: cls ? `d${cls.hitDie}` : null,
    proficiencyBonus: null,
    newSpellSlots: null,
    isASI: false,
    features: [],
  };

  if (!cls || !level || level < 1) return gains;

  // Proficiency bonus change
  const prevProf = PROFICIENCY_BONUS[level - 1];
  const newProf = PROFICIENCY_BONUS[level];
  if (prevProf && newProf && newProf > prevProf) {
    gains.proficiencyBonus = { old: prevProf, new: newProf };
  }

  // ASI check
  const asiLevels = ASI_LEVELS[className] || ASI_LEVELS.default;
  gains.isASI = asiLevels.includes(level);

  // Spell slot changes
  if (cls.spellcasting) {
    const type = cls.spellcasting.type;
    const slotTable = SPELL_SLOTS[type];

    if (type === 'pact' && slotTable) {
      const prev = level > 1 ? slotTable[level - 2] : { slots: 0, slotLevel: 0 };
      const curr = slotTable[level - 1];
      if (curr) {
        const changes = {};
        if (curr.slots > prev.slots) {
          changes[`Pact (${ORDINALS[curr.slotLevel]})`] = `+${curr.slots - prev.slots} slot${curr.slots - prev.slots > 1 ? 's' : ''}`;
        }
        if (curr.slotLevel > prev.slotLevel) {
          changes['Pact Slot Level'] = `${ORDINALS[prev.slotLevel] || '—'} → ${ORDINALS[curr.slotLevel]}`;
        }
        if (Object.keys(changes).length > 0) {
          gains.newSpellSlots = changes;
        }
      }
    } else if (slotTable) {
      const prevSlots = level > 1 ? slotTable[level - 2] : new Array(slotTable[0].length).fill(0);
      const currSlots = slotTable[level - 1];
      if (currSlots) {
        const changes = {};
        for (let i = 0; i < currSlots.length; i++) {
          const diff = currSlots[i] - (prevSlots[i] || 0);
          if (diff > 0) {
            changes[`${ORDINALS[i + 1]} level`] = `+${diff} slot${diff > 1 ? 's' : ''}`;
          }
        }
        if (Object.keys(changes).length > 0) {
          gains.newSpellSlots = changes;
        }
      }
    }
  }

  // Class features
  const classFeats = CLASS_FEATURES[className];
  if (classFeats && classFeats[level]) {
    gains.features = classFeats[level];
  }

  // Class resource auto-scaling (Ki/Focus Points, Sorcery Points, etc.)
  // When a feature has scales_with_level, its uses_total should equal the class level.
  // At levels beyond when the feature was first gained, emit resourceUpdates so the
  // existing feature's uses_total gets updated.
  gains.resourceUpdates = [];
  if (classFeats) {
    for (const [lvlStr, feats] of Object.entries(classFeats)) {
      const featureLvl = parseInt(lvlStr, 10);
      if (featureLvl >= level) continue; // only look at features gained before this level
      for (const feat of feats) {
        if (feat.scales_with_level && level > featureLvl) {
          gains.resourceUpdates.push({
            name: feat.name,
            uses_total: level,
          });
        }
      }
    }
  }

  return gains;
}

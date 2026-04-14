/**
 * D&D Beyond PDF Character Sheet Import Utility
 * Extracts character data from D&D Beyond PDF character sheets
 * and maps it to The Codex import format.
 */
import * as pdfjsLib from 'pdfjs-dist';
import { calcProfBonus } from './dndHelpers';

// Use the bundled worker (Vite handles this)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

// ─── Constants ──────────────────────────────────────────────────────────────

const STAT_NAMES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const STAT_FULL = {
  STRENGTH: 'STR', DEXTERITY: 'DEX', CONSTITUTION: 'CON',
  INTELLIGENCE: 'INT', WISDOM: 'WIS', CHARISMA: 'CHA',
};

const SKILL_LIST = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
  'Sleight of Hand', 'Stealth', 'Survival',
];

const SKILL_ABILITY = {
  Acrobatics: 'DEX', 'Animal Handling': 'WIS', Arcana: 'INT', Athletics: 'STR',
  Deception: 'CHA', History: 'INT', Insight: 'WIS', Intimidation: 'CHA',
  Investigation: 'INT', Medicine: 'WIS', Nature: 'INT', Perception: 'WIS',
  Performance: 'CHA', Persuasion: 'CHA', Religion: 'INT',
  'Sleight of Hand': 'DEX', Stealth: 'DEX', Survival: 'WIS',
};

const CLASS_HIT_DICE = {
  Barbarian: 12, Fighter: 10, Paladin: 10, Ranger: 10,
  Bard: 8, Cleric: 8, Druid: 8, Monk: 8, Rogue: 8, Warlock: 8,
  Sorcerer: 6, Wizard: 6, Artificer: 8, 'Blood Hunter': 10,
};

// ─── PDF Text Extraction ────────────────────────────────────────────────────

/**
 * Extract all text from a PDF file as an array of page strings.
 * @param {ArrayBuffer} pdfData - The raw PDF file data
 * @returns {Promise<string[]>} Array of page text strings
 */
async function extractPdfText(pdfData) {
  const doc = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // Sort items by Y position (top to bottom) then X (left to right)
    const items = content.items
      .filter(item => item.str && item.str.trim())
      .sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5]; // Y is inverted in PDF coords
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.transform[4] - b.transform[4]; // X position
      });
    pages.push(items.map(item => item.str).join(' '));
  }

  return pages;
}

// ─── Text Parsing Helpers ───────────────────────────────────────────────────

function findNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? parseInt(match[1], 10) : null;
}

function findText(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

/**
 * Extract ability scores from PDF text.
 * D&D Beyond PDFs typically show scores like: "STR 16 (+3)"
 * or in a block format with score and modifier.
 */
function extractAbilityScores(text) {
  const scores = {};

  // Try pattern: "STAT_NAME score modifier" or "score STAT_NAME"
  for (const stat of STAT_NAMES) {
    // Pattern: "STR 16" or "STRENGTH 16"
    let match = text.match(new RegExp(`(?:${stat}|${Object.entries(STAT_FULL).find(([, v]) => v === stat)?.[0] || stat})\\s*[:\\s]\\s*(\\d{1,2})`, 'i'));
    if (match) {
      scores[stat] = parseInt(match[1], 10);
      continue;
    }
    // Pattern: number near stat name
    match = text.match(new RegExp(`(\\d{1,2})\\s*(?:${stat})`, 'i'));
    if (match) {
      scores[stat] = parseInt(match[1], 10);
    }
  }

  // Fallback: look for a sequence of 6 numbers between 1-30 in a row
  if (Object.keys(scores).length < 6) {
    const seqMatch = text.match(/\b(\d{1,2})\s*\(?\s*[+-]\d+\s*\)?\s+(\d{1,2})\s*\(?\s*[+-]\d+\s*\)?\s+(\d{1,2})\s*\(?\s*[+-]\d+\s*\)?\s+(\d{1,2})\s*\(?\s*[+-]\d+\s*\)?\s+(\d{1,2})\s*\(?\s*[+-]\d+\s*\)?\s+(\d{1,2})/);
    if (seqMatch) {
      STAT_NAMES.forEach((stat, i) => {
        if (!scores[stat]) {
          const val = parseInt(seqMatch[i + 1], 10);
          if (val >= 1 && val <= 30) scores[stat] = val;
        }
      });
    }
  }

  // Fill any missing with 10
  STAT_NAMES.forEach(stat => {
    if (!scores[stat]) scores[stat] = 10;
  });

  return scores;
}

/**
 * Extract skill proficiencies from PDF text.
 * D&D Beyond marks proficient skills with a filled circle.
 * In text extraction, proficient skills often appear with a "●" or specific pattern.
 */
function extractSkills(text, abilityScores, profBonus) {
  const skills = [];
  const profText = text.toLowerCase();

  for (const skill of SKILL_LIST) {
    const skillLower = skill.toLowerCase();
    const ability = SKILL_ABILITY[skill];
    const mod = Math.floor((abilityScores[ability] - 10) / 2);

    // Check for proficiency by looking at modifier values
    // A proficient skill will have mod + profBonus, expertise = mod + 2*profBonus
    let proficient = false;
    let expertise = false;

    // Look for the skill name followed by a modifier
    const skillPattern = new RegExp(`${skillLower.replace(/\s+/g, '\\s+')}\\s*[+]?(\\d+)`, 'i');
    const skillMatch = profText.match(skillPattern);
    if (skillMatch) {
      const shownMod = parseInt(skillMatch[1], 10);
      if (shownMod === mod + profBonus * 2) {
        proficient = true;
        expertise = true;
      } else if (shownMod === mod + profBonus) {
        proficient = true;
      }
    }

    // Also check for bullet/dot markers near skill names
    const bulletPattern = new RegExp(`[●◉✦⬤]\\s*${skillLower.replace(/\s+/g, '\\s+')}`, 'i');
    if (bulletPattern.test(profText)) proficient = true;

    skills.push({ name: skill, proficient, expertise });
  }

  return skills;
}

/**
 * Extract saving throw proficiencies from PDF text.
 */
function extractSavingThrows(text, abilityScores, profBonus) {
  const profs = [];
  const textLower = text.toLowerCase();

  for (const stat of STAT_NAMES) {
    const fullName = Object.entries(STAT_FULL).find(([, v]) => v === stat)?.[0]?.toLowerCase() || stat.toLowerCase();
    const mod = Math.floor((abilityScores[stat] - 10) / 2);

    // Check if saving throw modifier = mod + profBonus (indicating proficiency)
    const pattern = new RegExp(`(?:${stat}|${fullName})\\s*(?:saving\\s*throw)?\\s*[+](\\d+)`, 'i');
    const match = textLower.match(pattern);
    if (match && parseInt(match[1], 10) === mod + profBonus) {
      profs.push(stat);
    }

    // Also check for bullet markers
    const bulletPattern = new RegExp(`[●◉✦⬤]\\s*(?:${stat}|${fullName})`, 'i');
    if (bulletPattern.test(textLower)) profs.push(stat);
  }

  return [...new Set(profs)];
}

/**
 * Extract class and level information.
 * Patterns: "Fighter 5", "Level 5 Fighter", "Wizard 3 / Fighter 2"
 */
function extractClassLevel(text) {
  const classes = [];
  const classNames = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
    'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
    'Artificer', 'Blood Hunter',
  ];

  // Try multiclass pattern: "Fighter 5 / Wizard 3"
  const multiPattern = new RegExp(
    `(${classNames.join('|')})\\s*(\\d+)\\s*/\\s*(${classNames.join('|')})\\s*(\\d+)(?:\\s*/\\s*(${classNames.join('|')})\\s*(\\d+))?`,
    'i'
  );
  const multiMatch = text.match(multiPattern);
  if (multiMatch) {
    classes.push({ class: multiMatch[1], level: parseInt(multiMatch[2], 10) });
    classes.push({ class: multiMatch[3], level: parseInt(multiMatch[4], 10) });
    if (multiMatch[5]) classes.push({ class: multiMatch[5], level: parseInt(multiMatch[6], 10) });
    return classes;
  }

  // Try single class: "Fighter 5" or "Level 5 Fighter"
  for (const cls of classNames) {
    const p1 = new RegExp(`${cls}\\s+(\\d+)`, 'i');
    const p2 = new RegExp(`Level\\s+(\\d+)\\s+${cls}`, 'i');
    const m1 = text.match(p1);
    const m2 = text.match(p2);
    if (m1) {
      classes.push({ class: cls, level: parseInt(m1[1], 10) });
    } else if (m2) {
      classes.push({ class: cls, level: parseInt(m2[1], 10) });
    }
  }

  return classes.length > 0 ? classes : [{ class: '', level: 1 }];
}

/**
 * Extract character name from PDF text.
 * Usually the first prominent text on the first page.
 */
function extractName(text) {
  // Try "Character Name: X" or just the first capitalized word sequence
  let name = findText(text, /(?:Character\s*Name|Name)\s*[:\s]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (name) return name;

  // First line often has the character name
  const lines = text.split(/\s{3,}|\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 1 && trimmed.length < 40 && /^[A-Z]/.test(trimmed) && !/^(STR|DEX|CON|INT|WIS|CHA|Level|Class|Race)/.test(trimmed)) {
      return trimmed;
    }
  }

  return 'Imported Character';
}

/**
 * Extract race from PDF text.
 */
function extractRace(text) {
  const races = [
    'Dragonborn', 'Dwarf', 'Hill Dwarf', 'Mountain Dwarf', 'Elf', 'High Elf', 'Wood Elf',
    'Dark Elf', 'Drow', 'Gnome', 'Forest Gnome', 'Rock Gnome', 'Half-Elf', 'Halfling',
    'Lightfoot Halfling', 'Stout Halfling', 'Half-Orc', 'Human', 'Variant Human',
    'Tiefling', 'Aasimar', 'Genasi', 'Goliath', 'Tabaxi', 'Kenku', 'Firbolg',
    'Triton', 'Yuan-Ti', 'Bugbear', 'Goblin', 'Hobgoblin', 'Kobold', 'Orc',
    'Tortle', 'Changeling', 'Kalashtar', 'Shifter', 'Warforged',
    'Satyr', 'Leonin', 'Harengon', 'Owlin', 'Fairy',
    'Loxodon', 'Minotaur', 'Centaur', 'Vedalken', 'Simic Hybrid',
  ];

  // Try "Race: X" pattern
  let race = findText(text, /Race\s*[:\s]\s*(\w[\w\s-]*)/i);
  if (race) {
    // Trim to just the race name
    for (const r of races) {
      if (race.toLowerCase().startsWith(r.toLowerCase())) return r;
    }
    return race.split(/\s{2,}/)[0];
  }

  // Search for any race name in the text
  for (const r of races) {
    if (text.includes(r)) return r;
  }

  return '';
}

/**
 * Extract background from PDF text.
 */
function extractBackground(text) {
  const backgrounds = [
    'Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan',
    'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin',
    'Haunted One', 'Far Traveler', 'Knight', 'Pirate', 'Gladiator',
    'Artisan', 'Farmer', 'Guard', 'Guide', 'Merchant', 'Scribe', 'Wayfarer',
  ];

  let bg = findText(text, /Background\s*[:\s]\s*(\w[\w\s]*)/i);
  if (bg) {
    for (const b of backgrounds) {
      if (bg.toLowerCase().startsWith(b.toLowerCase())) return b;
    }
    return bg.split(/\s{2,}/)[0];
  }

  for (const b of backgrounds) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(text)) return b;
  }

  return '';
}

/**
 * Extract HP from PDF text.
 */
function extractHP(text) {
  // "Hit Points: 45" or "HP: 45/45" or "Hit Point Maximum 45"
  let max = findNumber(text, /(?:Hit\s*Point\s*Maximum|Max(?:imum)?\s*HP|HP\s*Max)\s*[:\s]\s*(\d+)/i);
  if (!max) max = findNumber(text, /(?:Hit\s*Points|HP)\s*[:\s]\s*(\d+)/i);
  if (!max) max = findNumber(text, /(\d+)\s*(?:Hit\s*Points|HP)/i);

  let current = findNumber(text, /(?:Current\s*HP|Current\s*Hit\s*Points)\s*[:\s]\s*(\d+)/i);
  if (!current) current = max;

  const temp = findNumber(text, /(?:Temp(?:orary)?\s*HP|Temporary\s*Hit\s*Points)\s*[:\s]\s*(\d+)/i) || 0;

  return { max: max || 10, current: current || max || 10, temp };
}

/**
 * Extract AC from PDF text.
 */
function extractAC(text) {
  const ac = findNumber(text, /(?:Armor\s*Class|AC)\s*[:\s]\s*(\d+)/i);
  return ac || 10;
}

/**
 * Extract speed from PDF text.
 */
function extractSpeed(text) {
  const speed = findNumber(text, /(?:Speed|Walking\s*Speed)\s*[:\s]\s*(\d+)/i);
  return speed || 30;
}

/**
 * Extract proficiency bonus from PDF text or calculate from level.
 * Fallback uses canonical calcProfBonus from utils/dndHelpers.js.
 */
function getProficiencyBonus(text, level) {
  const bonus = findNumber(text, /(?:Proficiency\s*Bonus)\s*[:\s+]\s*\+?(\d+)/i);
  if (bonus) return bonus;
  // Calculate from level
  return calcProfBonus(level);
}

/**
 * Extract spells from PDF text (basic extraction).
 */
function extractSpells(text) {
  const spells = [];
  const spellSection = text.match(/(?:Spells|Spellcasting|Cantrips|Spell\s*List)([\s\S]*?)(?:Equipment|Inventory|Features|$)/i);
  if (!spellSection) return spells;

  const section = spellSection[1];
  // Look for spell names - they're usually capitalized phrases
  const lines = section.split(/[,\n●•▪]/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 2 && trimmed.length < 50 && /^[A-Z]/.test(trimmed)) {
      // Filter out section headers and non-spell text
      if (/^(Cantrip|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|Level|Spell|Slot|Save)/i.test(trimmed)) continue;
      spells.push({
        name: trimmed.replace(/\s*\(.*\)\s*$/, ''),
        level: 0,
        school: '',
        casting_time: '1 action',
        spell_range: '',
        components: '',
        material: '',
        duration: '',
        concentration: false,
        ritual: false,
        description: '',
        upcast_notes: '',
        prepared: true,
        source: 'PDF Import',
      });
    }
  }

  return spells;
}

/**
 * Extract equipment/inventory from PDF text (basic extraction).
 */
function extractInventory(text) {
  const items = [];
  const equipSection = text.match(/(?:Equipment|Inventory|Gear|Items)([\s\S]*?)(?:Features|Traits|Spells|Notes|$)/i);
  if (!equipSection) return items;

  const section = equipSection[1];
  const lines = section.split(/[,\n●•▪]/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 1 && trimmed.length < 60 && !/^(Equipment|Inventory|CP|SP|EP|GP|PP|Total)/i.test(trimmed)) {
      // Check for quantity prefix like "2x" or "(3)"
      const qtyMatch = trimmed.match(/^(\d+)\s*[x×]\s*(.*)/i) || trimmed.match(/^\((\d+)\)\s*(.*)/i);
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
      const name = qtyMatch ? qtyMatch[2].trim() : trimmed;

      if (name.length > 1) {
        items.push({
          name,
          item_type: 'misc',
          weight: 0,
          value_gp: 0,
          quantity: qty,
          description: '',
          attunement: false,
          attuned: false,
          equipped: false,
          equipment_slot: '',
        });
      }
    }
  }

  return items;
}

/**
 * Extract currency from PDF text.
 */
function extractCurrency(text) {
  return {
    cp: findNumber(text, /(?:CP|Copper)\s*[:\s]\s*(\d+)/i) || 0,
    sp: findNumber(text, /(?:SP|Silver)\s*[:\s]\s*(\d+)/i) || 0,
    ep: findNumber(text, /(?:EP|Electrum)\s*[:\s]\s*(\d+)/i) || 0,
    gp: findNumber(text, /(?:GP|Gold)\s*[:\s]\s*(\d+)/i) || 0,
    pp: findNumber(text, /(?:PP|Platinum)\s*[:\s]\s*(\d+)/i) || 0,
  };
}

/**
 * Extract features and traits from PDF text.
 */
function extractFeatures(text) {
  const features = [];
  const featSection = text.match(/(?:Features\s*&?\s*Traits|Features|Class\s*Features|Racial\s*Traits)([\s\S]*?)(?:Equipment|Inventory|Spells|Notes|$)/i);
  if (!featSection) return features;

  const section = featSection[1];
  const blocks = section.split(/\n{2,}|(?=[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\.)/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (trimmed.length > 3 && trimmed.length < 200) {
      const titleMatch = trimmed.match(/^([A-Z][a-z]+(?:\s+[A-Za-z]+){0,4})/);
      if (titleMatch) {
        features.push({
          name: titleMatch[1],
          source: '',
          source_level: 0,
          feature_type: 'class',
          description: trimmed.substring(titleMatch[1].length).trim(),
          uses_total: 0,
          uses_remaining: 0,
          recharge: '',
        });
      }
    }
  }

  return features;
}

// ─── Main PDF Parser ────────────────────────────────────────────────────────

/**
 * Parse a D&D Beyond PDF character sheet into The Codex import format.
 * @param {ArrayBuffer} pdfData - The raw PDF file data
 * @returns {Promise<{payload: object, summary: object}>}
 */
export async function parseDDBPdf(pdfData) {
  const pages = await extractPdfText(pdfData);
  if (pages.length === 0) throw new Error('Could not extract text from PDF. The file may be scanned/image-based rather than text-based.');

  const fullText = pages.join('\n\n');
  const page1 = pages[0] || '';

  // ── Extract core data ──
  const name = extractName(page1);
  const classData = extractClassLevel(fullText);
  const primaryClass = classData.reduce((a, b) => b.level > a.level ? b : a, classData[0]);
  const totalLevel = classData.reduce((sum, c) => sum + c.level, 0);
  const race = extractRace(fullText);
  const background = extractBackground(fullText);
  const abilityScores = extractAbilityScores(page1);
  const profBonus = getProficiencyBonus(fullText, totalLevel);
  const hp = extractHP(fullText);
  const ac = extractAC(fullText);
  const speed = extractSpeed(fullText);
  const savingThrows = extractSavingThrows(fullText, abilityScores, profBonus);
  const skills = extractSkills(fullText, abilityScores, profBonus);
  const spells = extractSpells(fullText);
  const inventory = extractInventory(fullText);
  const currency = extractCurrency(fullText);
  const features = extractFeatures(fullText);

  // ── Hit dice ──
  const hitDiceTotal = classData.map(c => {
    const die = CLASS_HIT_DICE[c.class] || 8;
    return `${c.level}d${die}`;
  }).join(' + ');

  // ── Multiclass data ──
  const multiclassData = classData.length > 1
    ? JSON.stringify(classData.map(c => ({ class: c.class, subclass: '', level: c.level })))
    : '';

  // ── Build payload ──
  const payload = {
    overview: {
      name,
      race,
      subrace: '',
      primary_class: primaryClass.class,
      primary_subclass: '',
      background,
      alignment: '',
      level: totalLevel,
      experience_points: 0,
      max_hp: hp.max,
      current_hp: hp.current,
      temp_hp: hp.temp,
      armor_class: ac,
      speed,
      hit_dice_total: hitDiceTotal,
      hit_dice_used: 0,
      senses: '',
      languages: '',
      proficiencies_armor: '',
      proficiencies_weapons: '',
      proficiencies_tools: '',
      multiclass_data: multiclassData,
      ruleset: '5e-2014',
    },
    ability_scores: abilityScores,
    saving_throw_proficiencies: savingThrows,
    skills,
    backstory: {
      backstory_text: '',
      personality_traits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      age: '', height: '', weight: '', eyes: '', hair: '', skin: '',
    },
    spells,
    spell_slots: [],
    inventory,
    currency,
    features,
  };

  const summary = {
    name,
    race,
    class: primaryClass.class,
    level: totalLevel,
    multiclass: classData.length > 1 ? classData.map(c => `${c.class} ${c.level}`).join(' / ') : null,
    spellCount: spells.length,
    itemCount: inventory.length,
    featureCount: features.length,
    hp: `${hp.current}/${hp.max}`,
    stats: abilityScores,
  };

  return { payload, summary };
}

/**
 * Full PDF import pipeline: extract text, parse, create character, import data.
 * @param {ArrayBuffer} pdfData - Raw PDF file data
 * @param {function} createCharacterFn - The createCharacter API function
 * @param {function} importCharacterFn - invoke('import_character', ...) wrapper
 * @param {function} onProgress - Callback(step, total, label) for progress updates
 * @returns {Promise<{characterId: string, summary: object}>}
 */
export async function importDDBPdf(pdfData, createCharacterFn, importCharacterFn, onProgress = () => {}) {
  onProgress(0, 5, 'Extracting text from PDF...');

  const { payload, summary } = await parseDDBPdf(pdfData);

  onProgress(1, 5, 'Character data parsed...');
  onProgress(2, 5, 'Creating character...');

  const char = await createCharacterFn({
    name: payload.overview.name,
    ruleset: payload.overview.ruleset,
    race: payload.overview.race,
    primaryClass: payload.overview.primary_class,
    primarySubclass: payload.overview.primary_subclass,
  });

  onProgress(3, 5, 'Importing character data...');

  await importCharacterFn(char.id, payload);

  onProgress(4, 5, 'Finalizing...');
  await new Promise(r => setTimeout(r, 200));

  onProgress(5, 5, 'Import complete!');

  return { characterId: char.id, summary };
}

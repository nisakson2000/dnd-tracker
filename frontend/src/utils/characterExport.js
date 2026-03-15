/**
 * Character Export Utilities
 * Generates printable character sheet (PDF via browser print) and plain text export.
 */

import { calcMod, modStr } from './dndHelpers';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Open a new window with a formatted character sheet and trigger print.
 * @param {Object} data - Combined character data
 */
export function exportCharacterPDF(data) {
  const {
    name = 'Unknown',
    race = '',
    primaryClass = '',
    secondaryClass = '',
    level = 1,
    hp = 0,
    maxHp = 0,
    tempHp = 0,
    ac = 10,
    speed = 30,
    proficiencyBonus = 2,
    abilityScores = [],
    savingThrows = [],
    skills = [],
    attacks = [],
    spells = [],
    spellSlots = {},
    features = [],
    items = [],
    currency = {},
    backstory = {},
    conditions = [],
    inspiration = false,
  } = data;

  const classDisplay = secondaryClass
    ? `${primaryClass} / ${secondaryClass}`
    : primaryClass;

  // Build ability score boxes
  const abilityOrder = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const abilityMap = {};
  (abilityScores || []).forEach(a => {
    abilityMap[a.ability] = a.score;
  });

  const abilityBoxesHtml = abilityOrder.map(ab => {
    const score = abilityMap[ab] || 10;
    const mod = calcMod(score);
    return `
      <div class="ability-box">
        <div class="ability-name">${ab}</div>
        <div class="ability-mod">${modStr(mod)}</div>
        <div class="ability-score">${score}</div>
      </div>`;
  }).join('');

  // Saving throws
  const savesHtml = (savingThrows || []).map(s => {
    const dot = s.proficient ? '&#9679;' : '&#9675;';
    const score = abilityMap[s.ability] || 10;
    const mod = calcMod(score) + (s.proficient ? proficiencyBonus : 0);
    return `<div class="save-row"><span class="prof-dot">${dot}</span> ${s.ability} <span class="save-val">${modStr(mod)}</span></div>`;
  }).join('');

  // Skills
  const skillsHtml = (skills || []).map(s => {
    const dot = s.proficient ? '&#9679;' : s.expertise ? '&#9733;' : '&#9675;';
    const abilityScore = abilityMap[s.ability] || 10;
    const mod = calcMod(abilityScore)
      + (s.proficient ? proficiencyBonus : 0)
      + (s.expertise ? proficiencyBonus : 0);
    return `<div class="skill-row"><span class="prof-dot">${dot}</span> ${escapeHtml(s.name)} <span class="skill-ability">(${s.ability})</span> <span class="skill-val">${modStr(mod)}</span></div>`;
  }).join('');

  // Initiative (DEX mod)
  const dexScore = abilityMap['DEX'] || 10;
  const initiative = calcMod(dexScore);

  // Attacks table
  const attacksHtml = attacks.length > 0
    ? `<table class="attacks-table">
        <thead><tr><th>Name</th><th>ATK Bonus</th><th>Damage</th><th>Type</th></tr></thead>
        <tbody>${attacks.map(a => `
          <tr>
            <td>${escapeHtml(a.name)}</td>
            <td>${escapeHtml(a.attack_bonus || a.atk_bonus || '')}</td>
            <td>${escapeHtml(a.damage || '')}</td>
            <td>${escapeHtml(a.damage_type || '')}</td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : '<p class="muted">No attacks</p>';

  // Features list
  const featuresHtml = features.length > 0
    ? `<ul class="features-list">${features.map(f =>
        `<li><strong>${escapeHtml(f.name)}</strong>${f.source ? ` <span class="muted">(${escapeHtml(f.source)})</span>` : ''}${f.description ? `<br><span class="feature-desc">${escapeHtml(f.description)}</span>` : ''}</li>`
      ).join('')}</ul>`
    : '<p class="muted">No features</p>';

  // Spells grouped by level
  const spellsByLevel = {};
  (spells || []).forEach(sp => {
    const lvl = sp.level ?? 0;
    if (!spellsByLevel[lvl]) spellsByLevel[lvl] = [];
    spellsByLevel[lvl].push(sp);
  });

  const spellSlotsHtml = Object.entries(spellSlots || {})
    .filter(([k]) => k.startsWith('level_'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => {
      const lvl = k.replace('level_', '').replace('_', ' ');
      const max = v.max ?? v.total ?? v;
      const used = v.used ?? 0;
      const remaining = (typeof max === 'number' ? max : 0) - (typeof used === 'number' ? used : 0);
      return max > 0 ? `<span class="slot-badge">Lvl ${lvl}: ${remaining}/${max}</span>` : '';
    })
    .filter(Boolean)
    .join(' ');

  let spellsHtml = '';
  if (Object.keys(spellsByLevel).length > 0) {
    const spellAbility = data.spellcastingAbility || '';
    const spellAbilityScore = abilityMap[spellAbility] || 10;
    const spellMod = calcMod(spellAbilityScore);
    const spellSaveDC = 8 + proficiencyBonus + (spellAbility ? spellMod : 0);
    const spellAtkBonus = proficiencyBonus + (spellAbility ? spellMod : 0);

    spellsHtml = `
      <div class="spell-header">
        ${spellAbility ? `<span>Spellcasting: ${spellAbility}</span>` : ''}
        ${spellAbility ? `<span>Save DC: ${spellSaveDC}</span>` : ''}
        ${spellAbility ? `<span>Attack: ${modStr(spellAtkBonus)}</span>` : ''}
      </div>
      ${spellSlotsHtml ? `<div class="spell-slots">${spellSlotsHtml}</div>` : ''}
      ${Object.entries(spellsByLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([lvl, sps]) => `
        <div class="spell-level-group">
          <h4>${Number(lvl) === 0 ? 'Cantrips' : `Level ${lvl}`}</h4>
          <div class="spell-list">${sps.map(sp =>
            `<span class="spell-name${sp.prepared ? ' prepared' : ''}">${escapeHtml(sp.name)}</span>`
          ).join(', ')}</div>
        </div>
      `).join('')}`;
  } else {
    spellsHtml = '<p class="muted">No spells</p>';
  }

  // Equipment / Inventory
  const currencyParts = [];
  const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = currency || {};
  if (pp) currencyParts.push(`${pp} PP`);
  if (gp) currencyParts.push(`${gp} GP`);
  if (ep) currencyParts.push(`${ep} EP`);
  if (sp) currencyParts.push(`${sp} SP`);
  if (cp) currencyParts.push(`${cp} CP`);
  const currencyStr = currencyParts.length > 0 ? currencyParts.join(' &middot; ') : 'None';

  const itemsHtml = items.length > 0
    ? `<ul class="items-list">${items.map(i => {
        const qty = i.quantity && i.quantity > 1 ? ` (x${i.quantity})` : '';
        const eq = i.equipped ? ' *' : '';
        return `<li>${escapeHtml(i.name)}${qty}${eq}</li>`;
      }).join('')}</ul>`
    : '<p class="muted">No items</p>';

  // Backstory
  const bs = backstory || {};
  const backstoryHtml = [
    bs.personality_traits ? `<div class="bs-field"><strong>Personality Traits:</strong> ${escapeHtml(bs.personality_traits)}</div>` : '',
    bs.ideals ? `<div class="bs-field"><strong>Ideals:</strong> ${escapeHtml(bs.ideals)}</div>` : '',
    bs.bonds ? `<div class="bs-field"><strong>Bonds:</strong> ${escapeHtml(bs.bonds)}</div>` : '',
    bs.flaws ? `<div class="bs-field"><strong>Flaws:</strong> ${escapeHtml(bs.flaws)}</div>` : '',
    bs.background ? `<div class="bs-field"><strong>Background:</strong> ${escapeHtml(bs.background)}</div>` : '',
    bs.backstory_text ? `<div class="bs-field"><strong>Backstory:</strong><br>${escapeHtml(bs.backstory_text)}</div>` : '',
  ].filter(Boolean).join('');

  // Conditions
  const conditionsHtml = conditions.length > 0
    ? `<div class="conditions">Conditions: ${conditions.map(c => escapeHtml(c)).join(', ')}</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(name)} - Character Sheet</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11px; color: #000; background: #fff; padding: 16px; }

  .print-bar { text-align: center; margin-bottom: 12px; }
  .print-bar button { font-size: 14px; padding: 8px 24px; cursor: pointer; border: 2px solid #333; background: #f5f5f5; border-radius: 4px; }
  .print-bar button:hover { background: #e0e0e0; }
  @media print { .print-bar { display: none !important; } }

  .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
  .header h1 { font-size: 24px; margin-bottom: 2px; }
  .header .subtitle { font-size: 13px; color: #444; }
  .header .inspiration { font-size: 12px; margin-top: 4px; }

  .two-col { display: flex; gap: 16px; }
  .col-left { width: 38%; }
  .col-right { flex: 1; }

  .section { margin-bottom: 14px; }
  .section h3 { font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #999; margin-bottom: 6px; padding-bottom: 2px; letter-spacing: 0.5px; }

  /* Ability Scores */
  .ability-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .ability-box { border: 2px solid #000; border-radius: 6px; text-align: center; padding: 6px 4px; }
  .ability-name { font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .ability-mod { font-size: 18px; font-weight: bold; }
  .ability-score { font-size: 10px; color: #555; border-top: 1px solid #ccc; margin-top: 2px; padding-top: 2px; }

  /* Saves & Skills */
  .save-row, .skill-row { display: flex; align-items: center; gap: 4px; padding: 1px 0; font-size: 10.5px; }
  .prof-dot { font-size: 10px; }
  .save-val, .skill-val { margin-left: auto; font-weight: bold; }
  .skill-ability { color: #888; font-size: 9px; }

  /* Stat boxes */
  .stat-boxes { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
  .stat-box { border: 2px solid #000; border-radius: 6px; text-align: center; padding: 6px 12px; min-width: 70px; }
  .stat-box .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-box .stat-value { font-size: 18px; font-weight: bold; }

  .conditions { font-size: 10px; color: #c00; margin-bottom: 8px; font-style: italic; }

  /* Attacks */
  .attacks-table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  .attacks-table th, .attacks-table td { border: 1px solid #aaa; padding: 3px 6px; text-align: left; }
  .attacks-table th { background: #eee; font-size: 10px; text-transform: uppercase; }

  /* Features */
  .features-list { list-style: none; }
  .features-list li { padding: 3px 0; border-bottom: 1px dotted #ccc; }
  .feature-desc { font-size: 10px; color: #555; }

  /* Spells */
  .spell-header { display: flex; gap: 16px; font-size: 11px; font-weight: bold; margin-bottom: 6px; flex-wrap: wrap; }
  .spell-slots { margin-bottom: 8px; }
  .slot-badge { display: inline-block; background: #eee; border: 1px solid #bbb; border-radius: 3px; padding: 1px 6px; font-size: 10px; margin-right: 4px; }
  .spell-level-group { margin-bottom: 6px; }
  .spell-level-group h4 { font-size: 11px; margin-bottom: 2px; border-bottom: 1px dotted #ccc; }
  .spell-list { font-size: 10.5px; }
  .spell-name.prepared { font-weight: bold; }

  /* Items */
  .items-list { list-style: disc; padding-left: 18px; font-size: 10.5px; columns: 2; }
  .items-list li { padding: 1px 0; }
  .currency { font-weight: bold; font-size: 11px; margin-bottom: 6px; }

  /* Backstory */
  .bs-field { margin-bottom: 6px; font-size: 11px; }

  .muted { color: #999; font-style: italic; font-size: 10.5px; }

  .full-width { margin-top: 14px; }

  @media print {
    body { padding: 0; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
  <div class="print-bar">
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <h1>${escapeHtml(name)}</h1>
    <div class="subtitle">${escapeHtml(race)} ${escapeHtml(classDisplay)} &mdash; Level ${level}</div>
    ${inspiration ? '<div class="inspiration">&#9733; Inspired</div>' : ''}
  </div>

  ${conditionsHtml}

  <div class="two-col">
    <div class="col-left">
      <div class="section">
        <h3>Ability Scores</h3>
        <div class="ability-grid">${abilityBoxesHtml}</div>
      </div>

      <div class="section">
        <h3>Saving Throws</h3>
        ${savesHtml || '<p class="muted">None</p>'}
      </div>

      <div class="section">
        <h3>Skills</h3>
        ${skillsHtml || '<p class="muted">None</p>'}
      </div>
    </div>

    <div class="col-right">
      <div class="stat-boxes">
        <div class="stat-box">
          <div class="stat-label">Armor Class</div>
          <div class="stat-value">${ac}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Hit Points</div>
          <div class="stat-value">${hp} / ${maxHp}</div>
          ${tempHp ? `<div class="stat-label">Temp: ${tempHp}</div>` : ''}
        </div>
        <div class="stat-box">
          <div class="stat-label">Speed</div>
          <div class="stat-value">${speed} ft</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Initiative</div>
          <div class="stat-value">${modStr(initiative)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Prof. Bonus</div>
          <div class="stat-value">${modStr(proficiencyBonus)}</div>
        </div>
      </div>

      <div class="section">
        <h3>Attacks</h3>
        ${attacksHtml}
      </div>

      <div class="section">
        <h3>Features &amp; Traits</h3>
        ${featuresHtml}
      </div>
    </div>
  </div>

  <div class="full-width">
    <div class="section">
      <h3>Spellcasting</h3>
      ${spellsHtml}
    </div>
  </div>

  <div class="full-width">
    <div class="section">
      <h3>Equipment</h3>
      <div class="currency">Currency: ${currencyStr}</div>
      ${itemsHtml}
    </div>
  </div>

  ${backstoryHtml ? `
  <div class="full-width">
    <div class="section">
      <h3>Background &amp; Personality</h3>
      ${backstoryHtml}
    </div>
  </div>` : ''}

</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    // Give the page a moment to render before triggering print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
}

/**
 * Generate a plain text representation of a character (for clipboard copy).
 * @param {Object} data - Combined character data
 * @returns {string} Plain text character sheet
 */
export function exportCharacterText(data) {
  const {
    name = 'Unknown',
    race = '',
    primaryClass = '',
    secondaryClass = '',
    level = 1,
    hp = 0,
    maxHp = 0,
    tempHp = 0,
    ac = 10,
    speed = 30,
    proficiencyBonus = 2,
    abilityScores = [],
    savingThrows = [],
    skills = [],
    attacks = [],
    spells = [],
    spellSlots = {},
    features = [],
    items = [],
    currency = {},
    backstory = {},
    conditions = [],
    inspiration = false,
  } = data;

  const lines = [];
  const hr = '═'.repeat(50);
  const divider = '─'.repeat(50);

  const classDisplay = secondaryClass
    ? `${primaryClass} / ${secondaryClass}`
    : primaryClass;

  lines.push(hr);
  lines.push(`  ${name}`);
  lines.push(`  ${race} ${classDisplay} - Level ${level}`);
  if (inspiration) lines.push('  * Inspired');
  lines.push(hr);
  lines.push('');

  // Combat stats
  lines.push(`AC: ${ac}  |  HP: ${hp}/${maxHp}${tempHp ? ` (Temp: ${tempHp})` : ''}  |  Speed: ${speed} ft  |  Prof: ${modStr(proficiencyBonus)}`);
  if (conditions.length > 0) lines.push(`Conditions: ${conditions.join(', ')}`);
  lines.push('');

  // Ability scores
  const abilityOrder = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const abilityMap = {};
  (abilityScores || []).forEach(a => { abilityMap[a.ability] = a.score; });

  lines.push(divider);
  lines.push('ABILITY SCORES');
  lines.push(divider);
  lines.push(abilityOrder.map(ab => {
    const score = abilityMap[ab] || 10;
    const mod = calcMod(score);
    return `${ab}: ${score} (${modStr(mod)})`;
  }).join('  |  '));
  lines.push('');

  // Saving throws
  if (savingThrows.length > 0) {
    lines.push(divider);
    lines.push('SAVING THROWS');
    lines.push(divider);
    lines.push(savingThrows.map(s => {
      const score = abilityMap[s.ability] || 10;
      const mod = calcMod(score) + (s.proficient ? proficiencyBonus : 0);
      return `${s.proficient ? '*' : ' '} ${s.ability}: ${modStr(mod)}`;
    }).join('  |  '));
    lines.push('');
  }

  // Skills
  if (skills.length > 0) {
    lines.push(divider);
    lines.push('SKILLS');
    lines.push(divider);
    skills.forEach(s => {
      const abilityScore = abilityMap[s.ability] || 10;
      const mod = calcMod(abilityScore)
        + (s.proficient ? proficiencyBonus : 0)
        + (s.expertise ? proficiencyBonus : 0);
      const marker = s.expertise ? '**' : s.proficient ? '* ' : '  ';
      lines.push(`${marker}${s.name} (${s.ability}): ${modStr(mod)}`);
    });
    lines.push('');
  }

  // Attacks
  if (attacks.length > 0) {
    lines.push(divider);
    lines.push('ATTACKS');
    lines.push(divider);
    attacks.forEach(a => {
      lines.push(`- ${a.name}: ATK ${a.attack_bonus || a.atk_bonus || '?'}, DMG ${a.damage || '?'} ${a.damage_type || ''}`);
    });
    lines.push('');
  }

  // Features
  if (features.length > 0) {
    lines.push(divider);
    lines.push('FEATURES & TRAITS');
    lines.push(divider);
    features.forEach(f => {
      lines.push(`- ${f.name}${f.source ? ` (${f.source})` : ''}`);
      if (f.description) lines.push(`  ${f.description}`);
    });
    lines.push('');
  }

  // Spells
  const spellsByLevel = {};
  (spells || []).forEach(sp => {
    const lvl = sp.level ?? 0;
    if (!spellsByLevel[lvl]) spellsByLevel[lvl] = [];
    spellsByLevel[lvl].push(sp);
  });

  if (Object.keys(spellsByLevel).length > 0) {
    lines.push(divider);
    lines.push('SPELLS');
    lines.push(divider);
    Object.entries(spellsByLevel)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([lvl, sps]) => {
        const label = Number(lvl) === 0 ? 'Cantrips' : `Level ${lvl}`;
        lines.push(`${label}: ${sps.map(sp => sp.name + (sp.prepared ? ' *' : '')).join(', ')}`);
      });
    lines.push('');
  }

  // Equipment
  if (items.length > 0 || Object.values(currency || {}).some(v => v > 0)) {
    lines.push(divider);
    lines.push('EQUIPMENT');
    lines.push(divider);
    const { cp = 0, sp: sp2 = 0, ep = 0, gp = 0, pp = 0 } = currency || {};
    const currParts = [];
    if (pp) currParts.push(`${pp} PP`);
    if (gp) currParts.push(`${gp} GP`);
    if (ep) currParts.push(`${ep} EP`);
    if (sp2) currParts.push(`${sp2} SP`);
    if (cp) currParts.push(`${cp} CP`);
    if (currParts.length) lines.push(`Currency: ${currParts.join(', ')}`);
    items.forEach(i => {
      const qty = i.quantity && i.quantity > 1 ? ` (x${i.quantity})` : '';
      const eq = i.equipped ? ' [E]' : '';
      lines.push(`- ${i.name}${qty}${eq}`);
    });
    lines.push('');
  }

  // Backstory
  const bs = backstory || {};
  const bsFields = [
    ['Personality Traits', bs.personality_traits],
    ['Ideals', bs.ideals],
    ['Bonds', bs.bonds],
    ['Flaws', bs.flaws],
    ['Background', bs.background],
    ['Backstory', bs.backstory_text],
  ].filter(([, v]) => v);

  if (bsFields.length > 0) {
    lines.push(divider);
    lines.push('BACKGROUND & PERSONALITY');
    lines.push(divider);
    bsFields.forEach(([label, value]) => {
      lines.push(`${label}: ${value}`);
    });
    lines.push('');
  }

  lines.push(hr);
  return lines.join('\n');
}

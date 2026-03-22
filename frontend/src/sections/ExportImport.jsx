import { useState, useRef, useEffect } from 'react';
import { Download, Upload, FileJson, FileText, Copy, Check, Loader2, ClipboardCheck, AlertTriangle, CheckCircle2, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportCharacter } from '../api/export';
import { invoke } from '@tauri-apps/api/core';
import ConfirmDialog from '../components/ConfirmDialog';
import { calcMod, modStr } from '../utils/dndHelpers';

function generateTextSummary(data) {
  const o = data.overview;
  const abs = data.ability_scores;
  const lines = [];

  lines.push(`═══════════════════════════════════════`);
  lines.push(`  ${o.name}`);
  lines.push(`═══════════════════════════════════════`);
  lines.push('');
  lines.push(`Race: ${o.race || 'Unset'}  |  Class: ${o.primary_class || 'Unset'}${o.primary_subclass ? ` (${o.primary_subclass})` : ''}  |  Level: ${o.level}`);
  lines.push(`Background: ${o.background || '—'}  |  Alignment: ${o.alignment || '—'}`);
  if (o.campaign_name) lines.push(`Campaign: ${o.campaign_name}`);
  lines.push('');

  // Ability Scores
  lines.push('── Ability Scores ──');
  const abOrder = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  abOrder.forEach(ab => {
    const score = abs[ab] || 10;
    lines.push(`  ${ab}: ${score} (${modStr(calcMod(score))})`);
  });
  lines.push('');

  // Saves
  if (data.saving_throw_proficiencies?.length > 0) {
    lines.push(`Saving Throw Proficiencies: ${data.saving_throw_proficiencies.join(', ')}`);
    lines.push('');
  }

  // HP & Combat
  lines.push('── Combat Stats ──');
  lines.push(`  HP: ${o.current_hp}/${o.max_hp}${o.temp_hp > 0 ? ` (+${o.temp_hp} temp)` : ''}`);
  lines.push(`  AC: ${o.armor_class}  |  Speed: ${o.speed}ft  |  Initiative: ${modStr(calcMod(abs.DEX || 10))}`);
  lines.push(`  Hit Dice: ${o.hit_dice_total} (${o.hit_dice_used} used)`);
  if (o.exhaustion_level > 0) lines.push(`  Exhaustion: Level ${o.exhaustion_level}`);
  lines.push('');

  // Skills
  const profSkills = data.skills?.filter(s => s.proficient) || [];
  if (profSkills.length > 0) {
    lines.push('── Skill Proficiencies ──');
    profSkills.forEach(s => {
      lines.push(`  ${s.expertise ? '★' : '●'} ${s.name}${s.expertise ? ' (Expertise)' : ''}`);
    });
    lines.push('');
  }

  // Proficiencies
  if (o.languages) lines.push(`Languages: ${o.languages}`);
  if (o.proficiencies_armor) lines.push(`Armor: ${o.proficiencies_armor}`);
  if (o.proficiencies_weapons) lines.push(`Weapons: ${o.proficiencies_weapons}`);
  if (o.proficiencies_tools) lines.push(`Tools: ${o.proficiencies_tools}`);
  if (o.senses) lines.push(`Senses: ${o.senses}`);
  if (o.languages || o.proficiencies_armor || o.proficiencies_weapons) lines.push('');

  // Active Conditions
  if (data.active_conditions?.length > 0) {
    lines.push(`Active Conditions: ${data.active_conditions.join(', ')}`);
    lines.push('');
  }

  // Features
  if (data.features?.length > 0) {
    lines.push('── Features & Traits ──');
    data.features.forEach(f => {
      lines.push(`  ${f.name}${f.source ? ` [${f.source}]` : ''}${f.source_level ? ` (Lv ${f.source_level})` : ''}`);
      if (f.description) lines.push(`    ${f.description.substring(0, 200)}${f.description.length > 200 ? '...' : ''}`);
    });
    lines.push('');
  }

  // Attacks
  if (data.attacks?.length > 0) {
    lines.push('── Attacks ──');
    data.attacks.forEach(a => {
      lines.push(`  ${a.name}: ${a.attack_bonus} to hit, ${a.damage_dice} ${a.damage_type}${a.attack_range ? `, ${a.attack_range}` : ''}`);
    });
    lines.push('');
  }

  // Spells
  const spells = data.spells || [];
  if (spells.length > 0) {
    lines.push('── Spellbook ──');
    if (data.spell_slots?.length > 0) {
      lines.push(`  Slots: ${data.spell_slots.map(s => `Lv${s.slot_level}: ${s.max_slots - s.used_slots}/${s.max_slots}`).join('  ')}`);
    }
    const cantrips = spells.filter(s => s.level === 0);
    if (cantrips.length > 0) {
      lines.push(`  Cantrips: ${cantrips.map(s => s.name).join(', ')}`);
    }
    for (let lvl = 1; lvl <= 9; lvl++) {
      const lvlSpells = spells.filter(s => s.level === lvl);
      if (lvlSpells.length > 0) {
        lines.push(`  Level ${lvl}: ${lvlSpells.map(s => `${s.name}${s.prepared ? '*' : ''}`).join(', ')}`);
      }
    }
    lines.push('');
  }

  // Inventory
  if (data.inventory?.length > 0) {
    lines.push('── Inventory ──');
    data.inventory.forEach(i => {
      const parts = [i.name];
      if (i.quantity > 1) parts.push(`x${i.quantity}`);
      if (i.equipped) parts.push('[Equipped]');
      if (i.attuned) parts.push('[Attuned]');
      if (i.weight > 0) parts.push(`(${i.weight} lbs)`);
      lines.push(`  ${parts.join(' ')}`);
    });
    lines.push('');
  }

  // Currency
  if (data.currency) {
    const c = data.currency;
    const coins = [];
    if (c.pp > 0) coins.push(`${c.pp} PP`);
    if (c.gp > 0) coins.push(`${c.gp} GP`);
    if (c.ep > 0) coins.push(`${c.ep} EP`);
    if (c.sp > 0) coins.push(`${c.sp} SP`);
    if (c.cp > 0) coins.push(`${c.cp} CP`);
    if (coins.length > 0) {
      lines.push(`Currency: ${coins.join(', ')}`);
      lines.push('');
    }
  }

  // Backstory
  if (data.backstory) {
    const bs = data.backstory;
    if (bs.backstory_text) {
      lines.push('── Backstory ──');
      lines.push(bs.backstory_text);
      lines.push('');
    }
    if (bs.personality_traits) lines.push(`Personality: ${bs.personality_traits}`);
    if (bs.ideals) lines.push(`Ideals: ${bs.ideals}`);
    if (bs.bonds) lines.push(`Bonds: ${bs.bonds}`);
    if (bs.flaws) lines.push(`Flaws: ${bs.flaws}`);
    if (bs.personality_traits || bs.ideals || bs.bonds || bs.flaws) lines.push('');
  }

  // Quests
  const activeQuests = (data.quests || []).filter(q => q.status === 'active');
  if (activeQuests.length > 0) {
    lines.push('── Active Quests ──');
    activeQuests.forEach(q => {
      lines.push(`  ${q.title}${q.giver ? ` (from ${q.giver})` : ''}`);
      q.objectives?.forEach(o => {
        lines.push(`    ${o.completed ? '[x]' : '[ ]'} ${o.text}`);
      });
    });
    lines.push('');
  }

  // NPCs
  if (data.npcs?.length > 0) {
    lines.push('── Notable NPCs ──');
    data.npcs.forEach(n => {
      lines.push(`  ${n.name} — ${n.role} (${n.status})${n.location ? `, ${n.location}` : ''}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

function generatePdfHtml(data) {
  const o = data.overview;
  const abs = data.ability_scores;
  const abOrder = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  const abilityGrid = abOrder.map(ab => {
    const score = abs[ab] || 10;
    return `<div class="ab-card"><div class="ab-label">${ab}</div><div class="ab-score">${score}</div><div class="ab-mod">${modStr(calcMod(score))}</div></div>`;
  }).join('');

  const profSkills = (data.skills || []).filter(s => s.proficient);
  const skillRows = profSkills.map(s =>
    `<div class="skill-row"><span class="skill-dot">${s.expertise ? '\u2605' : '\u25CF'}</span> ${s.name}${s.expertise ? ' <em>(Expertise)</em>' : ''}</div>`
  ).join('');

  const saves = data.saving_throw_proficiencies || [];
  const features = (data.features || []).map(f =>
    `<div class="feat"><strong>${f.name}</strong>${f.source ? ` <span class="tag">${f.source}${f.source_level ? ` Lv${f.source_level}` : ''}</span>` : ''}${f.description ? `<div class="feat-desc">${f.description.substring(0, 300)}${f.description.length > 300 ? '...' : ''}</div>` : ''}</div>`
  ).join('');

  const attacks = (data.attacks || []).map(a =>
    `<tr><td><strong>${a.name}</strong></td><td>${a.attack_bonus || '—'}</td><td>${a.damage_dice || '—'} ${a.damage_type || ''}</td><td>${a.attack_range || '—'}</td></tr>`
  ).join('');

  const spells = data.spells || [];
  let spellBlock = '';
  if (spells.length > 0) {
    if (data.spell_slots?.length > 0) {
      spellBlock += `<div class="slots">Slots: ${data.spell_slots.map(s => `<span class="slot-badge">Lv${s.slot_level}: ${s.max_slots - s.used_slots}/${s.max_slots}</span>`).join(' ')}</div>`;
    }
    const cantrips = spells.filter(s => s.level === 0);
    if (cantrips.length > 0) spellBlock += `<div class="spell-level"><strong>Cantrips:</strong> ${cantrips.map(s => s.name).join(', ')}</div>`;
    for (let lvl = 1; lvl <= 9; lvl++) {
      const lvlSpells = spells.filter(s => s.level === lvl);
      if (lvlSpells.length > 0) spellBlock += `<div class="spell-level"><strong>Level ${lvl}:</strong> ${lvlSpells.map(s => `${s.name}${s.prepared ? '*' : ''}`).join(', ')}</div>`;
    }
  }

  const inventory = (data.inventory || []).map(i => {
    const tags = [];
    if (i.equipped) tags.push('Equipped');
    if (i.attuned) tags.push('Attuned');
    return `<div class="inv-item">${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ''}${tags.length > 0 ? ` <span class="tag">${tags.join(', ')}</span>` : ''}${i.weight > 0 ? ` <span class="dim">${i.weight} lbs</span>` : ''}</div>`;
  }).join('');

  const currency = data.currency;
  const coins = [];
  if (currency) {
    if (currency.pp > 0) coins.push(`${currency.pp} PP`);
    if (currency.gp > 0) coins.push(`${currency.gp} GP`);
    if (currency.ep > 0) coins.push(`${currency.ep} EP`);
    if (currency.sp > 0) coins.push(`${currency.sp} SP`);
    if (currency.cp > 0) coins.push(`${currency.cp} CP`);
  }

  const bs = data.backstory || {};
  const personality = [
    bs.personality_traits ? `<strong>Personality:</strong> ${bs.personality_traits}` : '',
    bs.ideals ? `<strong>Ideals:</strong> ${bs.ideals}` : '',
    bs.bonds ? `<strong>Bonds:</strong> ${bs.bonds}` : '',
    bs.flaws ? `<strong>Flaws:</strong> ${bs.flaws}` : '',
  ].filter(Boolean).join('<br/>');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${o.name || 'Character'} — Character Sheet</title>
<style>
  @page { margin: 0.5in; size: letter; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 10px; color: #1a1a1a; line-height: 1.4; }
  h1 { font-size: 22px; font-weight: 700; border-bottom: 3px solid #1a1a1a; padding-bottom: 4px; margin-bottom: 2px; }
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1.5px solid #888; padding-bottom: 2px; margin: 10px 0 6px; color: #333; }
  .header-sub { font-size: 11px; color: #555; margin-bottom: 8px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 14px; }
  .ab-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin: 6px 0; }
  .ab-card { border: 1.5px solid #333; border-radius: 6px; text-align: center; padding: 4px 2px; }
  .ab-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #555; }
  .ab-score { font-size: 18px; font-weight: 700; line-height: 1.2; }
  .ab-mod { font-size: 11px; color: #444; }
  .stat-row { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px dotted #ddd; font-size: 10px; }
  .stat-row strong { font-weight: 600; }
  .tag { font-size: 8px; background: #eee; border-radius: 3px; padding: 1px 4px; color: #555; font-weight: 600; }
  .dim { font-size: 9px; color: #888; }
  .feat { margin-bottom: 5px; font-size: 10px; }
  .feat-desc { font-size: 9px; color: #555; margin-top: 1px; line-height: 1.3; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  th { text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.06em; color: #555; border-bottom: 1.5px solid #888; padding: 2px 4px; }
  td { padding: 3px 4px; border-bottom: 1px solid #eee; }
  .skill-row { font-size: 10px; padding: 1px 0; }
  .skill-dot { color: #333; margin-right: 3px; }
  .slots { margin-bottom: 4px; }
  .slot-badge { display: inline-block; background: #e8e8e8; border-radius: 3px; padding: 1px 5px; font-size: 9px; font-weight: 600; margin-right: 4px; }
  .spell-level { font-size: 10px; margin-bottom: 2px; }
  .inv-item { font-size: 10px; padding: 1px 0; }
  .personality { font-size: 10px; line-height: 1.5; }
  .footer { margin-top: 12px; text-align: center; font-size: 8px; color: #aaa; border-top: 1px solid #ddd; padding-top: 4px; }
</style></head><body>

<h1>${o.name || 'Character'}</h1>
<div class="header-sub">
  ${o.race || ''} ${o.primary_class || ''}${o.primary_subclass ? ` (${o.primary_subclass})` : ''} &mdash; Level ${o.level || 1}
  ${o.background ? ` &bull; ${o.background}` : ''}${o.alignment ? ` &bull; ${o.alignment}` : ''}
  ${o.campaign_name ? `<br/>Campaign: ${o.campaign_name}` : ''}
</div>

<div class="ab-grid">${abilityGrid}</div>

<div class="grid2">
<div>
  <h2>Combat</h2>
  <div class="stat-row"><span>HP</span><strong>${o.current_hp}/${o.max_hp}${o.temp_hp > 0 ? ` (+${o.temp_hp} temp)` : ''}</strong></div>
  <div class="stat-row"><span>Armor Class</span><strong>${o.armor_class}</strong></div>
  <div class="stat-row"><span>Speed</span><strong>${o.speed} ft</strong></div>
  <div class="stat-row"><span>Initiative</span><strong>${modStr(calcMod(abs.DEX || 10))}</strong></div>
  <div class="stat-row"><span>Hit Dice</span><strong>${o.hit_dice_total}${o.hit_dice_used > 0 ? ` (${o.hit_dice_used} used)` : ''}</strong></div>
  <div class="stat-row"><span>Proficiency</span><strong>+${Math.ceil(1 + (o.level || 1) / 4)}</strong></div>
  ${o.exhaustion_level > 0 ? `<div class="stat-row"><span>Exhaustion</span><strong>Level ${o.exhaustion_level}</strong></div>` : ''}
  ${saves.length > 0 ? `<div class="stat-row"><span>Save Prof.</span><strong>${saves.join(', ')}</strong></div>` : ''}
</div>
<div>
  <h2>Skills</h2>
  ${skillRows || '<div class="dim">No proficiencies</div>'}
</div>
</div>

${attacks ? `<h2>Attacks</h2><table><tr><th>Name</th><th>Hit</th><th>Damage</th><th>Range</th></tr>${attacks}</table>` : ''}

${features ? `<h2>Features & Traits</h2><div>${features}</div>` : ''}

${spellBlock ? `<h2>Spellbook</h2>${spellBlock}` : ''}

<div class="grid2">
${inventory ? `<div><h2>Inventory</h2>${inventory}${coins.length > 0 ? `<div style="margin-top:4px"><strong>Currency:</strong> ${coins.join(', ')}</div>` : ''}</div>` : '<div></div>'}
<div>
${personality ? `<h2>Personality</h2><div class="personality">${personality}</div>` : ''}
${bs.backstory_text ? `<h2>Backstory</h2><div class="feat-desc">${bs.backstory_text.substring(0, 600)}${bs.backstory_text.length > 600 ? '...' : ''}</div>` : ''}
</div>
</div>

<div class="footer">Generated by The Codex &mdash; D&D Companion</div>
</body></html>`;
}

function buildImportSummary(data) {
  const items = [];
  const warnings = [];

  // Overview
  if (data.overview) {
    const o = data.overview;
    items.push({ label: 'Character', value: `${o.name || 'Unnamed'} — Level ${o.level || '?'} ${o.primary_class || 'Unknown'}` });
    if (o.current_hp != null) items.push({ label: 'HP', value: `${o.current_hp}/${o.max_hp}${o.temp_hp > 0 ? ` (+${o.temp_hp} temp)` : ''}` });
  }

  // Ability scores
  const abs = data.ability_scores;
  if (abs && typeof abs === 'object') {
    const count = Object.keys(abs).filter(k => abs[k] != null).length;
    items.push({ label: 'Ability scores', value: `${count} scores imported` });
  }

  // Features
  if (data.features?.length > 0) {
    items.push({ label: 'Features & traits', value: `${data.features.length} imported` });
  }

  // Spells
  const spells = data.spells || [];
  if (spells.length > 0) {
    const cantrips = spells.filter(s => s.level === 0).length;
    const leveled = spells.length - cantrips;
    items.push({ label: 'Spells', value: `${spells.length} total (${cantrips} cantrips, ${leveled} leveled)` });
    if (data.spell_slots?.length > 0) {
      warnings.push(`${spells.length} spells imported — verify spell slots and prepared spells`);
    } else {
      warnings.push(`${spells.length} spells imported — no spell slot data found, verify manually`);
    }
  }

  // Attacks
  if (data.attacks?.length > 0) {
    items.push({ label: 'Attacks', value: `${data.attacks.length} imported` });
    warnings.push(`${data.attacks.length} attacks imported — verify attack bonuses and damage dice`);
  }

  // Inventory
  if (data.inventory?.length > 0) {
    const attuned = data.inventory.filter(i => i.attuned).length;
    const equipped = data.inventory.filter(i => i.equipped).length;
    items.push({ label: 'Equipment', value: `${data.inventory.length} items (${equipped} equipped, ${attuned} attuned)` });
    if (attuned > 0) {
      warnings.push(`${attuned} attuned items imported — check attunement limit (usually 3)`);
    }
  }

  // Currency
  if (data.currency) {
    const c = data.currency;
    const coins = [];
    if (c.pp > 0) coins.push(`${c.pp} PP`);
    if (c.gp > 0) coins.push(`${c.gp} GP`);
    if (c.ep > 0) coins.push(`${c.ep} EP`);
    if (c.sp > 0) coins.push(`${c.sp} SP`);
    if (c.cp > 0) coins.push(`${c.cp} CP`);
    if (coins.length > 0) items.push({ label: 'Currency', value: coins.join(', ') });
  }

  // Backstory
  if (data.backstory) {
    const bs = data.backstory;
    const parts = [];
    if (bs.backstory_text) parts.push('backstory');
    if (bs.personality_traits) parts.push('personality');
    if (bs.ideals) parts.push('ideals');
    if (bs.bonds) parts.push('bonds');
    if (bs.flaws) parts.push('flaws');
    if (parts.length > 0) items.push({ label: 'Backstory', value: parts.join(', ') });
  }

  // Skills
  const profSkills = data.skills?.filter(s => s.proficient) || [];
  if (profSkills.length > 0) {
    items.push({ label: 'Skill proficiencies', value: `${profSkills.length} proficient` });
  }

  // Quests
  if (data.quests?.length > 0) {
    items.push({ label: 'Quests', value: `${data.quests.length} imported` });
  }

  // NPCs
  if (data.npcs?.length > 0) {
    items.push({ label: 'NPCs', value: `${data.npcs.length} imported` });
  }

  // Conditions
  if (data.active_conditions?.length > 0) {
    items.push({ label: 'Active conditions', value: data.active_conditions.join(', ') });
    warnings.push(`${data.active_conditions.length} active conditions imported — verify they still apply`);
  }

  return { items, warnings };
}

export default function ExportImport({ characterId, character }) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [fileSizeEstimate, setFileSizeEstimate] = useState(null);
  const [importSummary, setImportSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    exportCharacter(characterId).then(data => {
      if (cancelled) return;
      const bytes = new Blob([JSON.stringify(data, null, 2)]).size;
      if (bytes < 1024) setFileSizeEstimate(`~${bytes} B`);
      else setFileSizeEstimate(`~${Math.round(bytes / 1024)} KB`);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [characterId]);

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const data = await exportCharacter(characterId);
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `${(character?.name || 'character').replace(/\s+/g, '_')}_export.json`;

      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'JSON Character Export', accept: { 'application/json': ['.json'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(jsonString);
          await writable.close();
          toast.success('Character exported!');
        } catch (err) {
          if (err.name !== 'AbortError') toast.error('Export failed: ' + err.message);
        }
      } else {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Character exported to Downloads folder');
      }
    } catch (err) {
      toast.error(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportText = async () => {
    setExporting(true);
    try {
      const data = await exportCharacter(characterId);
      const text = generateTextSummary(data);
      const fileName = `${(character?.name || 'character').replace(/\s+/g, '_')}_sheet.txt`;

      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'Text Character Sheet', accept: { 'text/plain': ['.txt'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(text);
          await writable.close();
          toast.success('Character sheet exported!');
        } catch (err) {
          if (err.name !== 'AbortError') toast.error('Export failed: ' + err.message);
        }
      } else {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Character sheet exported to Downloads folder');
      }
    } catch (err) {
      toast.error(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const data = await exportCharacter(characterId);
      const html = generatePdfHtml(data);
      const printWindow = window.open('', '_blank', 'width=800,height=1000');
      if (!printWindow) { toast.error('Pop-up blocked — please allow pop-ups for PDF export'); return; }
      printWindow.document.write(html);
      printWindow.document.close();
      // Wait for content to render then trigger print dialog
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
      toast.success('Print dialog opened — choose "Save as PDF"');
    } catch (err) {
      toast.error(`PDF export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const data = await exportCharacter(characterId);
      const text = generateTextSummary(data);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Character sheet copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(`Copy failed: ${err.message}`);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error('File is not valid JSON'); }
      if (!data || typeof data !== 'object') throw new Error('Invalid character file format');
      setPendingImport(data);
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    setImporting(true);
    try {
      await invoke('import_character', { characterId, payload: pendingImport });
      toast.success('Character imported successfully!');
      const summary = buildImportSummary(pendingImport);
      setImportSummary(summary);
      setPendingImport(null);
      // Dispatch event so CharacterView reloads data without a full page reload
      window.dispatchEvent(new CustomEvent('codex-character-reload'));
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
        <Download size={20} />
        <div>
          <span>Export & Import</span>
          <p className="text-xs text-amber-200/40 font-normal mt-0.5">Save your character data as a file or paste-ready text. Import a previously exported character to restore or share between devices.</p>
        </div>
      </h2>

      {/* Export */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">Export Character</h3>
        <p className="text-sm text-amber-200/50 mb-4">
          Download your full character data as JSON (for reimporting) or as a readable text sheet (for sharing with DMs, other players, or AI).
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={handleExportJSON} disabled={exporting} className="btn-primary flex items-center gap-2">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileJson size={16} />}
            {exporting ? 'Exporting...' : 'Export JSON'}
          </button>
          {fileSizeEstimate && <span className="text-xs text-amber-200/30">{fileSizeEstimate}</span>}
          <button onClick={handleExportText} disabled={exporting} className="btn-secondary flex items-center gap-2">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {exporting ? 'Exporting...' : 'Export Text Sheet'}
          </button>
          <button onClick={handleExportPdf} disabled={exporting} className="btn-secondary flex items-center gap-2">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
            {exporting ? 'Preparing...' : 'Export PDF'}
          </button>
          <button onClick={handleCopyText} className="btn-secondary flex items-center gap-2">
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="card">
        <h3 className="font-display text-amber-100 mb-4">Import Character</h3>
        <p className="text-sm text-amber-200/50 mb-4">
          Import a previously exported JSON file. This will <strong className="text-amber-200/70">overwrite all current data</strong> for this character.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-primary flex items-center gap-2"
          >
            <Upload size={16} /> {importing ? 'Importing...' : 'Choose JSON File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
      <ConfirmDialog
        show={!!pendingImport}
        title="Overwrite Character?"
        message="Importing will overwrite ALL current data for this character. This cannot be undone. Are you sure?"
        warning={pendingImport?.overview?.name ? `Importing: ${pendingImport.overview.name} (Level ${pendingImport.overview.level || '?'})` : undefined}
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />

      {/* Post-import review checklist */}
      {importSummary && (
        <div className="card" style={{ marginTop: '16px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.04)' }}>
          <h3 className="font-display text-amber-100 mb-3 flex items-center gap-2">
            <ClipboardCheck size={16} className="text-emerald-400" />
            Import Review
          </h3>

          {/* Imported data summary */}
          <div style={{ marginBottom: importSummary.warnings.length > 0 ? '14px' : '0' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={12} className="text-emerald-400" /> Imported Data
            </div>
            <div style={{ display: 'grid', gap: '4px' }}>
              {importSummary.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings / items needing review */}
          {importSummary.warnings.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(251,191,36,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={12} /> May Need Review
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                {importSummary.warnings.map((warning, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.1)', fontSize: '11px', color: 'rgba(251,191,36,0.7)', lineHeight: 1.4 }}>
                    <span style={{ marginTop: '1px', flexShrink: 0 }}>&#8226;</span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setImportSummary(null)}
            style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-ui)', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

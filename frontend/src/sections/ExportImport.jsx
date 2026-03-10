import { useState, useRef } from 'react';
import { Download, Upload, FileJson, FileText, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportCharacter } from '../api/export';
import { invoke } from '@tauri-apps/api/core';

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
  const modStr = (score) => { const m = Math.floor((score - 10) / 2); return m >= 0 ? `+${m}` : `${m}`; };
  const abOrder = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  abOrder.forEach(ab => {
    const score = abs[ab] || 10;
    lines.push(`  ${ab}: ${score} (${modStr(score)})`);
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
  lines.push(`  AC: ${o.armor_class}  |  Speed: ${o.speed}ft  |  Initiative: ${modStr(abs.DEX ? Math.floor((abs.DEX - 10) / 2) : 0)}`);
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
      lines.push(`  Slots: ${data.spell_slots.map(s => `Lv${s.level}: ${s.max - s.used}/${s.max}`).join('  ')}`);
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

export default function ExportImport({ characterId, character }) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

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

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const result = await invoke('import_character', { characterId, payload: data });

      toast.success('Character imported successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportJSON} disabled={exporting} className="btn-primary flex items-center gap-2">
            <FileJson size={16} /> Export JSON
          </button>
          <button onClick={handleExportText} disabled={exporting} className="btn-secondary flex items-center gap-2">
            <FileText size={16} /> Export Text Sheet
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
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

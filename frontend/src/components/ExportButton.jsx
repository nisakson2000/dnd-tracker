import { useState } from 'react';
import { FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOverview } from '../api/overview';
import { getAttacks, getConditions } from '../api/combat';
import { getSpells, getSpellSlots } from '../api/spells';
import { getItems, getCurrency } from '../api/inventory';
import { getFeatures } from '../api/features';
import { getBackstory } from '../api/backstory';
import { exportCharacterPDF } from '../utils/characterExport';

/**
 * Small button that loads all character data and opens a printable PDF view.
 * @param {{ characterId: string }} props
 */
export default function ExportButton({ characterId }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!characterId) return;
    setLoading(true);
    try {
      const [
        overviewData,
        attacks,
        conditions,
        spells,
        spellSlots,
        items,
        currency,
        features,
        backstory,
      ] = await Promise.all([
        getOverview(characterId),
        getAttacks(characterId),
        getConditions(characterId),
        getSpells(characterId),
        getSpellSlots(characterId),
        getItems(characterId),
        getCurrency(characterId),
        getFeatures(characterId),
        getBackstory(characterId),
      ]);

      const ov = overviewData.overview || {};

      // Calculate proficiency bonus from level
      const level = ov.level || 1;
      let proficiencyBonus = 2;
      if (level >= 17) proficiencyBonus = 6;
      else if (level >= 13) proficiencyBonus = 5;
      else if (level >= 9) proficiencyBonus = 4;
      else if (level >= 5) proficiencyBonus = 3;

      exportCharacterPDF({
        name: ov.name,
        race: ov.race,
        primaryClass: ov.primary_class,
        secondaryClass: ov.secondary_class,
        level,
        hp: ov.current_hp ?? ov.hp ?? 0,
        maxHp: ov.max_hp ?? 0,
        tempHp: ov.temp_hp ?? 0,
        ac: ov.armor_class ?? ov.ac ?? 10,
        speed: ov.speed ?? 30,
        proficiencyBonus,
        abilityScores: overviewData.ability_scores || [],
        savingThrows: overviewData.saving_throws || [],
        skills: overviewData.skills || [],
        attacks: attacks || [],
        spells: spells || [],
        spellSlots: spellSlots || {},
        features: features || [],
        items: items || [],
        currency: currency || {},
        backstory: backstory || {},
        conditions: conditions || [],
        inspiration: ov.inspiration || false,
        spellcastingAbility: ov.spellcasting_ability || '',
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(`Export failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn-secondary text-xs flex items-center gap-1"
      title="Export character sheet as PDF"
    >
      <FileDown size={14} />
      {loading ? 'Loading...' : 'Export PDF'}
    </button>
  );
}

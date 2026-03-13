import { useMemo } from 'react';
import SpellStatBlock from './SpellStatBlock';
import MonsterStatBlock from './MonsterStatBlock';
import ClassStatBlock from './ClassStatBlock';
import EquipmentStatBlock from './EquipmentStatBlock';
import RaceStatBlock from './RaceStatBlock';

const CATEGORY_MAP = {
  'spells':      SpellStatBlock,
  'monsters':    MonsterStatBlock,
  'classes':     ClassStatBlock,
  'equipment':   EquipmentStatBlock,
  'magic-items': EquipmentStatBlock,
  'tools':       EquipmentStatBlock,
  'races':       RaceStatBlock,
};

/**
 * Generic fallback for categories without a dedicated stat block.
 * Renders metadata as a simple label/value list.
 */
function GenericMetadataPanel({ metadata }) {
  if (!metadata || typeof metadata !== 'object') return null;
  const entries = Object.entries(metadata).filter(
    ([, v]) => v !== null && v !== undefined && v !== '',
  );
  if (entries.length === 0) return null;

  return (
    <div className="card-grimoire mt-6">
      <h4 className="font-display text-sm text-amber-200/60 mb-3 uppercase tracking-wider">
        Details
      </h4>
      <dl className="space-y-2">
        {entries.map(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          let display;
          if (Array.isArray(value)) {
            display = value.join(', ');
          } else if (typeof value === 'object') {
            display = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
          } else if (typeof value === 'boolean') {
            display = value ? 'Yes' : 'No';
          } else {
            display = String(value);
          }
          return (
            <div key={key}>
              <dt className="text-xs text-amber-200/40 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-amber-200/70">{display}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/**
 * Routes to the correct stat block component based on article category.
 *
 * @param {string} category - The article category slug
 * @param {string|object} metadata - Raw metadata_json string or pre-parsed object
 */
export default function StatBlockRouter({ category, metadata }) {
  const parsed = useMemo(() => {
    if (!metadata) return null;
    if (typeof metadata === 'object') return metadata;
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  }, [metadata]);

  if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) {
    return null;
  }

  const key = (category || '').toLowerCase().replace(/\s+/g, '-');
  const Component = CATEGORY_MAP[key] || GenericMetadataPanel;

  return <Component metadata={parsed} />;
}

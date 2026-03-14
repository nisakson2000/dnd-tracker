import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen, Download, Globe, Users, Map, Scroll, Search, Clock,
  ChevronDown, ChevronUp, Loader2, CheckCircle2, AlertTriangle,
  ExternalLink, Package, RefreshCw, Sparkles, Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { addNPC } from '../api/npcs';
import { addQuest } from '../api/quests';
import { addLoreNote } from '../api/lore';
import { addJournalEntry } from '../api/journal';
import { addItem } from '../api/inventory';
import { getOverview, updateOverview } from '../api/overview';

// Bundled starter adventures
import goblinMine from '../data/campaigns/goblin-mine.json';
import cursedVillage from '../data/campaigns/cursed-village.json';
import dragonCoast from '../data/campaigns/dragon-coast.json';
import feywildCrossing from '../data/campaigns/feywild-crossing.json';
import shadowAcademy from '../data/campaigns/shadow-academy.json';
import siegeOfIronhold from '../data/campaigns/siege-of-ironhold.json';

const BUNDLED_CAMPAIGNS = [
  goblinMine, cursedVillage, dragonCoast,
  feywildCrossing, shadowAcademy, siegeOfIronhold,
];

const LEVEL_COLORS = {
  '1-3': { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  '3-5': { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  '5-8': { bg: 'rgba(249,115,22,0.12)', text: '#fb923c', border: 'rgba(249,115,22,0.25)' },
};

const TAG_ICONS = {
  starter: Sparkles,
  mystery: Search,
  dragon: Sparkles,
  'dungeon crawl': Map,
  undead: AlertTriangle,
  coastal: Globe,
  intrigue: Users,
  investigation: Search,
  goblins: Users,
  naval: Globe,
};

// ── GitHub adventure browser helpers ──

const HOMEBREW_API_URL = 'https://api.github.com/repos/TheGiddyLimit/homebrew/contents/adventure';

async function fetchAdventureList() {
  const resp = await fetch(HOMEBREW_API_URL);
  if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
  const files = await resp.json();
  return files
    .filter(f => f.name.endsWith('.json'))
    .map(f => ({
      name: f.name.replace(/\.json$/, '').replace(/[_-]/g, ' '),
      fileName: f.name,
      downloadUrl: f.download_url,
      size: f.size,
    }));
}

async function fetchAndParseAdventure(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch adventure: ${resp.status}`);
  return resp.json();
}

/**
 * Parse a 5etools homebrew adventure JSON into our data structures.
 * The homebrew format varies, so we extract what we can.
 */
function parse5etoolsAdventure(data) {
  const npcs = [];
  const quests = [];
  const lore = [];
  const journals = [];

  // Extract monsters/creatures as NPCs
  if (data.monster && Array.isArray(data.monster)) {
    for (const m of data.monster.slice(0, 20)) {
      npcs.push({
        name: m.name || 'Unknown Creature',
        role: m.type?.type || m.type || 'Monster',
        race: typeof m.type === 'string' ? m.type : (m.type?.type || 'Unknown'),
        npc_class: `CR ${m.cr?.cr || m.cr || '?'}`,
        location: m.environment?.join(', ') || '',
        description: extractFluffText(m.fluff || m.entries) || `A ${m.size || ''}${m.type?.type || m.type || 'creature'}.`,
        notes: '',
        status: 'alive',
      });
    }
  }

  // Extract NPCs from adventure data
  if (data.npc && Array.isArray(data.npc)) {
    for (const n of data.npc) {
      npcs.push({
        name: n.name || 'Unknown NPC',
        role: n.role || 'NPC',
        race: n.race || 'Unknown',
        npc_class: n.class || '',
        location: n.location || '',
        description: extractFluffText(n.entries || n.description) || '',
        notes: '',
        status: 'alive',
      });
    }
  }

  // Extract adventure chapters as lore + quest hooks
  if (data.adventure && Array.isArray(data.adventure)) {
    for (const adv of data.adventure) {
      if (adv.name) {
        lore.push({
          title: adv.name,
          category: 'History',
          body: extractFluffText(adv.entries) || adv.name,
          related_to: '',
        });
      }
    }
  }

  // Extract adventure data entries as lore
  if (data.adventureData && Array.isArray(data.adventureData)) {
    for (const ad of data.adventureData) {
      if (ad.data && Array.isArray(ad.data)) {
        for (const chapter of ad.data) {
          if (chapter.name && chapter.entries) {
            const body = extractFluffText(chapter.entries);
            if (body && body.length > 20) {
              lore.push({
                title: chapter.name,
                category: 'Location',
                body: body.substring(0, 2000),
                related_to: ad.name || '',
              });
            }
            // Extract sub-entries as quests/plot hooks
            if (Array.isArray(chapter.entries)) {
              for (const entry of chapter.entries) {
                if (entry && typeof entry === 'object' && entry.name && entry.type === 'section') {
                  quests.push({
                    title: entry.name,
                    giver: '',
                    description: extractFluffText(entry.entries) || entry.name,
                    status: 'active',
                    notes: `From chapter: ${chapter.name}`,
                    objectives: [{ text: `Complete: ${entry.name}`, completed: false }],
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Extract items as lore
  if (data.item && Array.isArray(data.item)) {
    for (const item of data.item.slice(0, 10)) {
      lore.push({
        title: item.name || 'Unknown Item',
        category: 'Item',
        body: extractFluffText(item.entries) || `${item.rarity || ''} ${item.type || 'item'}`.trim(),
        related_to: '',
      });
    }
  }

  // Extract spells as lore
  if (data.spell && Array.isArray(data.spell)) {
    for (const spell of data.spell.slice(0, 10)) {
      lore.push({
        title: spell.name || 'Unknown Spell',
        category: 'Magic',
        body: extractFluffText(spell.entries) || `Level ${spell.level || '?'} spell.`,
        related_to: '',
      });
    }
  }

  // Create a summary journal entry
  const advName = data.adventure?.[0]?.name || data._meta?.sources?.[0]?.full || 'Imported Adventure';
  journals.push({
    title: `Campaign Import: ${advName}`,
    session_number: 0,
    body: `## Imported Adventure: ${advName}\n\nImported ${npcs.length} NPCs, ${quests.length} quests, and ${lore.length} lore entries from the 5etools homebrew repository.\n\n${data.adventure?.[0]?.entries ? extractFluffText(data.adventure[0].entries).substring(0, 500) : ''}`,
    tags: 'import,homebrew',
    npcs_mentioned: npcs.slice(0, 5).map(n => n.name).join(','),
  });

  return { npcs, quests, lore, journals };
}

function extractFluffText(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return entries;
  if (Array.isArray(entries)) {
    return entries
      .map(e => {
        if (typeof e === 'string') return e;
        if (e && typeof e === 'object') {
          if (e.entries) return extractFluffText(e.entries);
          if (e.text) return e.text;
          if (e.name && e.entries) return `**${e.name}**: ${extractFluffText(e.entries)}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }
  return '';
}

// ── Import logic ──

async function importCampaignData(characterId, campaign, onProgress) {
  const results = { npcs: 0, quests: 0, lore: 0, journal: 0, items: 0, errors: [] };
  const total =
    (campaign.npcs?.length || 0) +
    (campaign.quests?.length || 0) +
    (campaign.lore?.length || 0) +
    (campaign.items?.length || 0) +
    (campaign.journal ? 1 : campaign.journals?.length || 0);
  let done = 0;

  const tick = () => {
    done++;
    onProgress?.(Math.round((done / total) * 100));
  };

  // Import NPCs
  for (const npc of campaign.npcs || []) {
    try {
      await addNPC(characterId, {
        name: npc.name,
        role: npc.role || '',
        race: npc.race || '',
        npc_class: npc.npc_class || '',
        location: npc.location || '',
        description: npc.description || '',
        notes: npc.notes || '',
        status: npc.status || 'alive',
      });
      results.npcs++;
    } catch (err) {
      results.errors.push(`NPC "${npc.name}": ${err.message || err}`);
    }
    tick();
  }

  // Import quests
  for (const quest of campaign.quests || []) {
    try {
      await addQuest(characterId, {
        title: quest.title,
        giver: quest.giver || '',
        description: quest.description || '',
        status: quest.status || 'active',
        notes: quest.notes || '',
        objectives: (quest.objectives || []).map(o => ({
          text: o.text,
          completed: o.completed || false,
        })),
      });
      results.quests++;
    } catch (err) {
      results.errors.push(`Quest "${quest.title}": ${err.message || err}`);
    }
    tick();
  }

  // Import lore
  for (const note of campaign.lore || []) {
    try {
      await addLoreNote(characterId, {
        title: note.title,
        category: note.category || 'Custom',
        body: note.body || '',
        related_to: note.related_to || '',
      });
      results.lore++;
    } catch (err) {
      results.errors.push(`Lore "${note.title}": ${err.message || err}`);
    }
    tick();
  }

  // Import journal entries
  const journalEntries = campaign.journals || (campaign.journal ? [campaign.journal] : []);
  for (const entry of journalEntries) {
    try {
      await addJournalEntry(characterId, {
        title: entry.title,
        session_number: entry.session_number ?? 0,
        real_date: entry.real_date || new Date().toISOString().split('T')[0],
        ingame_date: entry.ingame_date || '',
        body: entry.body || '',
        tags: entry.tags || '',
        npcs_mentioned: entry.npcs_mentioned || '',
        pinned: entry.pinned || 0,
      });
      results.journal++;
    } catch (err) {
      results.errors.push(`Journal "${entry.title}": ${err.message || err}`);
    }
    tick();
  }

  // Import items
  for (const item of campaign.items || []) {
    try {
      await addItem(characterId, {
        name: item.name,
        item_type: item.item_type || 'misc',
        weight: item.weight || 0,
        value_gp: item.value_gp || 0,
        quantity: item.quantity || 1,
        description: item.description || '',
        attunement: item.attunement || false,
        attuned: false,
        equipped: false,
        equipment_slot: item.equipment_slot || 'misc',
        stat_modifiers: typeof item.stat_modifiers === 'object'
          ? JSON.stringify(item.stat_modifiers)
          : item.stat_modifiers || '{}',
        rarity: item.rarity || 'common',
      });
      results.items++;
    } catch (err) {
      results.errors.push(`Item "${item.name}": ${err.message || err}`);
    }
    tick();
  }

  // Set campaign_name on the character overview so the Campaign Map can match premade maps
  if (campaign.name) {
    try {
      const overviewData = await getOverview(characterId);
      if (overviewData?.overview) {
        await updateOverview(characterId, {
          ...overviewData.overview,
          campaign_name: campaign.name,
        });
      }
    } catch {
      // Non-critical — map matching will fall back to homebrew extraction
    }
  }

  return results;
}

// ── Components ──

function CampaignCard({ campaign, onLoad, loading, isBundled }) {
  const [expanded, setExpanded] = useState(false);
  const levelColor = LEVEL_COLORS[campaign.level] || LEVEL_COLORS['1-3'];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'calc(15px * var(--font-scale, 1))',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}>
                {campaign.name}
              </h3>
              <span style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: levelColor.bg,
                color: levelColor.text,
                border: `1px solid ${levelColor.border}`,
                whiteSpace: 'nowrap',
              }}>
                Lv {campaign.level}
              </span>
              {campaign.ruleset && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: campaign.ruleset === '5e 2024'
                    ? 'rgba(96,165,250,0.12)' : 'rgba(251,191,36,0.12)',
                  color: campaign.ruleset === '5e 2024' ? '#60a5fa' : '#fbbf24',
                  border: `1px solid ${campaign.ruleset === '5e 2024'
                    ? 'rgba(96,165,250,0.25)' : 'rgba(251,191,36,0.25)'}`,
                  whiteSpace: 'nowrap',
                }}>
                  <Shield size={9} />
                  {campaign.ruleset}
                </span>
              )}
              {isBundled && (
                <span style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(139,92,246,0.12)',
                  color: '#a78bfa',
                  border: '1px solid rgba(139,92,246,0.25)',
                  letterSpacing: '0.05em',
                }}>
                  BUNDLED
                </span>
              )}
            </div>

            {campaign.author && (
              <div style={{
                fontSize: 'calc(11px * var(--font-scale, 1))',
                color: 'var(--text-mute)',
                fontFamily: 'var(--font-ui)',
                marginBottom: '6px',
              }}>
                by {campaign.author}
              </div>
            )}

            <p style={{
              fontSize: 'calc(12px * var(--font-scale, 1))',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {expanded ? campaign.description : (campaign.summary || campaign.description?.substring(0, 150) + (campaign.description?.length > 150 ? '...' : ''))}
            </p>
          </div>
        </div>

        {/* Tags */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {campaign.tags.map(tag => {
              const TagIcon = TAG_ICONS[tag] || Package;
              return (
                <span key={tag} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-ui)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-mute)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <TagIcon size={9} />
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Content preview */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '10px',
            padding: '4px 0',
            background: 'none',
            border: 'none',
            color: 'var(--text-mute)',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-dim)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>

        {expanded && (
          <div style={{ marginTop: '10px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={13} style={{ color: '#c9a84c' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                {campaign.npcs?.length || 0} NPCs
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Map size={13} style={{ color: '#c9a84c' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                {campaign.quests?.length || 0} Quests
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} style={{ color: '#c9a84c' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                {campaign.lore?.length || 0} Lore entries
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scroll size={13} style={{ color: '#c9a84c' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
                {(campaign.journal ? 1 : campaign.journals?.length || 0)} Journal {(campaign.journal ? 1 : campaign.journals?.length || 0) === 1 ? 'entry' : 'entries'}
              </span>
            </div>
          </div>
          {/* Quest count & estimated time badges */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px',
              background: 'rgba(167,139,250,0.08)', color: 'rgba(167,139,250,0.7)', border: '1px solid rgba(167,139,250,0.15)',
            }}>
              <Scroll size={10} /> {campaign.quests?.length || 0} Quests
            </span>
            {(() => {
              const qLen = campaign.quests?.length || 0;
              const estMin = Math.max(2, qLen * 2);
              const estMax = Math.max(4, qLen * 4);
              const sessions = Math.max(1, Math.round((estMin + estMax) / 2 / 3.5));
              return (
                <>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px',
                    background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.6)', border: '1px solid rgba(201,168,76,0.15)',
                  }}>
                    <Clock size={10} /> ~{estMin}-{estMax} hrs
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px',
                    background: 'rgba(74,222,128,0.08)', color: 'rgba(74,222,128,0.6)', border: '1px solid rgba(74,222,128,0.15)',
                  }}>
                    ~{sessions} sessions
                  </span>
                </>
              );
            })()}
          </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
      }}>
        <button
          onClick={() => onLoad(campaign)}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(201,168,76,0.4)',
            background: loading ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.12)',
            color: loading ? 'rgba(201,168,76,0.5)' : '#c9a84c',
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'; } }}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; } }}
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {loading ? 'Importing...' : 'Load Campaign'}
        </button>
      </div>
    </div>
  );
}

function ImportSummary({ results, onDismiss }) {
  const hasErrors = results.errors.length > 0;
  return (
    <div style={{
      padding: '16px 18px',
      background: hasErrors ? 'rgba(249,115,22,0.06)' : 'rgba(74,222,128,0.06)',
      border: `1px solid ${hasErrors ? 'rgba(249,115,22,0.2)' : 'rgba(74,222,128,0.2)'}`,
      borderRadius: '10px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {hasErrors ? (
          <AlertTriangle size={16} style={{ color: '#fb923c' }} />
        ) : (
          <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
        )}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 600,
          color: hasErrors ? '#fb923c' : '#4ade80',
        }}>
          {hasErrors ? 'Import completed with warnings' : 'Import successful!'}
        </span>
        <button
          onClick={onDismiss}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: 'var(--text-mute)',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Dismiss
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: hasErrors ? '10px' : 0 }}>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
          <strong>{results.npcs}</strong> NPCs
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
          <strong>{results.quests}</strong> Quests
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
          <strong>{results.lore}</strong> Lore entries
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
          <strong>{results.journal}</strong> Journal entries
        </span>
        {results.items > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)' }}>
            <strong>{results.items}</strong> Items
          </span>
        )}
      </div>

      {hasErrors && (
        <div style={{
          fontSize: '11px',
          color: '#fb923c',
          fontFamily: 'var(--font-mono)',
          maxHeight: '100px',
          overflowY: 'auto',
          padding: '6px 8px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '6px',
        }}>
          {results.errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main section ──

const RULESET_FILTERS = [
  { id: 'all', label: 'All' },
  { id: '5e 2014', label: '5e 2014' },
  { id: '5e 2024', label: '5e 2024' },
];

export default function PremadeCampaigns({ characterId }) {
  const [tab, setTab] = useState('bundled'); // 'bundled' | 'community'
  const [rulesetFilter, setRulesetFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [importingId, setImportingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  // Community adventures state
  const [communityList, setCommunityList] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState(null);
  const [previewData, setPreviewData] = useState({}); // { [fileName]: { summary, loading } }
  const previewCacheRef = useRef({});

  const loadCommunityList = useCallback(async () => {
    setCommunityLoading(true);
    setCommunityError(null);
    try {
      const list = await fetchAdventureList();
      setCommunityList(list);
    } catch (err) {
      setCommunityError(err.message);
    } finally {
      setCommunityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'community' && communityList.length === 0 && !communityLoading) {
      loadCommunityList();
    }
  }, [tab]);

  const fetchPreview = useCallback(async (adv) => {
    if (previewCacheRef.current[adv.fileName]) {
      setPreviewData(p => ({ ...p, [adv.fileName]: previewCacheRef.current[adv.fileName] }));
      return;
    }
    setPreviewData(p => ({ ...p, [adv.fileName]: { loading: true } }));
    try {
      const data = await fetchAndParseAdventure(adv.downloadUrl);
      // Extract a summary from the adventure data
      const advEntry = data.adventure?.[0];
      const advName = advEntry?.name || data.name || adv.name;
      // Try to get description text
      let desc = '';
      if (advEntry?.entries) {
        const first = advEntry.entries.find(e => typeof e === 'string' || e?.entries);
        if (typeof first === 'string') desc = first;
        else if (first?.entries) {
          const inner = first.entries.find(e => typeof e === 'string');
          if (inner) desc = inner;
        }
      }
      if (!desc && data.adventure?.[0]?.id) {
        // Try adventureData
        const advData = data.adventureData?.[0];
        if (advData?.data) {
          for (const section of advData.data) {
            if (section.entries) {
              const txt = section.entries.find(e => typeof e === 'string');
              if (txt) { desc = txt; break; }
            }
          }
        }
      }
      // Count content
      const monsters = data.monster?.length || 0;
      const items = data.item?.length || 0;
      const spells = data.spell?.length || 0;
      const tables = data.table?.length || 0;
      const counts = [
        monsters && `${monsters} creatures`,
        items && `${items} items`,
        spells && `${spells} spells`,
        tables && `${tables} tables`,
      ].filter(Boolean).join(', ');

      // Count chapters for time estimation
      let chapterCount = 0;
      if (data.adventureData && Array.isArray(data.adventureData)) {
        for (const ad of data.adventureData) {
          if (ad.data && Array.isArray(ad.data)) chapterCount += ad.data.length;
        }
      }
      if (chapterCount === 0 && data.adventure && Array.isArray(data.adventure)) {
        chapterCount = data.adventure.length;
      }
      chapterCount = Math.max(chapterCount, 1);

      // Count quests from sections
      let questCount = 0;
      if (data.adventureData && Array.isArray(data.adventureData)) {
        for (const ad of data.adventureData) {
          if (ad.data && Array.isArray(ad.data)) {
            for (const chapter of ad.data) {
              if (Array.isArray(chapter.entries)) {
                for (const entry of chapter.entries) {
                  if (entry && typeof entry === 'object' && entry.name && entry.type === 'section') questCount++;
                }
              }
            }
          }
        }
      }

      const minHours = chapterCount * 2;
      const maxHours = chapterCount * 4;
      const estimatedHours = `${minHours}-${maxHours}`;
      const estimatedSessions = Math.max(1, Math.round((minHours + maxHours) / 2 / 3.5));

      const summary = {
        name: advName,
        description: desc ? (desc.length > 200 ? desc.substring(0, 200) + '...' : desc) : '',
        counts: counts || 'Adventure data available',
        questCount: questCount || null,
        estimatedHours,
        estimatedSessions,
        loading: false,
      };
      previewCacheRef.current[adv.fileName] = summary;
      setPreviewData(p => ({ ...p, [adv.fileName]: summary }));
    } catch {
      setPreviewData(p => ({ ...p, [adv.fileName]: { description: 'Could not load preview.', counts: '', loading: false } }));
    }
  }, []);

  const handleLoadBundled = async (campaign) => {
    const key = campaign.name;
    if (importingId) return;
    setImportingId(key);
    setProgress(0);
    setLastResult(null);

    try {
      const results = await importCampaignData(characterId, campaign, setProgress);
      setLastResult(results);
      if (results.errors.length === 0) {
        toast.success(`Loaded "${campaign.name}" successfully!`);
      } else {
        toast(`Imported with ${results.errors.length} warnings`, { icon: '\u26A0\uFE0F' });
      }
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setImportingId(null);
      setProgress(0);
    }
  };

  const handleLoadCommunity = async (adventure) => {
    if (importingId) return;
    setImportingId(adventure.fileName);
    setProgress(0);
    setLastResult(null);

    const toastId = toast.loading(`Downloading "${adventure.name}"...`);

    try {
      const data = await fetchAndParseAdventure(adventure.downloadUrl);
      toast.loading('Parsing adventure data...', { id: toastId });

      const parsed = parse5etoolsAdventure(data);

      if (parsed.npcs.length === 0 && parsed.quests.length === 0 && parsed.lore.length === 0) {
        toast.dismiss(toastId);
        toast('No importable data found in this adventure file', { icon: '\uD83D\uDCED' });
        setImportingId(null);
        return;
      }

      toast.loading('Importing into campaign...', { id: toastId });
      const results = await importCampaignData(characterId, parsed, setProgress);
      setLastResult(results);

      toast.dismiss(toastId);
      if (results.errors.length === 0) {
        toast.success(`Loaded "${adventure.name}" successfully!`);
      } else {
        toast(`Imported with ${results.errors.length} warnings`, { icon: '\u26A0\uFE0F' });
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setImportingId(null);
      setProgress(0);
    }
  };

  const filteredBundled = BUNDLED_CAMPAIGNS.filter(c => {
    // Ruleset filter
    if (rulesetFilter !== 'all' && c.ruleset !== rulesetFilter) return false;
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const filteredCommunity = communityList.filter(c =>
    !searchQuery.trim() ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'calc(20px * var(--font-scale, 1))',
          fontWeight: 700,
          color: 'var(--text)',
          margin: '0 0 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <BookOpen size={22} style={{ color: '#c9a84c' }} />
          Premade Campaigns
        </h2>
        <p style={{
          fontSize: 'calc(12px * var(--font-scale, 1))',
          color: 'var(--text-mute)',
          fontFamily: 'var(--font-ui)',
          margin: 0,
        }}>
          Browse and load premade adventures into your campaign. Bundled starters are ready to go; community adventures are fetched from the 5etools homebrew repo.
        </p>
      </div>

      {/* Import result banner */}
      {lastResult && (
        <ImportSummary results={lastResult} onDismiss={() => setLastResult(null)} />
      )}

      {/* Progress bar */}
      {importingId && (
        <div style={{
          marginBottom: '16px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '6px',
          overflow: 'hidden',
          height: '6px',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #c9a84c, #fbbf24)',
            borderRadius: '6px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      {/* Tabs + Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {[
            { id: 'bundled', label: 'Starter Adventures', icon: Package },
            { id: 'community', label: 'Community', icon: Globe },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                border: 'none',
                background: tab === t.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: tab === t.id ? '#c9a84c' : 'var(--text-mute)',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: tab === t.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderRight: t.id === 'bundled' ? '1px solid var(--border)' : 'none',
              }}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Ruleset filter — only shown on bundled tab */}
        {tab === 'bundled' && (
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}>
            {RULESET_FILTERS.map((rf, idx) => (
              <button
                key={rf.id}
                onClick={() => setRulesetFilter(rf.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: 'none',
                  background: rulesetFilter === rf.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: rulesetFilter === rf.id ? '#c9a84c' : 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  fontWeight: rulesetFilter === rf.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderRight: idx < RULESET_FILTERS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {rf.id !== 'all' && <Shield size={10} />}
                {rf.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-mute)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder={tab === 'bundled' ? 'Search starter adventures...' : 'Search community adventures...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 30px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text)',
              fontSize: '12px',
              fontFamily: 'var(--font-ui)',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Bundled tab */}
      {tab === 'bundled' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          {filteredBundled.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
              No adventures match your search.
            </div>
          ) : (
            filteredBundled.map(c => (
              <CampaignCard
                key={c.name}
                campaign={c}
                onLoad={handleLoadBundled}
                loading={importingId === c.name}
                isBundled
              />
            ))
          )}
        </div>
      )}

      {/* Community tab */}
      {tab === 'community' && (
        <div>
          {/* Info banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '8px',
            marginBottom: '14px',
          }}>
            <ExternalLink size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', lineHeight: 1.4 }}>
              Community adventures are fetched from the <strong>5etools homebrew repository</strong> on GitHub. Data quality varies by file. The importer will extract NPCs, quests, and lore where available.
            </span>
          </div>

          {communityLoading && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-mute)' }}>
              <Loader2 size={20} className="animate-spin" style={{ display: 'inline-block', marginBottom: '8px' }} />
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
                Fetching adventure list from GitHub...
              </div>
            </div>
          )}

          {communityError && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#fb923c',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
            }}>
              <AlertTriangle size={18} style={{ display: 'inline-block', marginBottom: '6px' }} />
              <div>Failed to load community adventures: {communityError}</div>
              <button
                onClick={loadCommunityList}
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(249,115,22,0.3)',
                  background: 'rgba(249,115,22,0.08)',
                  color: '#fb923c',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          {!communityLoading && !communityError && (
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredCommunity.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
                  {searchQuery ? 'No adventures match your search.' : 'No adventures found.'}
                </div>
              ) : (
                filteredCommunity.map(adv => {
                  const preview = previewData[adv.fileName];
                  const isExpanded = !!preview && !preview.loading;
                  return (
                  <div
                    key={adv.fileName}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'calc(13px * var(--font-scale, 1))',
                          fontWeight: 600,
                          color: 'var(--text)',
                          textTransform: 'capitalize',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {preview?.name || adv.name}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: 'var(--text-mute)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {adv.fileName} {adv.size ? `(${Math.round(adv.size / 1024)}KB)` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        <button
                          onClick={() => preview ? setPreviewData(p => { const n = { ...p }; delete n[adv.fileName]; return n; }) : fetchPreview(adv)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-dim)',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          title={isExpanded ? 'Hide preview' : 'Load summary'}
                        >
                          {preview?.loading ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : isExpanded ? (
                            <ChevronUp size={10} />
                          ) : (
                            <ChevronDown size={10} />
                          )}
                          {isExpanded ? 'Less' : 'Preview'}
                        </button>

                        <button
                          onClick={() => handleLoadCommunity(adv)}
                          disabled={!!importingId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(201,168,76,0.3)',
                            background: importingId === adv.fileName ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.1)',
                            color: importingId ? 'rgba(201,168,76,0.4)' : '#c9a84c',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: importingId ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                          }}
                        >
                          {importingId === adv.fileName ? (
                            <><Loader2 size={11} className="animate-spin" /> Importing...</>
                          ) : (
                            <><Download size={11} /> Import</>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded preview */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {preview.description && (
                          <p style={{
                            fontSize: '12px',
                            color: 'var(--text-dim)',
                            fontFamily: 'var(--font-ui)',
                            lineHeight: 1.6,
                            margin: '0 0 6px 0',
                          }}>
                            {preview.description}
                          </p>
                        )}
                        {preview.counts && (
                          <div style={{
                            fontSize: '10px',
                            color: 'var(--text-mute)',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            Contains: {preview.counts}
                          </div>
                        )}
                        {(preview.questCount != null || preview.estimatedHours) && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {preview.questCount != null && (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: '4px',
                                background: 'rgba(167,139,250,0.08)', color: 'rgba(167,139,250,0.7)', border: '1px solid rgba(167,139,250,0.15)',
                              }}>
                                <Scroll size={9} /> {preview.questCount} Quests
                              </span>
                            )}
                            {preview.estimatedHours && (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: '4px',
                                background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.6)', border: '1px solid rgba(201,168,76,0.15)',
                              }}>
                                <Clock size={9} /> ~{preview.estimatedHours} hrs
                              </span>
                            )}
                            {preview.estimatedSessions != null && (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: '4px',
                                background: 'rgba(74,222,128,0.08)', color: 'rgba(74,222,128,0.6)', border: '1px solid rgba(74,222,128,0.15)',
                              }}>
                                ~{preview.estimatedSessions} sessions
                              </span>
                            )}
                          </div>
                        )}
                        {!preview.description && !preview.counts && (
                          <div style={{ fontSize: '11px', color: 'var(--text-mute)', fontStyle: 'italic' }}>
                            No description available for this adventure.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

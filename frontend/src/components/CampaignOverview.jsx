import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MapPin, Users, ScrollText, Globe, Sparkles, ChevronRight, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'npcs', label: 'NPCs', icon: Users },
  { id: 'quests', label: 'Quests', icon: ScrollText },
  { id: 'world', label: 'World', icon: Globe },
  { id: 'arcs', label: 'Arcs', icon: Sparkles },
];

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-300 border-red-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  abandoned: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {status}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-8 text-amber-200/30 text-sm">
      {message}
    </div>
  );
}

function formatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Tab Content Components ── */

function LocationTab({ campaignId, currentScene }) {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    invoke('list_scenes_player', { campaignId })
      .then((data) => setScenes(data || []))
      .catch((err) => console.error('[CampaignOverview] list_scenes_player:', err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  return (
    <div className="space-y-3">
      {/* Current scene */}
      {currentScene ? (
        <div className="bg-amber-200/[0.06] border border-amber-500/20 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-amber-400" />
            <span className="text-sm text-amber-100 font-medium">{currentScene.name}</span>
          </div>
          {currentScene.location && (
            <div className="text-xs text-amber-200/50">{currentScene.location}</div>
          )}
          {currentScene.description && (
            <p className="text-xs text-amber-200/60 leading-relaxed">{currentScene.description}</p>
          )}
          {currentScene.mood && (
            <div className="text-[10px] text-amber-300/40 italic">Mood: {currentScene.mood}</div>
          )}
        </div>
      ) : (
        <div className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-3 text-sm text-amber-200/40">
          No location set
        </div>
      )}

      {/* Previously visited */}
      {scenes.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs text-amber-200/40 uppercase tracking-wider">Previously Visited</div>
          {loading ? (
            <Loader2 size={14} className="animate-spin text-amber-300/40 mx-auto" />
          ) : (
            scenes.map((scene) => (
              <div
                key={scene.id}
                className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-2.5 flex items-start gap-2"
              >
                <ChevronRight size={12} className="text-amber-400/40 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-amber-100/70 font-medium">{scene.name || scene.scene_name}</div>
                  {(scene.location) && (
                    <div className="text-[10px] text-amber-200/40">{scene.location}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NPCsTab({ campaignId }) {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    invoke('list_campaign_npcs_player', { campaignId })
      .then((data) => setNpcs(data || []))
      .catch((err) => console.error('[CampaignOverview] list_campaign_npcs_player:', err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto mt-4" />;
  if (npcs.length === 0) return <EmptyState message="No NPCs discovered yet" />;

  return (
    <div className="space-y-2">
      {npcs.map((npc) => {
        let knownInfo = [];
        if (npc.known_info_json) {
          try {
            knownInfo = JSON.parse(npc.known_info_json);
          } catch { /* ignore */ }
        }

        return (
          <div
            key={npc.id}
            className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-100/80 font-medium">{npc.name || npc.npc_name}</span>
              {npc.role && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300/70">
                  {npc.role}
                </span>
              )}
            </div>
            {(npc.race || npc.location) && (
              <div className="text-xs text-amber-200/40">
                {[npc.race, npc.location].filter(Boolean).join(' · ')}
              </div>
            )}
            {npc.description && (
              <p className="text-xs text-amber-200/50 leading-relaxed">{npc.description}</p>
            )}
            {knownInfo.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {knownInfo.map((info, i) => (
                  <li key={i} className="text-[11px] text-amber-200/45 flex items-start gap-1.5">
                    <span className="text-amber-400/40 mt-px">•</span>
                    <span>{typeof info === 'string' ? info : info.text || JSON.stringify(info)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuestsTab({ campaignId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    invoke('list_campaign_quests_player', { campaignId })
      .then((data) => setQuests(data || []))
      .catch((err) => console.error('[CampaignOverview] list_campaign_quests_player:', err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto mt-4" />;
  if (quests.length === 0) return <EmptyState message="No quests available" />;

  return (
    <div className="space-y-2">
      {quests.map((quest) => {
        let objectives = [];
        if (quest.objectives_json) {
          try {
            objectives = JSON.parse(quest.objectives_json);
          } catch { /* ignore */ }
        }

        return (
          <div
            key={quest.id}
            className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-3 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-100/80 font-medium">{quest.title}</span>
              <StatusBadge status={quest.status || 'active'} />
            </div>
            {quest.giver && (
              <div className="text-xs text-amber-200/40">Given by: {quest.giver}</div>
            )}
            {quest.description && (
              <p className="text-xs text-amber-200/50 leading-relaxed">{quest.description}</p>
            )}
            {objectives.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {objectives.map((obj, i) => {
                  const label = typeof obj === 'string' ? obj : obj.text || obj.description || JSON.stringify(obj);
                  const done = typeof obj === 'object' && (obj.completed || obj.done);
                  return (
                    <li key={i} className="text-[11px] text-amber-200/45 flex items-start gap-1.5">
                      <span className={`mt-px ${done ? 'text-emerald-400' : 'text-amber-400/40'}`}>
                        {done ? '✓' : '○'}
                      </span>
                      <span className={done ? 'line-through text-amber-200/30' : ''}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WorldTab({ campaignId }) {
  const [worldState, setWorldState] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    invoke('get_world_state_player', { campaignId })
      .then((data) => setWorldState(data || []))
      .catch((err) => console.error('[CampaignOverview] get_world_state_player:', err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto mt-4" />;
  if (worldState.length === 0) return <EmptyState message="No world state revealed" />;

  // Group by category
  const grouped = {};
  worldState.forEach((entry) => {
    const cat = entry.category || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(entry);
  });

  const CATEGORY_LABELS = {
    general: 'General',
    politics: 'Politics',
    geography: 'Geography',
    events: 'Events',
    factions: 'Factions',
  };

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([cat, entries]) => (
        <div key={cat} className="space-y-1.5">
          <div className="text-xs text-amber-200/40 uppercase tracking-wider">
            {CATEGORY_LABELS[cat] || formatKey(cat)}
          </div>
          {entries.map((entry) => {
            let displayValue = entry.value;
            if (typeof displayValue === 'object') {
              displayValue = JSON.stringify(displayValue, null, 2);
            }
            return (
              <div
                key={entry.id || entry.key}
                className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-3 space-y-1"
              >
                <div className="text-sm text-amber-100/80 font-medium">{formatKey(entry.key)}</div>
                <div className="text-xs text-amber-200/50 whitespace-pre-wrap">{displayValue}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ArcsTab({ campaignId }) {
  const [arcs, setArcs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    invoke('list_character_arcs', { campaignId })
      .then((data) => setArcs(data || []))
      .catch((err) => console.error('[CampaignOverview] list_character_arcs:', err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <Loader2 size={16} className="animate-spin text-amber-300/40 mx-auto mt-4" />;
  if (arcs.length === 0) return <EmptyState message="No character arcs yet" />;

  return (
    <div className="space-y-2">
      {arcs.map((arc) => (
        <div
          key={arc.id}
          className="bg-amber-200/[0.03] border border-amber-200/10 rounded-lg p-3 space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-100/80 font-medium">{arc.title}</span>
            <StatusBadge status={arc.status || 'active'} />
          </div>
          {arc.character_name && (
            <div className="text-xs text-amber-200/40">{arc.character_name}</div>
          )}
          {arc.description && (
            <p className="text-xs text-amber-200/50 leading-relaxed">{arc.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ── */

export default function CampaignOverview({ campaignId, currentScene }) {
  const [activeTab, setActiveTab] = useState('location');

  if (!campaignId) {
    return (
      <div className="card p-4 text-center text-amber-200/40 text-sm">
        <Globe size={24} className="mx-auto mb-2 text-amber-200/20" />
        No campaign connected
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-3">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'border-white/5 text-amber-200/40 hover:text-amber-200/60'
              }`}
            >
              <Icon size={12} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[120px]">
        {activeTab === 'location' && <LocationTab campaignId={campaignId} currentScene={currentScene} />}
        {activeTab === 'npcs' && <NPCsTab campaignId={campaignId} />}
        {activeTab === 'quests' && <QuestsTab campaignId={campaignId} />}
        {activeTab === 'world' && <WorldTab campaignId={campaignId} />}
        {activeTab === 'arcs' && <ArcsTab campaignId={campaignId} />}
      </div>
    </div>
  );
}

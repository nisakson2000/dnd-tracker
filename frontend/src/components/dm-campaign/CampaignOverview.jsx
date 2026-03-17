import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin, Users, Scroll, BookOpen, CheckCircle, XCircle, Plus, Wand2, RefreshCw } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { generateNPC, generateQuest, generateLocation } from '../../utils/quickGenerators';

export default function CampaignOverview({ campaign, scenes, connectedPlayers, onRefresh }) {
  const [npcCount, setNpcCount] = useState(0);
  const [questCount, setQuestCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [quickGen, setQuickGen] = useState(null); // { type, data }
  const [saving, setSaving] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const [npcs, quests] = await Promise.all([
        invoke('list_campaign_npcs'),
        invoke('list_campaign_quests'),
      ]);
      setNpcCount(npcs.length);
      setQuestCount(quests.length);
    } catch (e) {
      console.error('Failed to fetch counts:', e);
    }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  const sceneCount = scenes?.length || 0;
  const sessionCount = campaign?.session_count || 0;

  // Readiness checks
  const checks = [
    { label: 'Has at least 1 scene', passed: sceneCount > 0, action: 'scene' },
    { label: 'Has at least 1 NPC', passed: npcCount > 0, action: 'npc' },
    { label: 'Has at least 1 quest', passed: questCount > 0, action: 'quest' },
    { label: 'Campaign description filled in', passed: !!(campaign?.description?.trim()), action: null },
    { label: 'At least 1 player connected', passed: (connectedPlayers?.length || 0) > 0, action: null, skippable: true },
  ];
  const allPassed = checks.filter(c => !c.skippable).every(c => c.passed);

  // Auto-collapse when all readiness checks pass
  useEffect(() => {
    if (allPassed && sceneCount > 0) setCollapsed(true);
  }, [allPassed, sceneCount]);

  // ─── Quick Generate Handlers ─────────────────────────────────────

  const handleGenerate = (type) => {
    if (type === 'npc') {
      const npc = generateNPC();
      setQuickGen({
        type: 'npc',
        data: {
          name: npc.name, role: npc.class || 'Commoner', race: npc.race,
          location: '', description: `${npc.personality}. ${npc.personalityDescription}.`,
          dmNotes: `Secret: ${npc.secret}\nQuirk: ${npc.quirk}\nMotivation: ${npc.motivation}`,
          visibility: 'dm_only',
        },
      });
    } else if (type === 'quest') {
      const quest = generateQuest();
      setQuickGen({
        type: 'quest',
        data: {
          title: quest.title, giver: quest.keyNPC,
          description: quest.description,
          objectivesJson: JSON.stringify(quest.objectives.map(o => ({ text: o, done: false }))),
          rewardXp: quest.rewards.xp, rewardGold: quest.rewards.gold,
        },
      });
    } else if (type === 'scene') {
      const loc = generateLocation();
      setQuickGen({
        type: 'scene',
        data: {
          name: loc.name,
          description: `${loc.description}\n\nFeatures:\n${loc.features.map(f => `• ${f}`).join('\n')}`,
          location: loc.type,
        },
      });
    }
  };

  const handleReroll = () => {
    if (quickGen) handleGenerate(quickGen.type);
  };

  const handleSaveGenerated = async () => {
    if (!quickGen) return;
    setSaving(true);
    try {
      const { type, data } = quickGen;
      if (type === 'npc') {
        await invoke('create_campaign_npc', data);
        toast.success(`NPC "${data.name}" created`);
      } else if (type === 'quest') {
        await invoke('create_campaign_quest', data);
        toast.success(`Quest "${data.title}" created`);
      } else if (type === 'scene') {
        await invoke('create_scene', data);
        toast.success(`Scene "${data.name}" created`);
      }
      setQuickGen(null);
      fetchCounts();
      if (onRefresh) onRefresh();
    } catch (e) {
      toast.error(`Failed to save ${quickGen.type}`);
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setQuickGen(prev => prev ? { ...prev, data: { ...prev.data, [field]: value } } : null);
  };

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div style={{
      marginBottom: '20px', borderRadius: '12px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text)',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display, "Cinzel", serif)',
          fontSize: '15px', fontWeight: 600,
        }}>
          Campaign Overview
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!collapsed && allPassed && (
            <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 500 }}>Ready</span>
          )}
          {collapsed ? <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} /> : <ChevronUp size={14} style={{ color: 'var(--text-mute)' }} />}
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 18px' }}>
              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <StatCard icon={<MapPin size={14} />} label="Scenes" value={sceneCount} />
                <StatCard icon={<Users size={14} />} label="NPCs" value={npcCount} />
                <StatCard icon={<Scroll size={14} />} label="Quests" value={questCount} />
                <StatCard icon={<BookOpen size={14} />} label="Sessions" value={sessionCount} />
              </div>

              {/* Readiness Checklist */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Readiness Checklist
                </div>
                {checks.map((check, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 0', fontSize: '12px',
                  }}>
                    {check.passed
                      ? <CheckCircle size={14} style={{ color: '#4ade80', flexShrink: 0 }} />
                      : <XCircle size={14} style={{ color: check.skippable ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.5)', flexShrink: 0 }} />
                    }
                    <span style={{
                      color: check.passed ? 'var(--text-dim)' : 'var(--text-mute)',
                      flex: 1,
                    }}>
                      {check.label}
                      {check.skippable && !check.passed && <span style={{ opacity: 0.5 }}> (optional)</span>}
                    </span>
                    {!check.passed && check.action && (
                      <button
                        onClick={() => handleGenerate(check.action)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '3px 8px', borderRadius: '6px',
                          background: 'rgba(155,89,182,0.1)',
                          border: '1px solid rgba(155,89,182,0.25)',
                          color: '#c084fc', fontSize: '10px', fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'var(--font-ui)',
                        }}
                      >
                        <Wand2 size={10} /> Generate
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick-Fill Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <QuickFillButton label="Generate NPC" onClick={() => handleGenerate('npc')} />
                <QuickFillButton label="Generate Quest" onClick={() => handleGenerate('quest')} />
                <QuickFillButton label="Generate Scene" onClick={() => handleGenerate('scene')} />
              </div>

              {/* Quick-Gen Preview */}
              <AnimatePresence>
                {quickGen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      marginTop: '12px', padding: '14px',
                      background: 'rgba(155,89,182,0.06)',
                      border: '1px solid rgba(155,89,182,0.2)',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#c084fc', textTransform: 'capitalize' }}>
                        Generated {quickGen.type}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={handleReroll} title="Re-roll" style={miniBtn}>
                          <RefreshCw size={12} />
                        </button>
                        <button onClick={() => setQuickGen(null)} style={miniBtn}>
                          <span style={{ fontSize: '11px' }}>Cancel</span>
                        </button>
                      </div>
                    </div>

                    {quickGen.type === 'npc' && (
                      <QuickNPCForm data={quickGen.data} onChange={updateField} />
                    )}
                    {quickGen.type === 'quest' && (
                      <QuickQuestForm data={quickGen.data} onChange={updateField} />
                    )}
                    {quickGen.type === 'scene' && (
                      <QuickSceneForm data={quickGen.data} onChange={updateField} />
                    )}

                    <button onClick={handleSaveGenerated} disabled={saving}
                      style={{
                        marginTop: '10px', padding: '6px 16px', borderRadius: '6px',
                        background: 'rgba(155,89,182,0.2)',
                        border: '1px solid rgba(155,89,182,0.4)',
                        color: '#c084fc', fontSize: '12px', fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-ui)',
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: '8px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center',
    }}>
      <div style={{ color: 'var(--text-mute)', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-mute)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function QuickFillButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      padding: '5px 10px', borderRadius: '6px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'var(--text-dim)', fontSize: '11px', fontWeight: 500,
      cursor: 'pointer', fontFamily: 'var(--font-ui)',
      transition: 'all 0.15s',
    }}>
      <Plus size={10} /> {label}
    </button>
  );
}

const fieldStyle = {
  width: '100%', padding: '6px 10px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '12px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  boxSizing: 'border-box',
};

const miniBtn = {
  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px', padding: '3px 6px', cursor: 'pointer',
  color: 'var(--text-mute)', display: 'flex', alignItems: 'center',
};

const fieldLabel = { fontSize: '10px', fontWeight: 600, color: 'var(--text-mute)', marginBottom: '3px' };

function QuickNPCForm({ data, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <div>
        <div style={fieldLabel}>Name</div>
        <input style={fieldStyle} value={data.name} onChange={e => onChange('name', e.target.value)} />
      </div>
      <div>
        <div style={fieldLabel}>Race</div>
        <input style={fieldStyle} value={data.race} onChange={e => onChange('race', e.target.value)} />
      </div>
      <div>
        <div style={fieldLabel}>Role / Class</div>
        <input style={fieldStyle} value={data.role} onChange={e => onChange('role', e.target.value)} />
      </div>
      <div>
        <div style={fieldLabel}>Location</div>
        <input style={fieldStyle} value={data.location} onChange={e => onChange('location', e.target.value)} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={fieldLabel}>Description</div>
        <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={2} value={data.description}
          onChange={e => onChange('description', e.target.value)} />
      </div>
    </div>
  );
}

function QuickQuestForm({ data, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={fieldLabel}>Title</div>
        <input style={fieldStyle} value={data.title} onChange={e => onChange('title', e.target.value)} />
      </div>
      <div>
        <div style={fieldLabel}>Quest Giver</div>
        <input style={fieldStyle} value={data.giver} onChange={e => onChange('giver', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div>
          <div style={fieldLabel}>XP</div>
          <input type="number" style={fieldStyle} value={data.rewardXp}
            onChange={e => onChange('rewardXp', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <div style={fieldLabel}>Gold</div>
          <input type="number" style={fieldStyle} value={data.rewardGold}
            onChange={e => onChange('rewardGold', parseInt(e.target.value) || 0)} />
        </div>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={fieldLabel}>Description</div>
        <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={2} value={data.description}
          onChange={e => onChange('description', e.target.value)} />
      </div>
    </div>
  );
}

function QuickSceneForm({ data, onChange }) {
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
        <div>
          <div style={fieldLabel}>Name</div>
          <input style={fieldStyle} value={data.name} onChange={e => onChange('name', e.target.value)} />
        </div>
        <div>
          <div style={fieldLabel}>Location Type</div>
          <input style={fieldStyle} value={data.location} onChange={e => onChange('location', e.target.value)} />
        </div>
      </div>
      <div>
        <div style={fieldLabel}>Description</div>
        <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={3} value={data.description}
          onChange={e => onChange('description', e.target.value)} />
      </div>
    </div>
  );
}

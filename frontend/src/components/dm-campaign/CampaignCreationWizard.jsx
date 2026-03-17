import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Wand2, Zap, RefreshCw, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';
import { TEMPLATES, generateStarterContent } from '../../utils/campaignTemplates';

const RULESET_OPTIONS = [
  { value: 'dnd5e-2024', label: 'D&D 5e (2024)' },
  { value: 'dnd5e-2014', label: 'D&D 5e (2014)' },
  { value: 'pf2e', label: 'Pathfinder 2e' },
  { value: 'homebrew', label: 'Homebrew' },
];

const TONE_OPTIONS = [
  'High Fantasy', 'Dark Fantasy', 'Grimdark', 'Lighthearted', 'Horror', 'Intrigue', 'Exploration',
];

const FREQUENCY_OPTIONS = ['Weekly', 'Biweekly', 'Monthly', 'Irregular'];

// ─── Shared Styles ───────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text)', fontSize: '14px',
  fontFamily: 'var(--font-ui)', outline: 'none',
  transition: 'border-color 0.15s', boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)',
  display: 'block', marginBottom: '6px',
};

const focusHandlers = {
  onFocus: e => e.target.style.borderColor = 'rgba(155,89,182,0.5)',
  onBlur: e => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CampaignCreationWizard({ show, onClose, onCreated, existingCampaign }) {
  // When existingCampaign is provided, skip creation — just add content to it
  const isAddContent = !!existingCampaign;

  // Mode: 'choose' | 'quick' | 'wizard'
  const [mode, setMode] = useState(isAddContent ? 'wizard' : 'choose');
  const [step, setStep] = useState(isAddContent ? 2 : 1);
  const [creating, setCreating] = useState(false);

  // Step 1 fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleset, setRuleset] = useState('dnd5e-2024');
  const [campaignType, setCampaignType] = useState('homebrew');
  const [tone, setTone] = useState('High Fantasy');
  const [levelMin, setLevelMin] = useState(1);
  const [levelMax, setLevelMax] = useState(5);
  const [frequency, setFrequency] = useState('Weekly');
  const [worldDesc, setWorldDesc] = useState('');

  // Step 2 fields
  const [selectedTemplate, setSelectedTemplate] = useState('short');

  // Step 3 fields
  const [generatedContent, setGeneratedContent] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // Sync state when existingCampaign changes
  useEffect(() => {
    if (existingCampaign && show) {
      setMode('wizard');
      setStep(2);
      setName(existingCampaign.name || '');
      setDescription(existingCampaign.description || '');
      setRuleset(existingCampaign.ruleset || 'dnd5e-2024');
      setCampaignType(existingCampaign.campaign_type || 'homebrew');
    }
  }, [existingCampaign, show]);

  const reset = useCallback(() => {
    setMode(isAddContent ? 'wizard' : 'choose');
    setStep(isAddContent ? 2 : 1);
    setName(''); setDescription(''); setRuleset('dnd5e-2024');
    setCampaignType('homebrew'); setTone('High Fantasy');
    setLevelMin(1); setLevelMax(5); setFrequency('Weekly');
    setWorldDesc(''); setSelectedTemplate('short');
    setGeneratedContent(null); setExpandedItems({});
    setCreating(false);
  }, [isAddContent]);

  const handleClose = () => { reset(); onClose(); };

  // ─── Quick Create (identical to old modal) ──────────────────────────

  const handleQuickCreate = async () => {
    if (!name.trim()) { toast.error('Campaign name is required'); return; }
    setCreating(true);
    try {
      const result = await invoke('create_campaign', {
        name: name.trim(), description: description.trim(),
        ruleset, campaignType,
      });
      toast.success('Campaign created!');
      handleClose();
      if (onCreated) onCreated(result);
    } catch (e) {
      toast.error('Failed to create campaign');
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  // ─── Wizard Navigation ─────────────────────────────────────────────

  const goToStep2 = () => {
    if (!name.trim()) { toast.error('Campaign name is required'); return; }
    setStep(2);
  };

  const goToStep3 = () => {
    const content = generateStarterContent(selectedTemplate, {
      partyLevel: Math.floor((levelMin + levelMax) / 2),
      tone,
    });
    setGeneratedContent(content);
    setExpandedItems({});
    setStep(3);
  };

  const rerollItem = (category, index) => {
    const content = { ...generatedContent };
    const items = [...content[category]];
    // Regenerate just that one item
    const fresh = generateStarterContent(selectedTemplate, {
      partyLevel: Math.floor((levelMin + levelMax) / 2),
      tone,
    });
    if (fresh[category] && fresh[category].length > 0) {
      items[index] = fresh[category][0];
      content[category] = items;
      setGeneratedContent(content);
    }
  };

  const removeItem = (category, index) => {
    const content = { ...generatedContent };
    content[category] = content[category].filter((_, i) => i !== index);
    setGeneratedContent(content);
  };

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Full Wizard Create ────────────────────────────────────────────

  const handleWizardCreate = async () => {
    if (!isAddContent && !name.trim()) { toast.error('Campaign name is required'); return; }
    setCreating(true);
    try {
      let campaignId;
      let result;

      if (isAddContent) {
        // Existing campaign — just select it so child commands work
        campaignId = existingCampaign.id;
        result = existingCampaign;
        await invoke('select_campaign', { campaignId });
      } else {
        // 1. Create campaign
        result = await invoke('create_campaign', {
          name: name.trim(), description: description.trim(),
          ruleset, campaignType,
        });
        campaignId = result.id;

        // 2. Select campaign (required for child commands)
        await invoke('select_campaign', { campaignId });
      }

      // 3. Save extra settings
      const settings = {
        tone, level_min: String(levelMin), level_max: String(levelMax),
        frequency, world_description: worldDesc.trim(),
        template: selectedTemplate,
      };
      for (const [key, value] of Object.entries(settings)) {
        if (value) await invoke('set_campaign_setting', { key, value });
      }

      // 4. Create scenes
      if (generatedContent?.scenes) {
        for (const s of generatedContent.scenes) {
          await invoke('create_scene', {
            name: s.name, description: s.description, location: s.location,
          });
        }
      }

      // 5. Create NPCs
      if (generatedContent?.npcs) {
        for (const n of generatedContent.npcs) {
          await invoke('create_campaign_npc', {
            name: n.name, role: n.role, race: n.race,
            location: n.location, description: n.description,
            dmNotes: n.dmNotes, visibility: n.visibility,
          });
        }
      }

      // 6. Create quests
      if (generatedContent?.quests) {
        for (const q of generatedContent.quests) {
          await invoke('create_campaign_quest', {
            title: q.title, giver: q.giver,
            description: q.description,
            objectivesJson: q.objectivesJson,
            rewardXp: q.rewardXp, rewardGold: q.rewardGold,
          });
        }
      }

      toast.success(isAddContent ? 'Starter content added!' : 'Campaign created with starter content!');
      handleClose();
      if (onCreated) onCreated(result);
    } catch (e) {
      toast.error('Failed to create campaign');
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  if (!show) return null;

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={e => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            width: '100%',
            maxWidth: mode === 'wizard' ? '640px' : '480px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'rgba(12,10,20,0.98)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '28px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display, "Cinzel", serif)',
              fontSize: '20px', fontWeight: 700,
              color: 'var(--text, #e8d9b5)', margin: 0,
            }}>
              {isAddContent ? `Add Content — Step ${step === 2 ? '1' : '2'} of 2` :
               mode === 'choose' ? 'New Campaign' :
               mode === 'quick' ? 'Quick Create' :
               `Wizard — Step ${step} of 3`}
            </h2>
            <button onClick={handleClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-mute)', padding: '4px', display: 'flex', alignItems: 'center',
            }}>
              <X size={18} />
            </button>
          </div>

          {/* ── Mode Chooser ── */}
          {mode === 'choose' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <ModeCard
                icon={<Zap size={24} />}
                title="Quick Create"
                desc="Jump right in with a basic setup"
                onClick={() => setMode('quick')}
              />
              <ModeCard
                icon={<Wand2 size={24} />}
                title="Guided Wizard"
                desc="Step-by-step with templates & generated content"
                onClick={() => setMode('wizard')}
                accent
              />
            </div>
          )}

          {/* ── Quick Create Form ── */}
          {mode === 'quick' && (
            <>
              <QuickFields
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                ruleset={ruleset} setRuleset={setRuleset}
                campaignType={campaignType} setCampaignType={setCampaignType}
                onSubmit={handleQuickCreate}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={() => setMode('choose')} style={cancelBtnStyle}>Back</button>
                <PrimaryButton onClick={handleQuickCreate} disabled={creating || !name.trim()}>
                  {creating ? 'Creating...' : 'Create Campaign'}
                </PrimaryButton>
              </div>
            </>
          )}

          {/* ── Wizard Step 1: Details ── */}
          {mode === 'wizard' && step === 1 && (
            <>
              <QuickFields
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                ruleset={ruleset} setRuleset={setRuleset}
                campaignType={campaignType} setCampaignType={setCampaignType}
              />

              {/* Tone */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={labelStyle}>Setting / Tone</span>
                <select value={tone} onChange={e => setTone(e.target.value)} style={inputStyle}>
                  {TONE_OPTIONS.map(t => (
                    <option key={t} value={t} style={{ background: '#1a1520', color: '#fff' }}>{t}</option>
                  ))}
                </select>
              </label>

              {/* Party Level Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <label>
                  <span style={labelStyle}>Party Level Min</span>
                  <input type="number" min={1} max={20} value={levelMin}
                    onChange={e => setLevelMin(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    style={inputStyle} {...focusHandlers} />
                </label>
                <label>
                  <span style={labelStyle}>Party Level Max</span>
                  <input type="number" min={1} max={20} value={levelMax}
                    onChange={e => setLevelMax(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                    style={inputStyle} {...focusHandlers} />
                </label>
              </div>

              {/* Frequency */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={labelStyle}>Session Frequency</span>
                <select value={frequency} onChange={e => setFrequency(e.target.value)} style={inputStyle}>
                  {FREQUENCY_OPTIONS.map(f => (
                    <option key={f} value={f} style={{ background: '#1a1520', color: '#fff' }}>{f}</option>
                  ))}
                </select>
              </label>

              {/* World Description */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={labelStyle}>World Description (optional)</span>
                <textarea value={worldDesc} onChange={e => setWorldDesc(e.target.value)}
                  placeholder="A 2-3 sentence pitch for your world..."
                  rows={2} style={{ ...inputStyle, resize: 'vertical' }} {...focusHandlers} />
              </label>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setMode('choose')} style={cancelBtnStyle}>Back</button>
                <PrimaryButton onClick={goToStep2} disabled={!name.trim()}>
                  Next <ChevronRight size={14} />
                </PrimaryButton>
              </div>
            </>
          )}

          {/* ── Wizard Step 2: Template Selection ── */}
          {mode === 'wizard' && step === 2 && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px', marginTop: 0 }}>
                Choose a template to generate starter content for your campaign.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    style={{
                      padding: '14px', borderRadius: '10px', textAlign: 'left',
                      background: selectedTemplate === key ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedTemplate === key ? 'rgba(155,89,182,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      fontSize: '14px', fontWeight: 600, marginBottom: '2px',
                      color: selectedTemplate === key ? '#c084fc' : 'var(--text)',
                    }}>
                      {tmpl.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                      {tmpl.subtitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-mute)', marginBottom: '6px' }}>
                      {tmpl.description}
                    </div>
                    {key !== 'blank' && (
                      <div style={{ fontSize: '10px', color: 'var(--text-mute)', lineHeight: 1.6 }}>
                        {tmpl.scenes > 0 && <span style={{ display: 'block' }}>• {tmpl.scenes} scene{tmpl.scenes > 1 ? 's' : ''}</span>}
                        {tmpl.npcs > 0 && <span style={{ display: 'block' }}>• {tmpl.npcs} NPC{tmpl.npcs > 1 ? 's' : ''}</span>}
                        {tmpl.quests > 0 && <span style={{ display: 'block' }}>• {tmpl.quests} quest{tmpl.quests > 1 ? 's' : ''}</span>}
                        {tmpl.rumors > 0 && <span style={{ display: 'block' }}>• {tmpl.rumors} rumor{tmpl.rumors > 1 ? 's' : ''}</span>}
                        {tmpl.lore > 0 && <span style={{ display: 'block' }}>• {tmpl.lore} lore entr{tmpl.lore > 1 ? 'ies' : 'y'}</span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => isAddContent ? handleClose() : setStep(1)} style={cancelBtnStyle}>
                  <ChevronLeft size={14} /> {isAddContent ? 'Cancel' : 'Back'}
                </button>
                <PrimaryButton onClick={goToStep3}>
                  {selectedTemplate === 'blank' ? 'Review' : 'Generate Content'} <ChevronRight size={14} />
                </PrimaryButton>
              </div>
            </>
          )}

          {/* ── Wizard Step 3: Review & Generate ── */}
          {mode === 'wizard' && step === 3 && (
            <>
              {selectedTemplate === 'blank' ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)' }}>
                  <p style={{ fontSize: '14px', marginBottom: '4px' }}>Blank campaign — no starter content.</p>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>You can generate content from the lobby after creation.</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: 0, marginBottom: '16px' }}>
                    Review generated content. Re-roll or remove individual items.
                  </p>

                  {/* Scenes */}
                  {generatedContent?.scenes?.length > 0 && (
                    <ContentSection title="Scenes" items={generatedContent.scenes} category="scenes"
                      renderItem={(item, i) => <span>{item.name} <span style={{ opacity: 0.5 }}>— {item.location}</span></span>}
                      renderDetail={(item) => <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{item.description}</p>}
                      expandedItems={expandedItems} toggleExpand={toggleExpand}
                      onReroll={rerollItem} onRemove={removeItem}
                    />
                  )}

                  {/* NPCs */}
                  {generatedContent?.npcs?.length > 0 && (
                    <ContentSection title="NPCs" items={generatedContent.npcs} category="npcs"
                      renderItem={(item) => <span>{item.name} <span style={{ opacity: 0.5 }}>— {item.race} {item.role}</span></span>}
                      renderDetail={(item) => (
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '8px 0 0' }}>
                          <p style={{ margin: '0 0 4px' }}>{item.description}</p>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap', opacity: 0.7 }}>{item.dmNotes}</p>
                        </div>
                      )}
                      expandedItems={expandedItems} toggleExpand={toggleExpand}
                      onReroll={rerollItem} onRemove={removeItem}
                    />
                  )}

                  {/* Quests */}
                  {generatedContent?.quests?.length > 0 && (
                    <ContentSection title="Quests" items={generatedContent.quests} category="quests"
                      renderItem={(item) => <span>{item.title} <span style={{ opacity: 0.5 }}>— {item.giver}</span></span>}
                      renderDetail={(item) => (
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '8px 0 0' }}>
                          <p style={{ margin: '0 0 4px' }}>{item.description}</p>
                          <p style={{ margin: 0, opacity: 0.6 }}>XP: {item.rewardXp} | Gold: {item.rewardGold}</p>
                        </div>
                      )}
                      expandedItems={expandedItems} toggleExpand={toggleExpand}
                      onReroll={rerollItem} onRemove={removeItem}
                    />
                  )}

                  {/* Rumors (display-only, not saved to DB) */}
                  {generatedContent?.rumors?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                        Rumors (for your reference)
                      </div>
                      {generatedContent.rumors.map((r, i) => (
                        <div key={i} style={{
                          fontSize: '12px', color: 'var(--text-mute)',
                          padding: '8px 12px', marginBottom: '4px',
                          background: 'rgba(255,255,255,0.02)', borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          "{r._preview.text}" <span style={{ opacity: 0.5 }}>— {r._preview.source}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lore (display-only) */}
                  {generatedContent?.lore?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                        Lore Entries (for your reference)
                      </div>
                      {generatedContent.lore.map((l, i) => (
                        <div key={i} style={{
                          fontSize: '12px', color: 'var(--text-mute)',
                          padding: '8px 12px', marginBottom: '4px',
                          background: 'rgba(255,255,255,0.02)', borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          <strong>{l._preview.title}</strong>
                          <span style={{ opacity: 0.5 }}> — {l._preview.category}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(2)} style={cancelBtnStyle}>
                  <ChevronLeft size={14} /> Back
                </button>
                <PrimaryButton onClick={handleWizardCreate} disabled={creating}>
                  <Sparkles size={14} />
                  {creating ? 'Creating...' : 'Create Campaign'}
                </PrimaryButton>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ModeCard({ icon, title, desc, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '24px 16px', borderRadius: '12px', textAlign: 'center',
        background: accent ? 'rgba(155,89,182,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(155,89,182,0.3)' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <div style={{ color: accent ? '#c084fc' : 'var(--text-dim)', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: accent ? '#c084fc' : 'var(--text)', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{desc}</div>
    </button>
  );
}

function QuickFields({ name, setName, description, setDescription, ruleset, setRuleset, campaignType, setCampaignType, onSubmit }) {
  return (
    <>
      <label style={{ display: 'block', marginBottom: '16px' }}>
        <span style={labelStyle}>Campaign Name</span>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Curse of Strahd" autoFocus
          style={inputStyle} {...focusHandlers}
          onKeyDown={e => e.key === 'Enter' && onSubmit && onSubmit()}
        />
      </label>
      <label style={{ display: 'block', marginBottom: '16px' }}>
        <span style={labelStyle}>Description</span>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="A brief description of the campaign..." rows={3}
          style={{ ...inputStyle, resize: 'vertical' }} {...focusHandlers} />
      </label>
      <label style={{ display: 'block', marginBottom: '16px' }}>
        <span style={labelStyle}>Ruleset</span>
        <select value={ruleset} onChange={e => setRuleset(e.target.value)} style={inputStyle}>
          {RULESET_OPTIONS.map(r => (
            <option key={r.value} value={r.value} style={{ background: '#1a1520', color: '#fff' }}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <div style={{ marginBottom: '16px' }}>
        <span style={labelStyle}>Campaign Type</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { value: 'homebrew', label: 'Homebrew', desc: 'Build your own world from scratch' },
            { value: 'premade', label: 'Premade', desc: 'Run a published or community adventure' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setCampaignType(opt.value)}
              style={{
                padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
                background: campaignType === opt.value ? 'rgba(155,89,182,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${campaignType === opt.value ? 'rgba(155,89,182,0.5)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{
                fontSize: '13px', fontWeight: 600, marginBottom: '2px',
                color: campaignType === opt.value ? '#c084fc' : 'var(--text)',
              }}>{opt.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ContentSection({ title, items, category, renderItem, renderDetail, expandedItems, toggleExpand, onReroll, onRemove }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
        {title} ({items.length})
      </div>
      {items.map((item, i) => {
        const key = `${category}-${i}`;
        const expanded = expandedItems[key];
        return (
          <div key={key} style={{
            padding: '8px 12px', marginBottom: '4px',
            background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => toggleExpand(key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-mute)', padding: '2px', display: 'flex',
              }}>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              <div style={{ flex: 1, fontSize: '13px', color: 'var(--text)' }}>
                {renderItem(item, i)}
              </div>
              <button onClick={() => onReroll(category, i)} title="Re-roll"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', padding: '4px', display: 'flex' }}>
                <RefreshCw size={12} />
              </button>
              <button onClick={() => onRemove(category, i)} title="Remove"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)', padding: '4px', display: 'flex' }}>
                <Trash2 size={12} />
              </button>
            </div>
            {expanded && renderDetail(item)}
          </div>
        );
      })}
    </div>
  );
}

function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 22px', borderRadius: '8px',
        background: disabled
          ? 'rgba(155,89,182,0.1)'
          : 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(142,68,173,0.2))',
        border: '1px solid rgba(155,89,182,0.35)',
        color: disabled ? 'rgba(192,132,252,0.4)' : '#c084fc',
        fontSize: '13px', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

const cancelBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '4px',
  padding: '8px 18px', borderRadius: '8px',
  background: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-dim)', fontSize: '13px', fontWeight: 500,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
};

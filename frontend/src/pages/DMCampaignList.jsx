import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronRight, BookOpen, Clock, Shield, X, Scroll, ArrowLeft, ArrowUpDown, Filter } from 'lucide-react';
import { useAppMode } from '../contexts/ModeContext';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import ConfirmDialog from '../components/ConfirmDialog';

const RULESET_OPTIONS = [
  { value: 'dnd5e-2024', label: 'D&D 5e (2024)' },
  { value: 'dnd5e-2014', label: 'D&D 5e (2014)' },
  { value: 'pf2e', label: 'Pathfinder 2e' },
  { value: 'homebrew', label: 'Homebrew' },
];

function formatDate(ts) {
  if (!ts) return 'Never';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DMCampaignList() {
  const navigate = useNavigate();
  const { clearMode } = useAppMode();  // eslint-disable-line no-unused-vars
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRuleset, setNewRuleset] = useState('dnd5e-2024');
  const [newCampaignType, setNewCampaignType] = useState('homebrew');
  const [creating, setCreating] = useState(false);

  // Sort & filter state
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    // Filter
    if (filterType === 'homebrew') result = result.filter(c => c.campaign_type === 'homebrew');
    else if (filterType === 'premade') result = result.filter(c => c.campaign_type === 'premade');

    // Sort
    switch (sortBy) {
      case 'alpha':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'quests':
        result.sort((a, b) => (b.quest_count || 0) - (a.quest_count || 0));
        break;
      case 'sessions':
        result.sort((a, b) => (b.session_count || 0) - (a.session_count || 0));
        break;
      case 'hours':
        result.sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0));
        break;
      case 'recent':
      default:
        result.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
        break;
    }

    return result;
  }, [campaigns, sortBy, filterType]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const list = await invoke('list_campaigns');
      setCampaigns(list);
    } catch (e) {
      toast.error('Failed to load campaigns');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    setCreating(true);
    try {
      await invoke('create_campaign', {
        name: newName.trim(),
        description: newDesc.trim(),
        ruleset: newRuleset,
        campaignType: newCampaignType,
      });
      toast.success('Campaign created!');
      setShowCreateModal(false);
      setNewName('');
      setNewDesc('');
      setNewRuleset('dnd5e-2024');
      setNewCampaignType('homebrew');
      fetchCampaigns();
    } catch (e) {
      toast.error('Failed to create campaign');
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await invoke('delete_campaign', { campaignId: id });
      toast.success('Campaign deleted');
      setDeleteTarget(null);
      fetchCampaigns();
    } catch (e) {
      toast.error('Failed to delete campaign');
      console.error(e);
    }
  };

  const rulesetLabel = (val) => RULESET_OPTIONS.find(r => r.value === val)?.label || val;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #04040b)',
      padding: 'calc(var(--dev-banner-h, 0px) + 32px) 32px 32px',
      fontFamily: 'var(--font-ui, "DM Sans", sans-serif)',
    }}>
      {/* Header */}
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/')}
              title="Back to Dashboard"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-dim, rgba(255,255,255,0.5))',
                fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'var(--text, rgba(255,255,255,0.9))';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--text-dim, rgba(255,255,255,0.5))';
              }}
            >
              <ArrowLeft size={14} />
              Dashboard
            </button>
            <div>
            <h1 style={{
              fontFamily: 'var(--font-display, "Cinzel", serif)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text, #e8d9b5)',
              margin: 0,
            }}>
              Campaigns
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-dim, rgba(255,255,255,0.45))', marginTop: '4px' }}>
              Manage your DM campaigns
            </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(142,68,173,0.15))',
              border: '1px solid rgba(155,89,182,0.35)',
              color: '#c084fc', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(142,68,173,0.25))';
              e.currentTarget.style.borderColor = 'rgba(155,89,182,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(142,68,173,0.15))';
              e.currentTarget.style.borderColor = 'rgba(155,89,182,0.35)';
            }}
          >
            <Plus size={16} /> New Campaign
          </button>
        </motion.div>

        {/* Sort / Filter bar */}
        {!loading && campaigns.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px', gap: '12px', flexWrap: 'wrap',
          }}>
            {/* Filter chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={12} style={{ color: 'var(--text-mute, rgba(255,255,255,0.25))', marginRight: '2px' }} />
              {[
                { value: 'all', label: 'All' },
                { value: 'homebrew', label: 'Homebrew' },
                { value: 'premade', label: 'Premade' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  style={{
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 500,
                    fontFamily: 'var(--font-ui)',
                    cursor: 'pointer', transition: 'all 0.15s',
                    border: filterType === f.value
                      ? '1px solid rgba(155,89,182,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: filterType === f.value
                      ? 'rgba(155,89,182,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    color: filterType === f.value
                      ? '#c084fc'
                      : 'var(--text-dim, rgba(255,255,255,0.45))',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={12} style={{ color: 'var(--text-mute, rgba(255,255,255,0.25))' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '4px 10px', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 500,
                  fontFamily: 'var(--font-ui)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-dim, rgba(255,255,255,0.5))',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="recent" style={{ background: '#1a1520', color: '#fff' }}>Most Recent</option>
                <option value="alpha" style={{ background: '#1a1520', color: '#fff' }}>Alphabetical</option>
                <option value="quests" style={{ background: '#1a1520', color: '#fff' }}>Most Quests</option>
                <option value="sessions" style={{ background: '#1a1520', color: '#fff' }}>Most Sessions</option>
                <option value="hours" style={{ background: '#1a1520', color: '#fff' }}>Most Hours</option>
              </select>
            </div>
          </div>
        )}

        {/* Campaign list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-dim)' }}>
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '80px 0',
              color: 'var(--text-dim, rgba(255,255,255,0.35))',
            }}
          >
            <Scroll size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No campaigns yet</p>
            <p style={{ fontSize: '13px', opacity: 0.6 }}>Create your first campaign to get started</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            <AnimatePresence>
              {filteredCampaigns.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  onClick={() => navigate(`/dm/lobby/${c.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(155,89,182,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, color: 'white',
                    fontFamily: 'var(--font-display)', flexShrink: 0,
                    boxShadow: '0 0 12px rgba(155,89,182,0.25)',
                  }}>
                    {c.name?.[0] || '?'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '15px', fontWeight: 600,
                      color: 'var(--text, rgba(255,255,255,0.9))',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {c.name}
                    </div>
                    {c.description && (
                      <div style={{
                        fontSize: '12px', color: 'var(--text-dim, rgba(255,255,255,0.4))',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginTop: '2px',
                      }}>
                        {c.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', color: 'var(--text-mute, rgba(255,255,255,0.25))',
                      }}>
                        <Shield size={10} /> {rulesetLabel(c.ruleset)}
                      </span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', color: 'var(--text-mute, rgba(255,255,255,0.25))',
                      }}>
                        <Clock size={10} /> {c.last_session ? formatDate(c.last_session) : 'No sessions'}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
                        color: c.campaign_type === 'premade' ? 'rgba(96,165,250,0.7)' : 'rgba(192,132,252,0.6)',
                        textTransform: 'uppercase',
                      }}>
                        {c.campaign_type === 'premade' ? 'Premade' : 'Homebrew'}
                      </span>
                      {c.quest_count != null && (
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: 'var(--text-mute, rgba(255,255,255,0.25))',
                        }}>
                          <Scroll size={10} /> {c.quest_count} quest{c.quest_count !== 1 ? 's' : ''}
                        </span>
                      )}
                      {c.session_count != null && (
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: 'var(--text-mute, rgba(255,255,255,0.25))',
                        }}>
                          <BookOpen size={10} /> {c.session_count} session{c.session_count !== 1 ? 's' : ''}
                        </span>
                      )}
                      {c.total_hours != null && c.total_hours > 0 && (
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: 'var(--text-mute, rgba(255,255,255,0.25))',
                        }}>
                          <Clock size={10} /> {c.total_hours.toFixed(1)} hrs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}
                    title="Delete campaign"
                    style={{
                      padding: '6px', borderRadius: '6px',
                      background: 'none', border: '1px solid transparent',
                      color: 'var(--text-mute, rgba(255,255,255,0.2))',
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                      e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text-mute, rgba(255,255,255,0.2))';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <Trash2 size={14} />
                  </button>

                  <ChevronRight size={16} style={{ color: 'var(--text-mute)', flexShrink: 0 }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Create Campaign Modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                width: '100%', maxWidth: '480px',
                background: 'rgba(12,10,20,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-display, "Cinzel", serif)',
                  fontSize: '20px', fontWeight: 700,
                  color: 'var(--text, #e8d9b5)', margin: 0,
                }}>
                  New Campaign
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-mute)', padding: '4px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Name */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Campaign Name
                </span>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Curse of Strahd"
                  autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text)', fontSize: '14px',
                    fontFamily: 'var(--font-ui)', outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(155,89,182,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </label>

              {/* Description */}
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Description
                </span>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="A brief description of the campaign..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text)', fontSize: '14px',
                    fontFamily: 'var(--font-ui)', outline: 'none',
                    resize: 'vertical', transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(155,89,182,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </label>

              {/* Ruleset */}
              <label style={{ display: 'block', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Ruleset
                </span>
                <select
                  value={newRuleset}
                  onChange={e => setNewRuleset(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text)', fontSize: '14px',
                    fontFamily: 'var(--font-ui)', outline: 'none',
                    cursor: 'pointer', boxSizing: 'border-box',
                  }}
                >
                  {RULESET_OPTIONS.map(r => (
                    <option key={r.value} value={r.value} style={{ background: '#1a1520', color: '#fff' }}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Campaign Type */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                  Campaign Type
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { value: 'homebrew', label: 'Homebrew', desc: 'Build your own world from scratch' },
                    { value: 'premade', label: 'Premade', desc: 'Run a published or community adventure' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setNewCampaignType(opt.value)}
                      style={{
                        padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
                        background: newCampaignType === opt.value
                          ? 'rgba(155,89,182,0.15)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${newCampaignType === opt.value ? 'rgba(155,89,182,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        fontSize: '13px', fontWeight: 600,
                        color: newCampaignType === opt.value ? '#c084fc' : 'var(--text, rgba(255,255,255,0.8))',
                        marginBottom: '2px',
                      }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim, rgba(255,255,255,0.35))' }}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 18px', borderRadius: '8px',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-dim)', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  style={{
                    padding: '8px 22px', borderRadius: '8px',
                    background: creating || !newName.trim()
                      ? 'rgba(155,89,182,0.1)'
                      : 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(142,68,173,0.2))',
                    border: '1px solid rgba(155,89,182,0.35)',
                    color: creating || !newName.trim() ? 'rgba(192,132,252,0.4)' : '#c084fc',
                    fontSize: '13px', fontWeight: 600,
                    cursor: creating || !newName.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-ui)',
                    transition: 'all 0.15s',
                  }}
                >
                  {creating ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <ConfirmDialog
          show={true}
          title="Delete Campaign"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This will remove all scenes, encounters, and session data. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

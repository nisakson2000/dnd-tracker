import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { getOverview, updateOverview } from '../api/overview';
import { getItems, getCurrency } from '../api/inventory';
import { getSpellSlots, updateSpellSlots } from '../api/spells';
import { getConditions } from '../api/combat';
import { addJournalEntry, getJournalEntries, deleteJournalEntry } from '../api/journal';

export default function usePlayerCharacterData(playerUuid, { addFeedEvent, connected, sendToDm }) {
  // Debounce timer for HP sync to DM
  const hpSyncTimerRef = useRef(null);
  const [charOverview, setCharOverview] = useState(null);
  const [charAbilities, setCharAbilities] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [currency, setCurrency] = useState({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
  const [spellSlots, setSpellSlots] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [hpEditMode, setHpEditMode] = useState(false);
  const [hpDelta, setHpDelta] = useState('');
  const [sessionNote, setSessionNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  // Load character overview when playerUuid (characterId) is available
  const refreshCharacter = useCallback(() => {
    if (!playerUuid) return;
    getOverview(playerUuid)
      .then(data => {
        if (data?.overview) setCharOverview(data.overview);
        else if (data?.name) setCharOverview(data);
        if (data?.ability_scores) setCharAbilities(data.ability_scores);
      })
      .catch(err => console.warn('[PlayerSession] Could not load character overview:', err));
  }, [playerUuid]);

  useEffect(() => { refreshCharacter(); }, [refreshCharacter]);

  // Load inventory, spell slots, conditions
  useEffect(() => {
    if (!playerUuid) return;
    getItems(playerUuid).then(setInventory).catch(e => console.warn('[PlayerSession] Failed to load inventory:', e));
    getCurrency(playerUuid).then(c => { if (c) setCurrency(c); }).catch(e => console.warn('[PlayerSession] Failed to load currency:', e));
    getSpellSlots(playerUuid).then(s => { if (s) setSpellSlots(s); }).catch(e => console.warn('[PlayerSession] Failed to load spell slots:', e));
    getConditions(playerUuid).then(c => { if (c) setConditions(c.filter(x => x.active)); }).catch(e => console.warn('[PlayerSession] Failed to load conditions:', e));
    // Load saved journal notes
    getJournalEntries(playerUuid).then(entries => {
      const sessionNotes = (entries || []).filter(e =>
        (typeof e.tags === 'string' && e.tags.includes('session-note')) ||
        (Array.isArray(e.tags) && e.tags.includes('session-note'))
      );
      setSavedNotes(sessionNotes);
    }).catch(e => console.warn('[PlayerSession] Failed to load saved notes:', e));
  }, [playerUuid]);

  // HP update handler — debounces DM sync to avoid flooding WS on rapid +/- clicks
  const handleHpChange = useCallback(async (delta) => {
    if (!playerUuid || !charOverview) return;
    const newHp = Math.max(0, Math.min(charOverview.max_hp || 999, (charOverview.current_hp || 0) + delta));
    try {
      await updateOverview(playerUuid, { current_hp: newHp });
      setCharOverview(prev => ({ ...prev, current_hp: newHp }));
      setHpDelta('');
      setHpEditMode(false);
      const label = delta > 0 ? `Healed ${delta}` : `Took ${Math.abs(delta)} damage`;
      addFeedEvent('combat', `${label} (HP: ${newHp}/${charOverview.max_hp})`);
      // Debounced broadcast to DM (300ms) — prevents flooding on rapid +/- clicks
      if (connected) {
        if (hpSyncTimerRef.current) clearTimeout(hpSyncTimerRef.current);
        hpSyncTimerRef.current = setTimeout(() => {
          sendToDm({ type: 'CharUpdate', player_uuid: playerUuid, hp: newHp, max_hp: charOverview.max_hp }).catch(() => {});
        }, 300);
      }
    } catch {
      toast.error('Failed to update HP');
    }
  }, [playerUuid, charOverview, addFeedEvent, connected, sendToDm]);

  // Temp HP handler
  const handleSetTempHp = async (val) => {
    if (!playerUuid) return;
    try {
      await updateOverview(playerUuid, { temp_hp: val });
      setCharOverview(prev => ({ ...prev, temp_hp: val }));
    } catch { toast.error('Failed to set temp HP'); }
  };

  // Spell slot use handler
  const handleUseSpellSlot = async (slotLevel) => {
    if (!playerUuid) return;
    const slot = spellSlots.find(s => s.slot_level === slotLevel);
    if (!slot || slot.used_slots >= slot.max_slots) { toast.error('No slots remaining'); return; }
    const updated = spellSlots.map(s =>
      s.slot_level === slotLevel ? { ...s, used_slots: s.used_slots + 1 } : s
    );
    setSpellSlots(updated);
    try {
      await updateSpellSlots(playerUuid, updated.map(s => ({ slot_level: s.slot_level, used_slots: s.used_slots })));
      addFeedEvent('combat', `Used level ${slotLevel} spell slot (${slot.max_slots - slot.used_slots - 1} remaining)`);
    } catch { toast.error('Failed to update spell slots'); }
  };

  // Quick note save
  const handleSaveNote = async () => {
    if (!playerUuid || !sessionNote.trim()) return;
    try {
      const entry = await addJournalEntry(playerUuid, {
        title: `Session Note — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        body: sessionNote.trim(),
        tags: 'session-note',
        session_number: 0, real_date: new Date().toISOString().split('T')[0],
        ingame_date: '', npcs_mentioned: '', pinned: 0,
      });
      toast.success('Note saved to journal');
      if (entry) setSavedNotes(prev => [entry, ...prev]);
      setSessionNote('');
    } catch { toast.error('Failed to save note'); }
  };

  // Delete a saved note
  const handleDeleteNote = async (entryId) => {
    if (!playerUuid || !entryId) return;
    try {
      await deleteJournalEntry(playerUuid, entryId);
      setSavedNotes(prev => prev.filter(n => n.id !== entryId));
      toast.success('Note deleted');
    } catch { toast.error('Failed to delete note'); }
  };

  return {
    refreshCharacter,
    charOverview,
    charAbilities,
    inventory,
    currency,
    spellSlots,
    conditions,
    hpEditMode,
    setHpEditMode,
    hpDelta,
    setHpDelta,
    sessionNote,
    setSessionNote,
    handleHpChange,
    handleSetTempHp,
    handleUseSpellSlot,
    handleSaveNote,
    savedNotes,
    handleDeleteNote,
  };
}

import { useState, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileJson, FileText, Check, X, AlertTriangle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { createCharacter } from '../api/characters';
import { parseDDBCharacter, importDDBCharacter } from '../utils/ddbImport';
import { parseDDBPdf, importDDBPdf } from '../utils/ddbPdfImport';

// ─── Stat label colors ──────────────────────────────────────────────────────

const STAT_COLORS = {
  STR: '#e74c3c', DEX: '#2ecc71', CON: '#e67e22',
  INT: '#3498db', WIS: '#f1c40f', CHA: '#9b59b6',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function DDBImportModal({ show, onClose, onSuccess }) {
  const [step, setStep] = useState('input'); // 'input' | 'preview' | 'importing' | 'done'
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsed, setParsed] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 4, label: '' });
  const [result, setResult] = useState(null);
  const [fileType, setFileType] = useState(null); // 'json' | 'pdf'
  const [pdfData, setPdfData] = useState(null); // raw ArrayBuffer for PDF
  const fileInputRef = useRef(null);

  const reset = useCallback(() => {
    setStep('input');
    setJsonText('');
    setParseError('');
    setParsed(null);
    setProgress({ step: 0, total: 4, label: '' });
    setResult(null);
    setFileType(null);
    setPdfData(null);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── File upload ──
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        // PDF file
        const buffer = await file.arrayBuffer();
        setPdfData(buffer);
        setFileType('pdf');
        setParseError('');
        setParsed(null);
        // Parse PDF immediately
        try {
          const result = await parseDDBPdf(buffer);
          setParsed(result);
          setStep('preview');
        } catch (pdfErr) {
          setParseError(`PDF parsing failed: ${pdfErr.message}`);
        }
      } else {
        // JSON file
        const text = await file.text();
        setJsonText(text);
        setFileType('json');
        setPdfData(null);
        tryParse(text);
      }
    } catch (err) {
      setParseError(`Failed to read file: ${err.message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Parse JSON ──
  const tryParse = (text) => {
    setParseError('');
    setParsed(null);
    try {
      const raw = JSON.parse(text);
      const result = parseDDBCharacter(raw);
      setFileType('json');
      setParsed(result);
      setStep('preview');
    } catch (err) {
      setParseError(err.message || 'Invalid JSON');
    }
  };

  const handleParse = () => {
    if (!jsonText.trim()) {
      setParseError('Please paste JSON data or upload a file');
      return;
    }
    tryParse(jsonText);
  };

  // ── Import ──
  const handleImport = async () => {
    if (!parsed) return;
    setStep('importing');

    try {
      let characterId, summary;

      if (fileType === 'pdf' && pdfData) {
        // PDF import path
        const result = await importDDBPdf(
          pdfData,
          createCharacter,
          (charId, payload) => invoke('import_character', { characterId: charId, payload }),
          (s, t, label) => setProgress({ step: s, total: t, label }),
        );
        characterId = result.characterId;
        summary = result.summary;
      } else {
        // JSON import path
        const result = await importDDBCharacter(
          JSON.parse(jsonText),
          createCharacter,
          (charId, payload) => invoke('import_character', { characterId: charId, payload }),
          (s, t, label) => setProgress({ step: s, total: t, label }),
        );
        characterId = result.characterId;
        summary = result.summary;
      }

      setResult({ characterId, summary });
      setStep('done');
      toast.success(`${summary.name} imported from D&D Beyond!`);
      if (onSuccess) onSuccess(characterId);
    } catch (err) {
      setStep('preview');
      toast.error(`Import failed: ${err.message || err}`);
    }
  };

  // ── Styles ──
  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
  };

  const modalStyle = {
    background: 'linear-gradient(165deg, #16131f 0%, #0e0c17 100%)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: 16, width: '100%', maxWidth: 560,
    maxHeight: '85vh', overflow: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(59,130,246,0.06)',
    margin: '0 16px',
  };

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 0',
  };

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700,
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    color: '#fff',
  };

  const btnSecondary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 24px', borderRadius: 10,
    border: '1px solid rgba(200,175,130,0.15)', cursor: 'pointer',
    fontFamily: 'var(--font-heading)', fontSize: 13, letterSpacing: '0.06em',
    background: 'transparent', color: 'rgba(200,175,130,0.6)',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && step !== 'importing' && handleClose()}
        >
          <motion.div
            style={modalStyle}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileJson size={18} style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', color: '#efe0c0', fontSize: 14, letterSpacing: '0.05em' }}>
                    D&D Beyond Import
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', marginTop: 2 }}>
                    {step === 'input' && 'Upload JSON/PDF or paste character data'}
                    {step === 'preview' && 'Review before importing'}
                    {step === 'importing' && 'Importing character...'}
                    {step === 'done' && 'Import complete'}
                  </div>
                </div>
              </div>
              {step !== 'importing' && (
                <button
                  onClick={handleClose}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(200,175,130,0.3)', padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 24px 0' }}>
              {['Upload', 'Preview', 'Import'].map((label, i) => {
                const stepIndex = i;
                const stepMap = { input: 0, preview: 1, importing: 2, done: 2 };
                const currentIndex = stepMap[step];
                const isActive = stepIndex <= currentIndex;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', fontSize: 10, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      background: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(200,175,130,0.06)',
                      color: isActive ? '#60a5fa' : 'rgba(200,175,130,0.2)',
                      border: `1px solid ${isActive ? 'rgba(59,130,246,0.3)' : 'rgba(200,175,130,0.08)'}`,
                      transition: 'all 0.3s',
                    }}>
                      {step === 'done' && stepIndex === 2 ? <Check size={11} /> : stepIndex + 1}
                    </div>
                    <span style={{
                      fontSize: 11, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em',
                      color: isActive ? 'rgba(96,165,250,0.7)' : 'rgba(200,175,130,0.18)',
                      transition: 'color 0.3s',
                    }}>
                      {label}
                    </span>
                    {i < 2 && (
                      <ChevronRight size={12} style={{ color: 'rgba(200,175,130,0.1)', margin: '0 2px' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Content */}
            <div style={{ padding: '16px 24px 24px' }}>

              {/* ── Input Step ── */}
              {step === 'input' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  {/* File upload zone */}
                  <motion.div
                    whileHover={{ borderColor: 'rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.04)' }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      borderRadius: 12, padding: '28px 20px', cursor: 'pointer',
                      border: '1px dashed rgba(59,130,246,0.2)',
                      background: 'rgba(59,130,246,0.02)',
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.pdf"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <Upload size={28} style={{ color: 'rgba(96,165,250,0.4)', margin: '0 auto 10px' }} />
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'rgba(96,165,250,0.6)', letterSpacing: '0.06em' }}>
                      Click to upload file
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
                        <FileJson size={12} /> JSON
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
                        <FileText size={12} /> PDF
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.2)', marginTop: 4 }}>
                      Export your character from D&D Beyond as JSON or PDF
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(200,175,130,0.08)' }} />
                    <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.2)', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(200,175,130,0.08)' }} />
                  </div>

                  {/* Paste JSON */}
                  <div>
                    <label style={{ fontSize: 11, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>
                      PASTE JSON DATA
                    </label>
                    <textarea
                      value={jsonText}
                      onChange={e => { setJsonText(e.target.value); setParseError(''); }}
                      placeholder='{"name": "Character Name", "classes": [...], ...}'
                      rows={6}
                      style={{
                        width: '100%', borderRadius: 10, padding: '12px 14px',
                        background: 'rgba(11,9,20,0.6)',
                        border: `1px solid ${parseError ? 'rgba(239,68,68,0.3)' : 'rgba(200,175,130,0.1)'}`,
                        color: '#efe0c0', fontFamily: 'monospace', fontSize: 12,
                        resize: 'vertical', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => { if (!parseError) e.target.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                      onBlur={e => { if (!parseError) e.target.style.borderColor = 'rgba(200,175,130,0.1)'; }}
                    />
                  </div>

                  {/* Error */}
                  {parseError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 14px', borderRadius: 8,
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(239,68,68,0.8)' }}>{parseError}</span>
                    </motion.div>
                  )}

                  {/* Parse button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button onClick={handleClose} style={btnSecondary}>Cancel</button>
                    <motion.button
                      onClick={handleParse}
                      whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(59,130,246,0.3)' }}
                      style={{ ...btnPrimary, opacity: jsonText.trim() ? 1 : 0.4 }}
                      disabled={!jsonText.trim()}
                    >
                      <FileJson size={14} /> Parse Character
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── Preview Step ── */}
              {step === 'preview' && parsed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  {/* Character card */}
                  <div style={{
                    borderRadius: 12, padding: '18px 20px',
                    background: 'rgba(59,130,246,0.04)',
                    border: '1px solid rgba(59,130,246,0.15)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#efe0c0', marginBottom: 4 }}>
                      {parsed.summary.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(200,175,130,0.5)', marginBottom: 12 }}>
                      Level {parsed.summary.level} {parsed.summary.race} {parsed.summary.class}
                      {parsed.summary.multiclass && (
                        <span style={{ display: 'block', fontSize: 11, color: 'rgba(200,175,130,0.35)', marginTop: 2 }}>
                          Multiclass: {parsed.summary.multiclass}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                      {Object.entries(parsed.summary.stats).map(([stat, val]) => (
                        <div key={stat} style={{
                          padding: '6px 10px', borderRadius: 8, textAlign: 'center',
                          background: 'rgba(11,9,20,0.5)',
                          border: `1px solid ${STAT_COLORS[stat]}33`,
                          minWidth: 52,
                        }}>
                          <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', color: STAT_COLORS[stat], opacity: 0.7 }}>
                            {stat}
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#efe0c0', fontFamily: 'var(--font-heading)' }}>
                            {val}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.35)' }}>
                            {val >= 10 ? '+' : ''}{Math.floor((val - 10) / 2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* HP */}
                    <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.4)', marginBottom: 6 }}>
                      HP: <span style={{ color: '#e74c3c' }}>{parsed.summary.hp}</span>
                    </div>

                    {/* Counts */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {[
                        { label: 'Spells', count: parsed.summary.spellCount, color: '#60a5fa' },
                        { label: 'Items', count: parsed.summary.itemCount, color: '#f59e0b' },
                        { label: 'Features', count: parsed.summary.featureCount, color: '#a78bfa' },
                      ].map(({ label, count, color }) => (
                        <div key={label} style={{ fontSize: 12, color: 'rgba(200,175,130,0.4)' }}>
                          {label}: <span style={{ color, fontWeight: 600 }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PDF notice */}
                  {fileType === 'pdf' && (
                    <div style={{
                      borderRadius: 10, padding: '12px 14px',
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                      <div style={{ fontSize: 11, color: 'rgba(245,158,11,0.7)', lineHeight: 1.5 }}>
                        PDF import extracts what it can from the character sheet. Some data (spell details, feature descriptions) may be incomplete. You can edit these after import. For best results, use JSON export.
                      </div>
                    </div>
                  )}

                  {/* What will be imported */}
                  <div style={{
                    borderRadius: 10, padding: '14px 16px',
                    background: 'rgba(11,9,20,0.4)',
                    border: '1px solid rgba(200,175,130,0.06)',
                  }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: 'rgba(200,175,130,0.3)', marginBottom: 8 }}>
                      WILL BE IMPORTED
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {[
                        'Overview (name, race, class, level, HP, AC, speed)',
                        'Ability scores & saving throw proficiencies',
                        'Skill proficiencies & expertise',
                        parsed.summary.spellCount > 0 ? `${parsed.summary.spellCount} spell${parsed.summary.spellCount !== 1 ? 's' : ''} & spell slots` : null,
                        parsed.summary.itemCount > 0 ? `${parsed.summary.itemCount} inventory item${parsed.summary.itemCount !== 1 ? 's' : ''} & currency` : null,
                        parsed.summary.featureCount > 0 ? `${parsed.summary.featureCount} feature${parsed.summary.featureCount !== 1 ? 's' : ''} & traits` : null,
                        'Backstory & personality traits',
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(200,175,130,0.45)' }}>
                          <Check size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <button onClick={() => { setStep('input'); setParsed(null); }} style={btnSecondary}>
                      Back
                    </button>
                    <motion.button
                      onClick={handleImport}
                      whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(59,130,246,0.3)' }}
                      style={btnPrimary}
                    >
                      <Upload size={14} /> Import to Codex
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── Importing Step ── */}
              {step === 'importing' && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: '2px solid rgba(59,130,246,0.3)',
                    borderTopColor: '#60a5fa',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#efe0c0', letterSpacing: '0.04em' }}>
                      Importing Character
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.4)', marginTop: 4 }}>
                      {progress.label}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    width: '100%', height: 6, borderRadius: 3,
                    background: 'rgba(200,175,130,0.06)',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${(progress.step / progress.total) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: 3,
                        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.2)' }}>
                    Step {progress.step} of {progress.total}
                  </div>
                </motion.div>
              )}

              {/* ── Done Step ── */}
              {step === 'done' && result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '12px 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'rgba(34,197,94,0.12)',
                      border: '2px solid rgba(34,197,94,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Check size={28} style={{ color: '#22c55e' }} />
                  </motion.div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: '#efe0c0', letterSpacing: '0.04em' }}>
                      {result.summary.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(200,175,130,0.45)', marginTop: 4 }}>
                      Level {result.summary.level} {result.summary.race} {result.summary.class}
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{
                    width: '100%', borderRadius: 10, padding: '14px 16px',
                    background: 'rgba(34,197,94,0.04)',
                    border: '1px solid rgba(34,197,94,0.12)',
                  }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', color: 'rgba(34,197,94,0.5)', marginBottom: 8 }}>
                      IMPORTED SUCCESSFULLY
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[
                        `Ability Scores: ${Object.entries(result.summary.stats).map(([k, v]) => `${k} ${v}`).join(', ')}`,
                        `HP: ${result.summary.hp}`,
                        result.summary.spellCount > 0 ? `${result.summary.spellCount} spell${result.summary.spellCount !== 1 ? 's' : ''}` : null,
                        result.summary.itemCount > 0 ? `${result.summary.itemCount} inventory item${result.summary.itemCount !== 1 ? 's' : ''}` : null,
                        result.summary.featureCount > 0 ? `${result.summary.featureCount} feature${result.summary.featureCount !== 1 ? 's' : ''}` : null,
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(200,175,130,0.45)' }}>
                          <Check size={11} style={{ color: '#22c55e', flexShrink: 0 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleClose}
                    whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(59,130,246,0.3)' }}
                    style={btnPrimary}
                  >
                    <Check size={14} /> Done
                  </motion.button>
                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

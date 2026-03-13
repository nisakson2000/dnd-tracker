import { useState, useEffect, useRef } from 'react';
import { Bug, Send, Trash2, AlertTriangle, ChevronDown, ChevronUp, Monitor, Filter, X, Plus, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { APP_VERSION } from '../version';

const SEVERITY_OPTIONS = [
  { value: 'low',      label: 'Low — cosmetic / minor',     color: '#60a5fa' },
  { value: 'medium',   label: 'Medium — annoying but usable', color: '#eab308' },
  { value: 'high',     label: 'High — broken feature',       color: '#f97316' },
  { value: 'critical', label: 'Critical — crash / data loss', color: '#ef4444' },
];

const IS_DEV = import.meta.env.DEV;

/* ── Session report counter (resets on app launch) ── */
let _reportCounter = 0;

function generateReportId() {
  _reportCounter++;
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `USR-${ymd}-${String(_reportCounter).padStart(3, '0')}`;
}

/* ── Environment auto-detection ── */
function parseEnvironment() {
  const ua = navigator.userAgent;

  let os = 'Unknown';
  if (ua.includes('Windows NT 10.0')) os = ua.includes('Win64') ? 'Windows 10/11' : 'Windows 10';
  else if (ua.includes('Windows NT')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';

  let browser = 'Unknown';
  if (ua.includes('Edg/')) browser = 'Edge ' + (ua.match(/Edg\/(\d+)/)?.[1] || '');
  else if (ua.includes('Chrome/')) browser = 'Chrome ' + (ua.match(/Chrome\/(\d+)/)?.[1] || '');
  else if (ua.includes('Firefox/')) browser = 'Firefox ' + (ua.match(/Firefox\/(\d+)/)?.[1] || '');
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari ' + (ua.match(/Version\/(\d+)/)?.[1] || '');

  return {
    os,
    browser,
    screen: `${screen.width}x${screen.height}`,
    dpr: window.devicePixelRatio,
    url: window.location.href,
  };
}

function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return iso; }
}

function formatUTC(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(11, 19) + ' UTC';
  } catch { return iso; }
}

function formatReport(report) {
  const divider = '='.repeat(60);
  const utc = formatUTC(report.timestamp);
  const reportId = report.reportId || generateReportId();

  const lines = [
    `[${utc}] [USER REPORT #${_reportCounter}]`,
    divider,
    `  Report ID   : ${reportId}`,
    `  Severity    : ${(report.severity || 'unknown').toUpperCase()}`,
    `  Section     : ${report.section || 'N/A'}`,
    '',
    '  -- Description --',
    `  ${report.description || '(none)'}`,
  ];

  if (report.expected) {
    lines.push('', '  -- Expected Behavior --', `  ${report.expected}`);
  }

  if (report.steps) {
    lines.push('', '  -- Steps to Reproduce --');
    report.steps.split('\n').forEach(line => {
      lines.push(`  ${line}`);
    });
  }

  // Character context
  if (report.characterContext) {
    const ctx = report.characterContext;
    lines.push('', '  -- Character Context --');
    lines.push(`  Name  : ${ctx.name || 'N/A'}`);
    lines.push(`  Class : ${ctx.class || 'N/A'}${ctx.level ? ` (Level ${ctx.level})` : ''}`);
    lines.push(`  Race  : ${ctx.race || 'N/A'}`);
    lines.push(`  ID    : ${ctx.id || 'N/A'}`);
  }

  // Environment
  if (report.environment) {
    const env = report.environment;
    lines.push('', '  -- Environment --');
    lines.push(`  OS      : ${env.os}`);
    lines.push(`  Browser : ${env.browser}`);
    lines.push(`  Screen  : ${env.screen} @ ${env.dpr}x`);
    lines.push(`  URL     : ${env.url}`);
  }
  lines.push(`  App Ver : ${report.appVersion || 'unknown'}`);
  lines.push(`  Dev     : ${report.isDev ? 'YES' : 'NO'}`);

  // Recent auto-errors (last 5 min)
  if (report.recentAutoErrors?.length) {
    lines.push('', '  -- Recent Auto-Errors (last 5 min) --');
    report.recentAutoErrors.forEach((e, i) => {
      const dupSuffix = e._dupCount > 1
        ? ` [x${e._dupCount}]`
        : '';
      lines.push(`  [${i + 1}] ${e.message}${dupSuffix}`);
      if (e.filename) lines.push(`      at ${e.filename}:${e.lineno}:${e.colno}`);
      if (e.stack) lines.push(`      ${e.stack.split('\n').slice(0, 3).join('\n      ')}`);
    });
  }

  if (report.autoErrors?.length) {
    lines.push('', '  -- All Auto-Captured Errors --');
    report.autoErrors.forEach((e, i) => {
      const dupSuffix = e._dupCount > 1
        ? ` [x${e._dupCount}]`
        : '';
      lines.push(`  [${i + 1}] ${e.message}${dupSuffix}`);
      if (e.filename) lines.push(`      at ${e.filename}:${e.lineno}:${e.colno}`);
      if (e.stack) lines.push(`      ${e.stack.split('\n').slice(0, 3).join('\n      ')}`);
    });
  }

  lines.push('', divider, '');
  return lines.join('\n');
}

async function writeToDesktop(report) {
  try {
    const formatted = formatReport(report);
    const path = await invoke('write_bug_report', { report: formatted });
    return path;
  } catch (err) {
    console.error('Failed to write bug report to desktop:', err);
    return null;
  }
}

export default function BugReport({ characterId, character, errors = [], onClearErrors }) {
  const [description, setDescription] = useState('');
  const [expected, setExpected] = useState('');
  const [steps, setSteps] = useState(['']);
  const [severity, setSeverity] = useState('medium');
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [hideReactWarnings, setHideReactWarnings] = useState(true);
  const textareaRef = useRef(null);
  const stepRefs = useRef([]);

  // Count react warnings vs real errors
  const realErrors = errors.filter((e) => e.type !== 'react_warning');
  const reactWarnings = errors.filter((e) => e.type === 'react_warning');
  const displayedErrors = hideReactWarnings ? realErrors : errors;

  // In dev mode, auto-write caught errors to desktop
  const prevErrorCountRef = useRef(0);
  useEffect(() => {
    if (!IS_DEV) return;
    if (errors.length > prevErrorCountRef.current && errors.length > 0) {
      const newErrors = errors.slice(0, errors.length - prevErrorCountRef.current);
      newErrors.forEach((err) => {
        writeToDesktop({
          timestamp: err.timestamp,
          severity: 'auto',
          reporter: character?.name || 'Unknown',
          section: err.context?.section || 'Auto-Capture',
          appVersion: APP_VERSION,
          isDev: true,
          description: `[AUTO] ${err.message}`,
          steps: '',
          autoErrors: [err],
          characterContext: err.context ? {
            name: err.context.characterName || null,
            class: err.context.characterClass || null,
            level: err.context.characterLevel || null,
            race: err.context.characterRace || null,
            id: null,
          } : null,
          environment: parseEnvironment(),
        });
      });
    }
    prevErrorCountRef.current = errors.length;
  }, [errors.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Get recent errors from the last 5 minutes (max 5) */
  function getRecentAutoErrors() {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    return errors
      .filter(e => {
        try { return new Date(e.timestamp).getTime() >= fiveMinAgo; } catch { return false; }
      })
      .slice(0, 5);
  }

  /** Format steps array into numbered text */
  function formatSteps(stepsArr) {
    const filled = stepsArr.filter(s => s.trim());
    if (filled.length === 0) return '';
    return filled.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
  }

  /* ── Step builder handlers ── */
  function handleStepChange(index, value) {
    setSteps(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleStepKeyDown(index, e) {
    if (e.key === 'Enter' && !e.repeat) {
      e.preventDefault();
      if (index === steps.length - 1) {
        setSteps(prev => [...prev, '']);
        setTimeout(() => { stepRefs.current[index + 1]?.focus(); }, 0);
      } else {
        stepRefs.current[index + 1]?.focus();
      }
    }
  }

  function removeStep(index) {
    setSteps(prev => {
      if (prev.length <= 1) return [''];
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }

  function addStep() {
    setSteps(prev => [...prev, '']);
    setTimeout(() => { stepRefs.current[steps.length]?.focus(); }, 0);
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the bug');
      return;
    }
    if (!expected.trim()) {
      toast.error('Please describe what you expected to happen');
      return;
    }

    setSubmitting(true);
    try {
      const reportId = generateReportId();
      const env = parseEnvironment();
      const recentAutoErrors = getRecentAutoErrors();

      const report = {
        reportId,
        timestamp: new Date().toISOString(),
        severity,
        reporter: character?.name || 'Unknown',
        section: 'Bug Report',
        appVersion: APP_VERSION,
        isDev: IS_DEV,
        description: description.trim(),
        expected: expected.trim(),
        steps: formatSteps(steps),
        characterContext: {
          name: character?.name || 'Unknown',
          class: character?.primary_class || 'Unknown',
          level: character?.level || '?',
          race: character?.race || 'Unknown',
          id: characterId || character?.id || 'N/A',
        },
        environment: env,
        recentAutoErrors,
        autoErrors: errors.slice(0, 10),
      };

      // Build GitHub issue
      const issueTitle = `[Bug] ${description.trim().slice(0, 80)}`;
      const stepsText = formatSteps(steps);
      const issueBody = [
        `**Severity:** ${severity.toUpperCase()}`,
        `**App Version:** ${APP_VERSION}`,
        `**OS:** ${env.os} | **Screen:** ${env.screen}`,
        character?.name ? `**Character:** ${character.name} (${character.primary_class || '?'} Lv${character.level || '?'})` : '',
        '',
        '## Description',
        description.trim(),
        '',
        '## Expected Behavior',
        expected.trim(),
        stepsText ? `\n## Steps to Reproduce\n${stepsText}` : '',
        recentAutoErrors.length > 0 ? `\n## Auto-Captured Errors (${recentAutoErrors.length})\n${recentAutoErrors.map(e => `- \`${e.message}\``).join('\n')}` : '',
        '',
        '---',
        `*Report ID: ${reportId} | Submitted: ${new Date().toISOString()}*`,
      ].filter(Boolean).join('\n');

      const result = await invoke('submit_bug_report', { title: issueTitle, body: issueBody });

      toast.success('Submitted successfully!', { duration: 4000 });
      setRecentReports(prev => [{ ...report, status: result.status, url: result.url }, ...prev].slice(0, 20));
      setDescription('');
      setExpected('');
      setSteps(['']);
      setSeverity('medium');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const recentAutoErrors = getRecentAutoErrors();

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Bug size={20} /> Bug Report
        </h2>
        <p className="text-sm text-amber-200/40 mt-1.5">
          Report issues you encounter during gameplay. Reports are saved and sent to the development team.
        </p>
        {IS_DEV && (
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400/70 bg-emerald-400/5 border border-emerald-400/15 rounded px-3 py-1.5">
            <Monitor size={12} />
            Dev build detected — errors are auto-logged to Desktop
          </div>
        )}
      </div>

      {/* Character Context chip */}
      {character && (
        <div className="flex items-center gap-3 bg-amber-200/[0.03] border border-amber-200/10 rounded-lg px-4 py-2.5">
          <User size={14} className="text-gold/50 shrink-0" />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="text-amber-100/80 font-medium">{character.name || 'Unknown'}</span>
            <span className="text-amber-200/30">|</span>
            <span className="text-amber-200/50">{character.primary_class || 'Unknown'}</span>
            <span className="text-amber-200/30">|</span>
            <span className="text-amber-200/50">Lv {character.level || '?'}</span>
            <span className="text-amber-200/30">|</span>
            <span className="text-amber-200/50">{character.race || 'Unknown'}</span>
            <span className="text-amber-200/30">|</span>
            <span className="text-amber-200/30 font-mono text-[10px]">ID: {characterId || character.id || 'N/A'}</span>
          </div>
        </div>
      )}

      {/* Report form */}
      <div className="card border-gold/15 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60">New Report</h3>

        {/* Severity */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Severity</label>
          <div className="flex gap-2">
            {SEVERITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSeverity(opt.value)}
                className="text-xs px-3 py-1.5 rounded border transition-all cursor-pointer"
                style={{
                  background: severity === opt.value ? `${opt.color}15` : 'transparent',
                  borderColor: severity === opt.value ? `${opt.color}50` : 'rgba(255,255,255,0.06)',
                  color: severity === opt.value ? opt.color : 'rgba(255,255,255,0.35)',
                }}
              >
                {opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">What happened? *</label>
          <textarea
            ref={textareaRef}
            className="input w-full text-sm"
            rows={3}
            placeholder="Describe the bug — what were you doing, what went wrong?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ resize: 'vertical', minHeight: '70px' }}
          />
        </div>

        {/* Expected behavior */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">What did you expect to happen? *</label>
          <textarea
            className="input w-full text-sm"
            rows={2}
            placeholder="Describe what you expected the correct behavior to be"
            value={expected}
            onChange={e => setExpected(e.target.value)}
            style={{ resize: 'vertical', minHeight: '50px' }}
          />
        </div>

        {/* Steps to reproduce — numbered step builder */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Steps to reproduce (optional)</label>
          <div className="space-y-1.5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-amber-200/30 w-5 text-right shrink-0 font-mono">{i + 1}.</span>
                <input
                  ref={el => { stepRefs.current[i] = el; }}
                  type="text"
                  className="input w-full text-sm py-1.5"
                  placeholder={i === 0 ? 'e.g. Go to Combat tab' : 'Next step...'}
                  value={step}
                  onChange={e => handleStepChange(i, e.target.value)}
                  onKeyDown={e => handleStepKeyDown(i, e)}
                />
                <button
                  onClick={() => removeStep(i)}
                  className="text-amber-200/20 hover:text-red-400 transition-colors shrink-0 cursor-pointer p-0.5"
                  title="Remove step"
                  tabIndex={-1}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-[11px] text-amber-200/30 hover:text-amber-200/50 transition-colors mt-1.5 cursor-pointer"
          >
            <Plus size={11} /> Add step
          </button>
        </div>

        {/* Recent auto-errors indicator */}
        {recentAutoErrors.length > 0 && (
          <div className="text-xs text-amber-200/30 bg-red-400/5 border border-red-400/10 rounded px-3 py-2 flex items-center gap-2">
            <AlertTriangle size={11} className="text-red-400/50 shrink-0" />
            <span>{recentAutoErrors.length} recent error{recentAutoErrors.length !== 1 ? 's' : ''} (last 5 min) will be auto-attached</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-amber-200/20">
            {errors.length > 0 && `${errors.length} auto-captured error${errors.length !== 1 ? 's' : ''} will be attached`}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting || !description.trim() || !expected.trim()}
            className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 disabled:opacity-30"
          >
            <Send size={12} />
            {submitting ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      </div>

      {/* Auto-captured errors */}
      {errors.length > 0 && (
        <div className="card border-red-400/15 space-y-2">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-red-400/60 flex items-center gap-2">
              <AlertTriangle size={12} /> Auto-Captured Errors ({realErrors.length})
              {reactWarnings.length > 0 && (
                <span className="text-amber-400/40 font-normal normal-case tracking-normal">+ {reactWarnings.length} warnings</span>
              )}
            </h3>
            {showErrors ? <ChevronUp size={14} className="text-amber-200/30" /> : <ChevronDown size={14} className="text-amber-200/30" />}
          </button>

          {showErrors && (
            <>
              {/* Filter toggle */}
              {reactWarnings.length > 0 && (
                <button
                  onClick={() => setHideReactWarnings(!hideReactWarnings)}
                  className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border transition-all cursor-pointer"
                  style={{
                    background: hideReactWarnings ? 'rgba(251,191,36,0.05)' : 'rgba(251,191,36,0.12)',
                    borderColor: hideReactWarnings ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.3)',
                    color: 'rgba(251,191,36,0.6)',
                  }}
                >
                  <Filter size={10} />
                  {hideReactWarnings ? `Show ${reactWarnings.length} React warnings` : 'Hide React warnings'}
                </button>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {displayedErrors.slice(0, 50).map(err => (
                  <div
                    key={err.id}
                    className="rounded px-3 py-2"
                    style={{
                      background: err.type === 'react_warning' ? 'rgba(251,191,36,0.04)' : 'rgba(248,113,113,0.04)',
                      border: `1px solid ${err.type === 'react_warning' ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono" style={{ color: err.type === 'react_warning' ? 'rgba(251,191,36,0.6)' : 'rgba(248,113,113,0.7)' }}>
                        {err.type}
                      </span>
                      <span className="text-[10px] text-amber-200/25">{formatTimestamp(err.timestamp)}</span>
                    </div>
                    <div className="text-xs text-amber-100/80 break-all">{err.message}</div>

                    {/* Duplicate count badge */}
                    {err._dupCount > 1 && (
                      <div className="text-[10px] text-amber-400/50 mt-1">
                        Occurred {err._dupCount - 1} more time{err._dupCount - 1 !== 1 ? 's' : ''} between {formatTimestamp(new Date(err._dupFirstSeen).toISOString())} and {formatTimestamp(new Date(err._dupLastSeen).toISOString())}
                      </div>
                    )}

                    {/* Context info */}
                    {err.context?.section && (
                      <div className="text-[10px] text-amber-200/30 mt-1">Section: {err.context.section}</div>
                    )}
                    {err.context?.characterName && (
                      <div className="text-[10px] text-amber-200/30">
                        Character: {err.context.characterName}
                        {err.context.characterClass ? ` (${err.context.characterClass}` : ''}
                        {err.context.characterLevel ? ` Lv${err.context.characterLevel})` : err.context.characterClass ? ')' : ''}
                      </div>
                    )}

                    {err.filename && (
                      <div className="text-[10px] text-amber-200/25 mt-1 font-mono">{err.filename}:{err.lineno}:{err.colno}</div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { onClearErrors?.(); }}
                className="flex items-center gap-1.5 text-xs text-amber-200/30 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 size={11} /> Clear all
              </button>
            </>
          )}
        </div>
      )}

      {/* Recent reports this session */}
      {recentReports.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-200/30">Reports This Session ({recentReports.length})</h3>
          {recentReports.map((r, i) => (
            <div key={i} className="bg-amber-200/3 border border-amber-200/8 rounded px-3 py-2 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-amber-100/70 truncate">{r.description}</div>
                <div className="text-[10px] text-amber-200/25 mt-0.5">
                  <span className="text-amber-200/40 font-mono">{r.reportId}</span>
                  {' — '}
                  {formatTimestamp(r.timestamp)} · {r.severity}
                </div>
              </div>
              <span className="text-[10px] flex-shrink-0 ml-3 text-emerald-400/50">
                Submitted
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-amber-200/25 border border-amber-200/8 rounded p-3">
        <Bug size={13} className="shrink-0 mt-0.5" />
        <span>Bug reports are saved locally and sent to the development team for review.</span>
      </div>
    </div>
  );
}

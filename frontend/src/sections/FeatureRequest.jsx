import { useState, useRef } from 'react';
import { Lightbulb, Send, Star, Zap, Palette, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { APP_VERSION } from '../version';

const CATEGORY_OPTIONS = [
  { value: 'gameplay',  label: 'Gameplay',       icon: Zap,     color: '#60a5fa' },
  { value: 'ui',        label: 'UI / Design',    icon: Palette, color: '#a78bfa' },
  { value: 'tools',     label: 'Tools / Utility', icon: Wrench, color: '#34d399' },
  { value: 'other',     label: 'Other',          icon: Star,    color: '#fbbf24' },
];

let _requestCounter = 0;

function generateRequestId() {
  _requestCounter++;
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `FR-${ymd}-${String(_requestCounter).padStart(3, '0')}`;
}

function formatRequest(req) {
  const divider = '='.repeat(60);
  const utc = (() => {
    try { return new Date(req.timestamp).toISOString().slice(11, 19) + ' UTC'; }
    catch { return req.timestamp; }
  })();

  const lines = [
    `[${utc}] [FEATURE REQUEST #${_requestCounter}]`,
    divider,
    `  Request ID : ${req.requestId}`,
    `  Category   : ${(req.category || 'other').toUpperCase()}`,
    '',
    '  -- Title --',
    `  ${req.title || '(none)'}`,
    '',
    '  -- Description --',
    `  ${req.description || '(none)'}`,
  ];

  if (req.useCase) {
    lines.push('', '  -- Use Case --', `  ${req.useCase}`);
  }

  lines.push('', '  -- Environment --');
  lines.push(`  App Ver : ${req.appVersion || 'unknown'}`);
  lines.push(`  OS      : ${req.os || 'unknown'}`);
  lines.push('', divider, '');
  return lines.join('\n');
}

export default function FeatureRequest() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('');
  const [category, setCategory] = useState('gameplay');
  const [submitting, setSubmitting] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const titleRef = useRef(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please give your feature idea a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please describe the feature');
      return;
    }

    setSubmitting(true);
    try {
      const requestId = generateRequestId();
      const ua = navigator.userAgent;
      let os = 'Unknown';
      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Mac OS X')) os = 'macOS';
      else if (ua.includes('Linux')) os = 'Linux';

      const req = {
        requestId,
        timestamp: new Date().toISOString(),
        category,
        title: title.trim(),
        description: description.trim(),
        useCase: useCase.trim(),
        appVersion: APP_VERSION,
        os,
      };

      const issueTitle = `[Feature Request] ${title.trim()}`;
      const issueBody = [
        `**Category:** ${category}`,
        `**App Version:** ${APP_VERSION}`,
        `**OS:** ${os}`,
        '',
        '## Description',
        description.trim(),
        useCase.trim() ? `\n## Use Case\n${useCase.trim()}` : '',
        '',
        `---`,
        `*Request ID: ${requestId} | Submitted: ${new Date().toISOString()}*`,
      ].filter(Boolean).join('\n');

      const result = await invoke('submit_feature_request', { title: issueTitle, body: issueBody });

      toast.success(result.url ? 'Feature request submitted to GitHub!' : 'Request saved — will submit when online', { duration: 4000 });
      setRecentRequests(prev => [{ ...req, status: result.status, url: result.url }, ...prev].slice(0, 20));
      setTitle('');
      setDescription('');
      setUseCase('');
      setCategory('gameplay');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  function formatTimestamp(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Lightbulb size={20} /> Feature Request
        </h2>
        <p className="text-sm text-amber-200/40 mt-1.5">
          Have an idea to make The Codex better? Submit it here and we'll review it.
        </p>
      </div>

      {/* Form */}
      <div className="card border-gold/15 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold/60">New Idea</h3>

        {/* Category */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Category</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className="text-xs px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5"
                  style={{
                    background: category === opt.value ? `${opt.color}15` : 'transparent',
                    borderColor: category === opt.value ? `${opt.color}50` : 'rgba(255,255,255,0.06)',
                    color: category === opt.value ? opt.color : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <Icon size={12} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Feature title *</label>
          <input
            ref={titleRef}
            type="text"
            className="input w-full text-sm"
            placeholder="e.g. Shared initiative tracker for combat"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Describe the feature *</label>
          <textarea
            className="input w-full text-sm"
            rows={4}
            placeholder="What should it do? How should it work?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        {/* Use case */}
        <div>
          <label className="text-xs text-amber-200/40 mb-1.5 block">Use case (optional)</label>
          <textarea
            className="input w-full text-sm"
            rows={2}
            placeholder="When would you use this? What problem does it solve?"
            value={useCase}
            onChange={e => setUseCase(e.target.value)}
            style={{ resize: 'vertical', minHeight: '50px' }}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
            className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 disabled:opacity-30"
          >
            <Send size={12} />
            {submitting ? 'Saving...' : 'Submit Idea'}
          </button>
        </div>
      </div>

      {/* Recent requests this session */}
      {recentRequests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-200/30">
            Submitted This Session ({recentRequests.length})
          </h3>
          {recentRequests.map((r, i) => (
            <div key={i} className="bg-amber-200/3 border border-amber-200/8 rounded px-3 py-2 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-amber-100/70 truncate">{r.title}</div>
                <div className="text-[10px] text-amber-200/25 mt-0.5">
                  <span className="text-amber-200/40 font-mono">{r.requestId}</span>
                  {' — '}
                  {formatTimestamp(r.timestamp)} · {r.category}
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
        <Lightbulb size={13} className="shrink-0 mt-0.5" />
        <span>Feature requests are submitted as GitHub issues for tracking. If offline, they're saved locally and submitted automatically next time.</span>
      </div>
    </div>
  );
}

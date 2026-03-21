import { useState, useCallback } from 'react';
import { Moon, ChevronDown, ChevronUp, Send, Dices, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SHORT_REST_RULES, LONG_REST_RULES, SHORT_REST_FEATURES, REST_VARIANTS } from '../../data/restMechanics';

const HIT_DIE_OPTIONS = ['d6', 'd8', 'd10', 'd12'];

export default function RestManager({ onClose, onBroadcast }) {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState('short');
  const [variant, setVariant] = useState('standard');
  const [hitDie, setHitDie] = useState('d8');
  const [conMod, setConMod] = useState(0);
  const [rollResult, setRollResult] = useState(null);
  const [recharged, setRecharged] = useState({});

  const currentVariant = REST_VARIANTS[variant];

  const rollHitDie = useCallback(() => {
    const sides = parseInt(hitDie.slice(1), 10);
    const roll = Math.floor(Math.random() * sides) + 1;
    const total = Math.max(0, roll + conMod);
    setRollResult({ roll, conMod, total, die: hitDie });
    toast.success(`Recovered ${total} HP`);
  }, [hitDie, conMod]);

  const toggleRecharge = useCallback((classIdx, featIdx) => {
    const key = `${classIdx}-${featIdx}`;
    setRecharged((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleBroadcast = useCallback(() => {
    const restType = tab === 'short' ? 'Short Rest' : 'Long Rest';
    const info = {
      type: restType,
      variant: currentVariant.label,
      duration: tab === 'short' ? currentVariant.shortRest : currentVariant.longRest,
    };
    if (onBroadcast) onBroadcast(info);
    toast.success(`${restType} broadcast sent`);
  }, [tab, currentVariant, onBroadcast]);

  return (
    <div className="bg-[#1a1520] border border-indigo-500/30 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
      >
        <span className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
          <Moon size={16} /> Rest Manager
        </span>
        {collapsed ? <ChevronDown size={16} className="text-indigo-400" /> : <ChevronUp size={16} className="text-indigo-400" />}
      </button>

      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {['short', 'long'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t === 'short' ? 'Short Rest' : 'Long Rest'}
              </button>
            ))}
          </div>

          {/* Short Rest Tab */}
          {tab === 'short' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-xs">{SHORT_REST_RULES.description}</p>
              <p className="text-indigo-300 text-xs">Duration: {currentVariant.shortRest}</p>

              {/* Hit Dice Roller */}
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-indigo-300">Hit Dice Roller</p>
                <div className="flex items-center gap-2">
                  <select
                    value={hitDie}
                    onChange={(e) => setHitDie(e.target.value)}
                    className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  >
                    {HIT_DIE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="text-gray-500 text-xs">CON mod:</span>
                  <input
                    type="number"
                    value={conMod}
                    onChange={(e) => setConMod(parseInt(e.target.value, 10) || 0)}
                    className="w-14 bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white text-center"
                  />
                  <button onClick={rollHitDie} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded transition-colors">
                    <Dices size={14} /> Roll
                  </button>
                </div>
                {rollResult && (
                  <p className="text-emerald-400 text-xs mt-1">
                    Rolled {rollResult.roll} ({rollResult.die}) + CON mod ({rollResult.conMod >= 0 ? '+' : ''}{rollResult.conMod}) = <strong>{rollResult.total} HP recovered</strong>
                  </p>
                )}
              </div>

              {/* Feature Recharge Checklist */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-indigo-300">Features That Recharge</p>
                {SHORT_REST_FEATURES.map((cls, ci) => (
                  <div key={cls.className} className="space-y-1">
                    <p className="text-xs text-purple-300 font-medium">{cls.className}</p>
                    {cls.features.map((feat, fi) => (
                      <label key={feat.name} className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={!!recharged[`${ci}-${fi}`]}
                          onChange={() => toggleRecharge(ci, fi)}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <span className={`text-xs ${recharged[`${ci}-${fi}`] ? 'text-emerald-400 line-through' : 'text-gray-300'}`}>
                          <strong>{feat.name}</strong> — {feat.description}
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Long Rest Tab */}
          {tab === 'long' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-xs">{LONG_REST_RULES.description}</p>
              <p className="text-indigo-300 text-xs">Duration: {currentVariant.longRest}</p>

              <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
                <p className="text-xs font-semibold text-indigo-300">Long Rest Benefits</p>
                <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                  <li><span className="text-emerald-400">Full HP restored</span></li>
                  <li>All spell slots recovered</li>
                  <li>Regain spent hit dice equal to <strong>half total</strong> (min 1)</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-amber-300">Exhaustion</p>
                <p className="text-xs text-amber-200/80">One level of exhaustion is removed if the character has had sufficient food and water.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 space-y-1">
                <p className="text-xs font-semibold text-indigo-300">Conditions &amp; Notes</p>
                <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
                  <li>Must have at least 1 HP to benefit</li>
                  <li>Only one long rest per 24-hour period</li>
                  <li>Interrupted if strenuous activity exceeds 1 hour</li>
                  <li>All "recharges on a long rest" features restored</li>
                </ul>
              </div>
            </div>
          )}

          {/* Variant Rules */}
          <div className="border-t border-white/5 pt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-400">Rest Variant</p>
            <div className="flex gap-1.5">
              {Object.entries(REST_VARIANTS).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => setVariant(key)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded transition-colors ${
                    variant === key ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 italic">{currentVariant.description}</p>
          </div>

          {/* Broadcast */}
          <button
            onClick={handleBroadcast}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded transition-colors"
          >
            <Send size={14} /> Broadcast Rest to Players
          </button>
        </div>
      )}
    </div>
  );
}

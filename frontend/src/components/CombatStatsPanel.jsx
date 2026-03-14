import { useState, useEffect } from 'react';
import { Swords, RotateCcw, Clock, Skull, Heart, Zap, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCombatStats, resetCombatStats } from '../utils/combatStats';

export default function CombatStatsPanel() {
  const [stats, setStats] = useState(() => getCombatStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getCombatStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    resetCombatStats();
    setStats(getCombatStats());
  };

  const hitBarWidth = stats.attacksMade > 0
    ? Math.round((stats.attacksHit / stats.attacksMade) * 100)
    : 0;

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-amber-100 flex items-center gap-2">
          <Swords size={20} />
          <div>
            <span>Combat Statistics</span>
            <p className="text-xs text-amber-200/40 font-normal mt-0.5">
              Track your combat performance throughout the session.
            </p>
          </div>
        </h2>
        <button
          onClick={handleReset}
          className="text-xs text-amber-200/30 hover:text-red-400 transition-colors flex items-center gap-1"
          title="Reset all combat stats"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Damage */}
        <motion.div
          className="card text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(13,13,18,0.95) 100%)',
            borderColor: 'rgba(201,168,76,0.25)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Zap size={16} className="mx-auto mb-1" style={{ color: '#ffd700' }} />
          <div className="text-2xl font-display" style={{ color: '#ffd700' }}>
            {stats.totalDamageDealt}
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Damage Dealt
          </div>
        </motion.div>

        {/* Damage Taken */}
        <motion.div
          className="card text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(13,13,18,0.95) 100%)',
            borderColor: 'rgba(239,68,68,0.25)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Skull size={16} className="mx-auto mb-1 text-red-400" />
          <div className="text-2xl font-display text-red-400">
            {stats.totalDamageReceived}
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Damage Taken
          </div>
        </motion.div>

        {/* Healing Done */}
        <motion.div
          className="card text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(13,13,18,0.95) 100%)',
            borderColor: 'rgba(16,185,129,0.25)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Heart size={16} className="mx-auto mb-1 text-emerald-400" />
          <div className="text-2xl font-display text-emerald-400">
            {stats.totalHealing}
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Healing Done
          </div>
        </motion.div>

        {/* Hit Rate */}
        <motion.div
          className="card text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Target size={16} className="mx-auto mb-1 text-amber-200/60" />
          <div className="text-2xl font-display text-amber-100">
            {stats.hitRate}%
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Hit Rate
          </div>
        </motion.div>

        {/* Critical Hits */}
        <motion.div
          className="card text-center"
          style={{
            background: stats.criticalHits > 0
              ? 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(13,13,18,0.95) 100%)'
              : undefined,
            borderColor: stats.criticalHits > 0 ? 'rgba(255,215,0,0.3)' : undefined,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <span className="block text-center mb-1 text-base">
            {stats.criticalHits > 0 ? '\u2728' : '\u2694\uFE0F'}
          </span>
          <div className="text-2xl font-display" style={{ color: stats.criticalHits > 0 ? '#ffd700' : undefined }}>
            {stats.criticalHits}
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Crits
          </div>
        </motion.div>

        {/* Kills */}
        <motion.div
          className="card text-center"
          style={{
            background: stats.killCount > 0
              ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(13,13,18,0.95) 100%)'
              : undefined,
            borderColor: stats.killCount > 0 ? 'rgba(239,68,68,0.2)' : undefined,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Trophy size={16} className="mx-auto mb-1 text-red-400/70" />
          <div className="text-2xl font-display text-red-300">
            {stats.killCount}
          </div>
          <div className="text-[10px] text-amber-200/40 uppercase tracking-wider mt-0.5">
            Kills
          </div>
        </motion.div>
      </div>

      {/* Attack Hit/Miss Bar */}
      {stats.attacksMade > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-amber-100 text-sm">Attacks</h3>
            <span className="text-xs text-amber-200/40">
              {stats.attacksHit} hit / {stats.attacksMade - stats.attacksHit} missed
            </span>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden bg-[#0d0d12] border border-amber-200/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${hitBarWidth}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-emerald-400/60">
              {hitBarWidth}% hits
            </span>
            <span className="text-[10px] text-red-400/60">
              {100 - hitBarWidth}% misses
            </span>
          </div>
        </motion.div>
      )}

      {/* Highest Damage & Session Info */}
      <div className="grid grid-cols-2 gap-3">
        {/* Highest Single Damage */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-display text-amber-100 text-sm mb-1">Highest Hit</h3>
          {stats.highestDamage.amount > 0 ? (
            <>
              <div className="text-3xl font-display" style={{ color: '#ffd700' }}>
                {stats.highestDamage.amount}
              </div>
              <div className="text-[10px] text-amber-200/30 mt-0.5 truncate" title={stats.highestDamage.source}>
                {stats.highestDamage.source || 'Unknown source'}
              </div>
            </>
          ) : (
            <div className="text-sm text-amber-200/20 mt-2">No attacks yet</div>
          )}
        </motion.div>

        {/* Session Duration & Encounters */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="font-display text-amber-100 text-sm mb-1">Session</h3>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock size={13} className="text-amber-200/40" />
            <span className="text-lg font-display text-amber-100">
              {formatDuration(stats.sessionDuration)}
            </span>
          </div>
          <div className="text-[10px] text-amber-200/30 mt-1.5">
            {stats.encountersCompleted} encounter{stats.encountersCompleted !== 1 ? 's' : ''} completed
          </div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-display text-amber-100 text-sm mb-3">Detailed Stats</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            { label: 'Spells Cast', value: stats.spellsCast },
            { label: 'Spell Slots Used', value: stats.slotsUsed },
            { label: 'Turns Played', value: stats.turnsPlayed },
            { label: 'Critical Misses', value: stats.criticalMisses, color: 'text-red-400/70' },
            { label: 'Conditions Applied', value: stats.conditionsApplied },
            { label: 'Items Used', value: stats.itemsUsed },
            { label: 'Features Used', value: stats.featuresUsed },
            { label: 'Death Save Passes', value: stats.deathSaveSuccesses, color: 'text-emerald-400/70' },
            { label: 'Death Save Fails', value: stats.deathSaveFailures, color: 'text-red-400/70' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between py-1 border-b border-amber-200/5">
              <span className="text-xs text-amber-200/40">{label}</span>
              <span className={`text-sm font-display ${color || 'text-amber-100'}`}>{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

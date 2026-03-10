import { motion, AnimatePresence } from 'framer-motion';
import { getLevelUpGains } from '../utils/levelUpGains';
import { Star, Swords, Sparkles, BookOpen, ArrowUp } from 'lucide-react';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
  size: 2 + Math.random() * 6,
}));

function GainSection({ icon, title, children, delay }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <div className="text-amber-400/70 mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-amber-200/50 uppercase tracking-wider mb-0.5">{title}</div>
        {children}
      </div>
    </motion.div>
  );
}

export default function LevelUpOverlay({ show, name, level, className, rulesetId, onDismiss }) {
  const gains = show ? getLevelUpGains(className, level, rulesetId) : null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Radial gold glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.1) 30%, transparent 60%)',
            }}
          />

          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, #c9a84c, #f0d878)`,
                boxShadow: '0 0 6px #c9a84c',
              }}
              initial={{ bottom: '-5%', opacity: 0 }}
              animate={{
                bottom: '110%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-lg w-full mx-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', damping: 15 }}
          >
            <motion.h1
              className="text-7xl md:text-8xl font-display font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, #f0d878, #c9a84c, #f0d878)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            >
              LEVEL UP!
            </motion.h1>

            <motion.div
              className="text-2xl md:text-3xl text-amber-200/80 mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-amber-100 font-display">{name}</span>
            </motion.div>

            <motion.div
              className="text-5xl md:text-6xl font-display mt-4"
              style={{
                color: '#c9a84c',
                textShadow: '0 0 30px rgba(201,168,76,0.5)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Level {level}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="h-px mx-auto mt-6 mb-5 w-3/4"
              style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.0 }}
            />

            {/* Gains */}
            {gains && (
              <div className="max-h-[40vh] overflow-y-auto text-left space-y-4 px-2 scrollbar-thin">

                {/* Hit Die & Proficiency */}
                <motion.div
                  className="flex items-center justify-center gap-6 text-center"
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {gains.hitDie && (
                    <div>
                      <div className="text-xs text-amber-200/50 uppercase tracking-wider">Hit Points</div>
                      <div className="text-lg font-display text-amber-100">+1{gains.hitDie} HP</div>
                    </div>
                  )}
                  {gains.proficiencyBonus && (
                    <div>
                      <div className="text-xs text-amber-200/50 uppercase tracking-wider">Proficiency</div>
                      <div className="text-lg font-display text-emerald-300">
                        +{gains.proficiencyBonus.old} → +{gains.proficiencyBonus.new}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Spell Slots */}
                {gains.newSpellSlots && (
                  <GainSection icon={<Sparkles size={16} />} title="New Spell Slots" delay={1.3}>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(gains.newSpellSlots).map(([label, value]) => (
                        <span key={label} className="text-sm text-purple-300">
                          <span className="text-purple-200/70">{label}:</span> {value}
                        </span>
                      ))}
                    </div>
                  </GainSection>
                )}

                {/* ASI */}
                {gains.isASI && (
                  <GainSection icon={<ArrowUp size={16} />} title="Ability Score Improvement" delay={1.4}>
                    <p className="text-sm text-amber-100">
                      +2 to one ability score, or +1 to two different scores, or choose a Feat
                    </p>
                  </GainSection>
                )}

                {/* Class Features */}
                {gains.features.length > 0 && (
                  <GainSection icon={<BookOpen size={16} />} title="Class Features" delay={1.5}>
                    <div className="space-y-2">
                      {gains.features.map((f, i) => (
                        <div key={i}>
                          <span className="text-sm font-medium text-amber-100">{f.name}</span>
                          <p className="text-xs text-amber-200/50 leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </GainSection>
                )}
              </div>
            )}

            <motion.p
              className="text-sm text-amber-200/40 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              Click anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

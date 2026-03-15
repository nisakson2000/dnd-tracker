import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CONDITION_EFFECTS } from '../data/conditionEffects';

const POSITION_STYLES = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[rgba(201,168,76,0.3)]',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[rgba(201,168,76,0.3)]',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[rgba(201,168,76,0.3)]',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[rgba(201,168,76,0.3)]',
  },
};

function buildEffectLines(data) {
  const lines = [];
  if (data.speedOverride === 0) lines.push('Speed becomes 0');
  if (data.cantAct) lines.push('Cannot take actions or reactions');
  if (data.attackRolls === 'advantage') lines.push('Advantage on attack rolls');
  if (data.attackRolls === 'disadvantage') lines.push('Disadvantage on attack rolls');
  if (data.abilityChecks === 'disadvantage') lines.push('Disadvantage on ability checks');
  if (data.attacksAgainstYou === 'advantage') lines.push('Attacks against you have advantage');
  if (data.attacksAgainstYou === 'disadvantage') lines.push('Attacks against you have disadvantage');
  if (data.autoFailSaves?.length) lines.push(`Auto-fail ${data.autoFailSaves.join(' & ')} saves`);
  if (data.autoCritMelee) lines.push('Melee hits auto-crit within 5 ft');
  if (data.resistAll) lines.push('Resistance to all damage');
  if (data.savePenalty) {
    Object.entries(data.savePenalty).forEach(([ab, type]) => {
      lines.push(`${type.charAt(0).toUpperCase() + type.slice(1)} on ${ab} saves`);
    });
  }
  return lines;
}

export default function RuleTooltip({ term, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const delayRef = useRef(null);

  const show = useCallback(() => {
    delayRef.current = setTimeout(() => setVisible(true), 150);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(delayRef.current);
    setVisible(false);
  }, []);

  const data = CONDITION_EFFECTS[term];
  const pos = POSITION_STYLES[position] || POSITION_STYLES.top;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${pos.tooltip} w-[300px] max-w-[300px] pointer-events-none`}
          >
            <div
              className="px-3 py-2.5 rounded-lg shadow-xl"
              style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(201,168,76,0.3)',
                fontFamily: 'var(--font-ui)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <div className="text-sm font-bold mb-1" style={{ color: '#c9a84c' }}>
                {term}
              </div>

              {data?.summary ? (
                <p className="text-xs leading-relaxed text-amber-100/90 mb-1.5">
                  {data.summary}
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-amber-100/60 italic">
                  No rule data available.
                </p>
              )}

              {data && (() => {
                const lines = buildEffectLines(data);
                if (lines.length === 0) return null;
                return (
                  <div className="border-t border-amber-100/10 pt-1.5 mt-1 space-y-0.5">
                    {lines.map((line, i) => (
                      <div key={i} className="text-[11px] text-red-300/90 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-400/80 flex-shrink-0 mt-1.5" />
                        {line}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className={`absolute ${pos.arrow}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

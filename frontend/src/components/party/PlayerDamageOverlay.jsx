import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ANIMATION_DURATION = 1.5; // seconds

export default function PlayerDamageOverlay({ events = [] }) {
  const [visibleEvents, setVisibleEvents] = useState([]);

  // Add new events to visible list
  useEffect(() => {
    if (events.length === 0) return;
    setVisibleEvents(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      const newOnes = events.filter(e => !existingIds.has(e.id));
      if (newOnes.length === 0) return prev;
      return [...prev, ...newOnes];
    });
  }, [events]);

  // Auto-remove events after animation completes
  const handleAnimationComplete = useCallback((id) => {
    setVisibleEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      <AnimatePresence>
        {visibleEvents.map((evt, index) => {
          const isDamage = evt.delta < 0;
          const isHeal = evt.delta > 0;
          const isCritical = evt.critical;
          const isSkull = evt.type === 'death' || (isDamage && evt.delta === 0);

          // Stagger horizontal position to avoid overlap
          const xOffset = ((index % 5) - 2) * 40;

          let color = '#ef4444'; // red for damage
          let text = `${evt.delta}`;
          let fontSize = 28;
          let extraStyle = {};

          if (isHeal) {
            color = '#4ade80';
            text = `+${evt.delta}`;
          }

          if (isCritical) {
            color = '#fbbf24';
            fontSize = 36;
            extraStyle = {
              textShadow: '0 0 12px rgba(251,191,36,0.8), 0 0 24px rgba(251,191,36,0.4)',
            };
          }

          if (isSkull) {
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [2, 1, 1, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION, times: [0, 0.1, 0.7, 1] }}
                onAnimationComplete={() => handleAnimationComplete(evt.id)}
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 48,
                  color: '#ef4444',
                  textShadow: '0 0 20px rgba(239,68,68,0.8)',
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontWeight: 900,
                  userSelect: 'none',
                }}
              >
                &#x1F480;
              </motion.div>
            );
          }

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 0, scale: isCritical ? 0.5 : 0.8 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -20, -60, -100],
                scale: isCritical ? [0.5, 1.3, 1.1, 0.9] : [0.8, 1, 1, 0.9],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ANIMATION_DURATION,
                times: [0, 0.1, 0.6, 1],
                ease: 'easeOut',
              }}
              onAnimationComplete={() => handleAnimationComplete(evt.id)}
              style={{
                position: 'absolute',
                top: '50%',
                left: `calc(50% + ${xOffset}px)`,
                transform: 'translateX(-50%)',
                fontSize,
                fontWeight: 900,
                fontFamily: 'var(--font-display, sans-serif)',
                color,
                userSelect: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.02em',
                ...extraStyle,
              }}
            >
              {text}
              {isCritical && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#fbbf24',
                    textAlign: 'center',
                    marginTop: -2,
                  }}
                >
                  CRITICAL!
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

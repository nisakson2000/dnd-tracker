/**
 * Shared Framer Motion animation presets.
 * Use these instead of defining inline animations to keep consistency.
 *
 * Usage:
 *   import { fadeIn, slideUp, stagger } from '../utils/motionPresets';
 *   <motion.div {...fadeIn}>...</motion.div>
 *   <motion.div variants={stagger.container} initial="hidden" animate="show">
 *     {items.map(item => <motion.div key={item.id} variants={stagger.item} />)}
 *   </motion.div>
 */

// ─── Basic Transitions ──────────────────────────────────────────────────────

/** Fade in from transparent */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

/** Fade in with slight upward movement */
export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

/** Slide in from right (for forward navigation) */
export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2 },
};

/** Slide in from left (for backward navigation) */
export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 },
};

/** Scale up from slightly smaller */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

/** Slide up from below (for modals, panels) */
export const slideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

// ─── Modal Presets ──────────────────────────────────────────────────────────

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

// ─── List / Stagger Presets ─────────────────────────────────────────────────

/** Stagger children items — use on parent container + individual items */
export const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  },
};

/** Slower stagger for larger items (cards, sections) */
export const staggerSlow = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  },
};

// ─── Interactive Presets ────────────────────────────────────────────────────

/** Hover + tap for clickable cards */
export const cardHover = {
  whileHover: { y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

/** Subtle hover for buttons */
export const buttonHover = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
};

/** Expand/collapse height animation (for accordions) */
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// ─── Transition Helpers ─────────────────────────────────────────────────────

/** Standard easing curve */
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.4, 0, 0.2, 1];

/** Duration constants */
export const DURATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
};

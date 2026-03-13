import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FolderOpen, Link2 } from 'lucide-react';

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const shimmerStyle = {
  background: 'linear-gradient(135deg, #f0d878, #c9a84c, #f0d878)',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'shimmer 3s ease-in-out infinite',
};

export default function WikiHero({ stats }) {
  const articles = useCountUp(stats?.total_articles, 2000);
  const categories = useCountUp(stats?.total_categories, 1800);
  const crossRefs = useCountUp(stats?.total_cross_references, 2200);

  const counters = [
    { value: articles, label: 'Articles', icon: BookOpen },
    { value: categories, label: 'Categories', icon: FolderOpen },
    { value: crossRefs, label: 'Cross-References', icon: Link2 },
  ];

  return (
    <motion.div
      className="text-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-5xl font-display font-bold mb-2"
        style={shimmerStyle}
        variants={itemVariants}
      >
        Arcane Encyclopedia
      </motion.h1>

      <motion.p
        className="text-amber-200/60 text-sm mb-8"
        variants={itemVariants}
      >
        Your gateway to the realms of D&amp;D knowledge
      </motion.p>

      <motion.div
        className="flex justify-center gap-12 mb-8"
        variants={itemVariants}
      >
        {counters.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon className="w-4 h-4 text-amber-400/50 mb-1" />
            <span className="text-3xl font-display font-bold text-amber-100">
              {value.toLocaleString()}
            </span>
            <span className="text-xs uppercase tracking-wider text-amber-200/50">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="divider-gold" />
      </motion.div>
    </motion.div>
  );
}

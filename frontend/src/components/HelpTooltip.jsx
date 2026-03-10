import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export default function HelpTooltip({ text, size = 14 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span className="relative inline-flex items-center ml-1" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="opacity-0 hover:opacity-70 focus:opacity-70 transition-opacity focus:outline-none text-amber-200/40"
        aria-label="Help"
      >
        <HelpCircle size={size} />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 text-xs text-amber-100 bg-[#1a1825] border border-gold/30 rounded-lg shadow-xl leading-relaxed">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gold/30" />
        </div>
      )}
    </span>
  );
}

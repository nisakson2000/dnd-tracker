import { Check, Loader2 } from 'lucide-react';

export default function SaveIndicator({ saving, lastSaved }) {
  if (saving) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-200/40">
        <Loader2 size={12} className="animate-spin" />
        Saving...
      </span>
    );
  }

  if (lastSaved) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400/60 animate-fade-in">
        <Check size={12} />
        Saved
      </span>
    );
  }

  return null;
}

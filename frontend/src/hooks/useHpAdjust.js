import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Shared HP adjustment hook — used by Overview and Topbar HP Widget.
 * @param {object} params
 * @param {object} params.overview - { current_hp, max_hp, temp_hp, death_save_successes, death_save_failures }
 * @param {function} params.setOverview - state setter
 * @param {function} params.triggerOverview - autosave trigger
 */
export function useHpAdjust({ overview, setOverview, triggerOverview }) {
  const applyDamage = useCallback((rawDmg) => {
    const dmg = parseInt(rawDmg) || 0;
    if (dmg <= 0) return;

    let remaining = dmg;
    let newTemp = overview.temp_hp || 0;
    let newCurrent = overview.current_hp;
    const oldTemp = newTemp;

    // Temp HP absorbs first
    if (newTemp > 0) {
      const absorbed = Math.min(newTemp, remaining);
      newTemp -= absorbed;
      remaining -= absorbed;
    }
    newCurrent = Math.max(0, newCurrent - remaining);
    const tempAbsorbed = oldTemp - newTemp;

    const updated = { ...overview, temp_hp: newTemp, current_hp: newCurrent };
    // If HP drops to 0, reset death saves
    if (newCurrent === 0 && overview.current_hp > 0) {
      updated.death_save_successes = 0;
      updated.death_save_failures = 0;
    }
    setOverview(updated);
    if (triggerOverview) triggerOverview(updated);

    const parts = [`Took ${dmg} damage`];
    if (tempAbsorbed > 0) parts.push(`${tempAbsorbed} absorbed by temp HP`);
    parts.push(`HP: ${newCurrent}/${overview.max_hp}`);
    toast(parts.join('. ') + '.', {
      icon: '\u2694\uFE0F', duration: 3000,
      style: { background: '#1a1520', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' },
    });

    if (newCurrent === 0 && overview.current_hp > 0) {
      toast.error("You're unconscious!", { duration: 5000, icon: '\uD83D\uDC80' });
    }

    return { newCurrent, newTemp, tempAbsorbed };
  }, [overview, setOverview, triggerOverview]);

  const applyHeal = useCallback((rawHeal) => {
    const heal = parseInt(rawHeal) || 0;
    if (heal <= 0) return;
    const newCurrent = Math.min(overview.max_hp, overview.current_hp + heal);
    const actualHeal = newCurrent - overview.current_hp;

    const updated = { ...overview, current_hp: newCurrent };
    // If healing from 0 HP, clear death saves
    if (overview.current_hp === 0 && newCurrent > 0) {
      updated.death_save_successes = 0;
      updated.death_save_failures = 0;
    }
    setOverview(updated);
    if (triggerOverview) triggerOverview(updated);

    if (actualHeal > 0) {
      toast.success(`Healed ${actualHeal} HP. HP: ${newCurrent}/${overview.max_hp}`, { duration: 3000 });
    }

    return { newCurrent, actualHeal };
  }, [overview, setOverview, triggerOverview]);

  const applyTempHp = useCallback((rawAmount) => {
    const amount = parseInt(rawAmount) || 0;
    if (amount <= 0) return;
    // Temp HP doesn't stack — take the higher value
    const newTemp = Math.max(overview.temp_hp || 0, amount);
    const updated = { ...overview, temp_hp: newTemp };
    setOverview(updated);
    if (triggerOverview) triggerOverview(updated);

    if (newTemp === overview.temp_hp && amount <= (overview.temp_hp || 0)) {
      toast(`Temp HP not applied — current (${overview.temp_hp}) is higher`, { icon: '\uD83D\uDEE1\uFE0F', duration: 3000 });
    } else {
      toast.success(`Temp HP set to ${newTemp}`, { duration: 3000 });
    }

    return { newTemp };
  }, [overview, setOverview, triggerOverview]);

  return { applyDamage, applyHeal, applyTempHp };
}

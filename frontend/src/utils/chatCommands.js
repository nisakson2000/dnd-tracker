import { parseAndRollExpression } from './dice';

export function parseChatCommand(message, playerName) {
  if (message.startsWith('/roll ') || message.startsWith('/r ')) {
    const expr = message.replace(/^\/(roll|r)\s+/, '').trim();
    const result = parseAndRollExpression(expr);
    if (result) {
      return {
        type: 'roll',
        expression: expr,
        result: result.total,
        breakdown: result.breakdownParts.join(' '),
        display: `${playerName} rolled ${expr}: [${result.breakdownParts.join(' ')}] = ${result.total}`,
      };
    }
    return { type: 'error', message: 'Invalid dice expression' };
  }
  if (message.startsWith('/me ')) {
    const action = message.slice(4).trim();
    return { type: 'emote', display: `* ${playerName} ${action}` };
  }
  return null; // Not a command
}

export function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Color assignment for sender names
const SENDER_COLORS = ['#c084fc', '#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#34d399', '#a78bfa', '#fb923c'];
const colorMap = {};
export function getSenderColor(sender) {
  if (sender === 'DM') return '#c084fc';
  if (sender === 'You' || sender === 'Player') return '#4ade80';
  if (!colorMap[sender]) {
    colorMap[sender] = SENDER_COLORS[Object.keys(colorMap).length % SENDER_COLORS.length];
  }
  return colorMap[sender];
}

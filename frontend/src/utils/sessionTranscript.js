import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

export async function exportSessionTranscript(eventFeed, chatMessages, campaignName) {
  const lines = [];
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  lines.push(`# Session Log — ${campaignName || 'Campaign'}`);
  lines.push(`**Date:** ${date} ${time}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Combat & event log
  if (eventFeed.length > 0) {
    lines.push('## Event Log');
    lines.push('');
    for (const evt of eventFeed) {
      const ts = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const cat = evt.category ? `[${evt.category}]` : '';
      lines.push(`- **${ts}** ${cat} ${evt.message}${evt.details ? ` — _${evt.details}_` : ''}`);
    }
    lines.push('');
  }

  // Chat messages
  if (chatMessages && chatMessages.length > 0) {
    lines.push('## Chat');
    lines.push('');
    for (const msg of chatMessages) {
      const ts = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      lines.push(`- **${ts}** **${msg.sender}:** ${msg.message}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('_Exported from The Codex_');

  const content = lines.join('\n');

  // Try Tauri file dialog first, fall back to download
  try {
    const filePath = await save({
      defaultPath: `session-log-${date.replace(/\//g, '-')}.md`,
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (filePath) {
      await writeTextFile(filePath, content);
      return { success: true, path: filePath };
    }
    return { success: false, reason: 'cancelled' };
  } catch (e) {
    // Fallback: create a download blob
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-log-${date.replace(/\//g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true, path: 'downloaded' };
  }
}

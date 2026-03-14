import { useState, useEffect } from 'react';
import { Archive, Download, RotateCcw, Trash2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

export default function Archives() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const chars = await invoke('list_characters');
      setCampaigns(chars.filter(c => c.status === 'archived'));
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRestore = async (c) => {
    try {
      await invoke('archive_campaign', { campaignId: c.id, archived: false });
      toast.success(`"${c.name}" restored!`);
      load();
    } catch (err) {
      toast.error(`Failed: ${err.message || err}`);
    }
  };

  const handleExport = async (c) => {
    try {
      const data = await invoke('export_campaign', { campaignId: c.id });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(c.name || 'campaign').replace(/[^a-zA-Z0-9]/g, '_')}_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`"${c.name}" exported!`);
    } catch (err) {
      toast.error(`Export failed: ${err.message || err}`);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="flex items-center gap-3 mb-6">
        <Archive size={20} style={{ color: 'rgba(201,168,76,0.6)' }} />
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'calc(20px * var(--font-scale))',
            fontWeight: 700, color: 'white', margin: 0,
          }}>
            Archives
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
            Archived campaigns. Export them as .json or restore to active.
          </p>
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginBottom: 16, padding: '8px 12px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8 }}>
        Exported campaigns are saved to your browser's default Downloads folder as <code style={{ color: '#c9a84c' }}>.json</code> files.
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, color: 'var(--text-mute)' }}>
          Loading archives...
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Archive size={32} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
          <div style={{ fontSize: 14, color: 'var(--text-mute)', fontFamily: 'var(--font-heading)' }}>
            No archived campaigns
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
            Archive a campaign from the Dashboard to see it here.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {campaigns.map(c => (
            <div key={c.id} style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)', marginTop: 2 }}>
                    Archived
                  </div>
                </div>
                <button
                  onClick={() => handleExport(c)}
                  title="Export as .json"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 6, fontSize: 10,
                    background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
                    color: '#60a5fa', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  <Download size={11} /> Export
                </button>
                <button
                  onClick={() => handleRestore(c)}
                  title="Restore to active"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 6, fontSize: 10,
                    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                    color: '#4ade80', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >
                  <RotateCcw size={11} /> Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

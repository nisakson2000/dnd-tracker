import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CharacterView from './pages/CharacterView';
import WikiPage from './pages/WikiPage';
import WikiArticlePage from './pages/WikiArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Ambient background effects */}
      <div className="ambient" />
      <div className="ambient-noise" />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#09090f',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#09090f' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#09090f' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/character/:characterId" element={<CharacterView />} />
        <Route path="/wiki" element={<WikiPage />} />
        <Route path="/wiki/:slug" element={<WikiArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

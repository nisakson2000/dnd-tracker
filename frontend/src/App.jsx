import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CharacterView from './pages/CharacterView';
import WikiPage from './pages/WikiPage';
import WikiArticlePage from './pages/WikiArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#14121c',
            color: '#d4c5a0',
            border: '1px solid rgba(201,168,76,0.3)',
            fontFamily: 'Crimson Text, serif',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#14121c' } },
          error: { iconTheme: { primary: '#8b2232', secondary: '#14121c' } },
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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './store/contentStore';
import Header from './components/layout/Header';
import ContentGenerator from './components/generator/ContentGenerator';
import ContentCalendar from './components/calendar/ContentCalendar';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import BatchGenerator from './components/batch/BatchGenerator';
import ModelStatusBar from './components/modelStatus/ModelStatusBar';
import QuotaWarning from './components/modelStatus/QuotaWarning';
import ApiKeySettings from './components/settings/ApiKeySettings';
import BrandVoiceSettings from './components/settings/BrandVoiceSettings';
import ContentTargets from './components/settings/ContentTargets';

function SettingsPage() {
  return (
    <div style={{ padding: '40px', maxWidth: 640 }}>
      <div className="section-header" style={{ padding: 0, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <span className="section-number">05</span>
          <div>
            <div className="section-title">Settings</div>
            <div className="section-sub">Keys, voice & targets</div>
          </div>
        </div>
      </div>
      <ApiKeySettings />
      <hr className="rule-heavy" />
      <BrandVoiceSettings />
      <hr className="rule-heavy" />
      <ContentTargets />
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="page-shell">
      <Header />
      <main style={{ flex: 1, padding: '32px 40px' }}>
        <QuotaWarning />
        <ModelStatusBar />
        <div style={{ marginTop: 24 }}>{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><ContentGenerator /></Layout>} />
          <Route path="/calendar" element={<Layout><ContentCalendar /></Layout>} />
          <Route path="/analytics" element={<Layout><AnalyticsDashboard /></Layout>} />
          <Route path="/batch" element={<Layout><BatchGenerator /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
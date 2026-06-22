import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/AppHeader';
import OverviewPage from './pages/OverviewPage';
import PositionListPage from './pages/PositionListPage';
import SnapshotPage from './pages/SnapshotPage';
import SnapshotSummaryPage from './pages/SnapshotSummaryPage';

const { Content } = Layout;

/** 应用根组件与路由 */
export default function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/positions" element={<PositionListPage />} />
            <Route path="/snapshots/summary" element={<SnapshotSummaryPage />} />
            <Route path="/positions/:positionId/snapshots" element={<SnapshotPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

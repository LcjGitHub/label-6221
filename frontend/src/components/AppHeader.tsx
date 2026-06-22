import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { FileTextOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { Header } = Layout;

/** 顶部导航栏 */
export default function AppHeader() {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/snapshots/summary')) return 'summary';
    if (location.pathname.startsWith('/positions/')) return 'snapshots';
    return 'positions';
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: '#001529',
        padding: '0 24px',
      }}
    >
      <Typography.Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
        社区公告栏历史快照
      </Typography.Title>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        style={{ flex: 1, minWidth: 0, background: 'transparent' }}
        items={[
          {
            key: 'positions',
            icon: <HomeOutlined />,
            label: <Link to="/">位置列表</Link>,
          },
          {
            key: 'summary',
            icon: <UnorderedListOutlined />,
            label: <Link to="/snapshots/summary">快照汇总</Link>,
          },
          {
            key: 'snapshots',
            icon: <FileTextOutlined />,
            label: '快照记录',
            disabled: !location.pathname.startsWith('/positions/'),
          },
        ]}
      />
    </Header>
  );
}

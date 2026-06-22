import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { FileTextOutlined, HomeOutlined } from '@ant-design/icons';

const { Header } = Layout;

/** 顶部导航栏 */
export default function AppHeader() {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith('/positions/') ? 'snapshots' : 'positions';

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
        selectedKeys={[selectedKey]}
        style={{ flex: 1, minWidth: 0, background: 'transparent' }}
        items={[
          {
            key: 'positions',
            icon: <HomeOutlined />,
            label: <Link to="/">位置列表</Link>,
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

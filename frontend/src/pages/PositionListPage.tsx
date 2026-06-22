import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { fetchPositions } from '../api/client';
import type { Position } from '../types';

/** 公告栏位置列表页 */
export default function PositionListPage() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPositions();
      setPositions(data);
    } catch {
      message.error('加载位置列表失败，请确认后端已启动');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns: ColumnsType<Position> = [
    {
      title: '位置名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '具体地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '快照数量',
      dataIndex: 'snapshot_count',
      key: 'snapshot_count',
      width: 120,
      render: (count: number) => <Tag color="blue">{count} 条</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Link to={`/positions/${record.id}/snapshots`}>
          <Button type="link">查看快照</Button>
        </Link>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          公告栏位置列表
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          选择位置进入快照记录页，可查看、新增、编辑与删除历史快照。
        </Typography.Paragraph>
      </div>
      <Card>
        <Table<Position>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={positions}
          pagination={false}
        />
      </Card>
    </Space>
  );
}

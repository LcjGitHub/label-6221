import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { fetchSnapshots } from '../api/client';
import type { Snapshot } from '../types';

export default function SnapshotSummaryPage() {
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSnapshots();
      setSnapshots(data);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '加载快照汇总失败，请确认后端已启动';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns: ColumnsType<Snapshot> = [
    {
      title: '位置名称',
      dataIndex: 'position_name',
      key: 'position_name',
      width: 160,
      render: (value: string | undefined, record) =>
        value ? (
          <Link to={`/positions/${record.position_id}/snapshots`}>{value}</Link>
        ) : '-',
    },
    {
      title: '记录日期',
      dataIndex: 'record_date',
      key: 'record_date',
      width: 130,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: '内容类型',
      dataIndex: 'content_type',
      key: 'content_type',
      width: 100,
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: '是否满贴',
      dataIndex: 'is_full_post',
      key: 'is_full_post',
      width: 100,
      render: (value: boolean) =>
        value ? <Tag color="red">已满贴</Tag> : <Tag color="green">未满贴</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: '8px 0' }}>
          全局快照汇总
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          按记录日期倒序展示所有位置的快照记录
        </Typography.Paragraph>
      </div>

      <Card>
        <Table<Snapshot>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={snapshots}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </Space>
  );
}

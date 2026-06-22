import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  createPosition,
  deletePosition,
  fetchPositions,
  updatePosition,
} from '../api/client';
import type { Position, PositionFormValues } from '../types';

/** 公告栏位置列表页 */
export default function PositionListPage() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [form] = Form.useForm<PositionFormValues>();

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

  const openCreateModal = () => {
    setEditing(null);
    form.setFieldsValue({
      name: '',
      location: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (record: Position) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      location: record.location,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: PositionFormValues = {
        name: values.name.trim(),
        location: values.location.trim(),
      };

      if (editing) {
        await updatePosition(editing.id, payload);
        message.success('位置已更新');
      } else {
        await createPosition(payload);
        message.success('位置已创建');
      }

      setModalOpen(false);
      loadData();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePosition(id);
      message.success('位置已删除');
      loadData();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

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
      width: 240,
      render: (_, record) => (
        <Space>
          <Link to={`/positions/${record.id}/snapshots`}>
            <Button type="link">查看快照</Button>
          </Link>
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该位置？"
            description={
              record.snapshot_count > 0
                ? `该位置仍关联 ${record.snapshot_count} 条快照记录，无法删除`
                : '删除后无法恢复，请确认操作'
            }
            onConfirm={() => handleDelete(record.id)}
            disabled={record.snapshot_count > 0}
            okButtonProps={{ disabled: record.snapshot_count > 0 }}
          >
            <Button type="link" danger disabled={record.snapshot_count > 0}>
              删除
            </Button>
          </Popconfirm>
        </Space>
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
          管理公告栏位置，点击进入快照记录页，可查看、新增、编辑与删除历史快照。
        </Typography.Paragraph>
      </div>
      <Card
        extra={
          <Button type="primary" onClick={openCreateModal}>
            新增位置
          </Button>
        }
      >
        <Table<Position>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={positions}
          pagination={false}
        />
      </Card>

      <Modal
        title={editing ? '编辑位置' : '新增位置'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="name"
            label="位置名称"
            rules={[{ required: true, message: '请输入位置名称' }]}
          >
            <Input placeholder="例如：东门公告栏" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="location"
            label="具体地点"
            rules={[{ required: true, message: '请输入具体地点' }]}
          >
            <Input placeholder="例如：小区东门入口左侧" maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

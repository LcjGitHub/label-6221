import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';

const { RangePicker } = DatePicker;
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  createSnapshot,
  deleteSnapshot,
  fetchPositions,
  fetchSnapshots,
  updateSnapshot,
} from '../api/client';
import type { Position, Snapshot, SnapshotFilterParams, SnapshotFormValues } from '../types';
import { CONTENT_TYPES } from '../types';
import type { Dayjs } from 'dayjs';

interface SnapshotFilterFormValues {
  content_type?: string;
  is_full_post?: boolean;
  record_date_range?: [Dayjs, Dayjs];
}

/** 快照记录页（CRUD） */
export default function SnapshotPage() {
  const { positionId } = useParams<{ positionId: string }>();
  const numericPositionId = Number(positionId);

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Snapshot | null>(null);
  const [form] = Form.useForm<SnapshotFormValues>();
  const [filterForm] = Form.useForm<SnapshotFilterFormValues>();
  const [filterParams, setFilterParams] = useState<SnapshotFilterParams>({});

  const currentPosition = useMemo(
    () => positions.find((item) => item.id === numericPositionId),
    [positions, numericPositionId],
  );

  const loadData = useCallback(async () => {
    if (!numericPositionId) return;
    setLoading(true);
    try {
      const [positionList, snapshotList] = await Promise.all([
        fetchPositions(),
        fetchSnapshots(numericPositionId, filterParams),
      ]);
      setPositions(positionList);
      setSnapshots(snapshotList);
    } catch {
      message.error('加载快照失败，请确认后端已启动');
    } finally {
      setLoading(false);
    }
  }, [numericPositionId, filterParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterSearch = () => {
    const values = filterForm.getFieldsValue();
    const params: SnapshotFilterParams = {};
    if (values.content_type) {
      params.content_type = values.content_type;
    }
    if (values.is_full_post != null) {
      params.is_full_post = values.is_full_post;
    }
    if (values.record_date_range && values.record_date_range.length === 2) {
      params.record_date_start = dayjs(values.record_date_range[0]).format('YYYY-MM-DD');
      params.record_date_end = dayjs(values.record_date_range[1]).format('YYYY-MM-DD');
    }
    setFilterParams(params);
  };

  const handleFilterReset = () => {
    filterForm.resetFields();
    setFilterParams({});
  };

  const openCreateModal = () => {
    setEditing(null);
    form.setFieldsValue({
      position_id: numericPositionId,
      record_date: dayjs(),
      content_type: '通知',
      is_full_post: false,
      remark: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (record: Snapshot) => {
    setEditing(record);
    form.setFieldsValue({
      position_id: record.position_id,
      record_date: dayjs(record.record_date),
      content_type: record.content_type,
      is_full_post: record.is_full_post,
      remark: record.remark,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: SnapshotFormValues = {
        position_id: values.position_id,
        content_type: values.content_type,
        is_full_post: values.is_full_post,
        remark: values.remark ?? '',
        record_date: dayjs(values.record_date as string | dayjs.Dayjs).format('YYYY-MM-DD'),
      };

      if (editing) {
        await updateSnapshot(editing.id, payload);
        message.success('快照已更新');
      } else {
        await createSnapshot(payload);
        message.success('快照已创建');
      }

      setModalOpen(false);
      loadData();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '保存失败，请稍后重试';
      message.error(editing ? `更新失败：${errMsg}` : `创建失败：${errMsg}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSnapshot(id);
      message.success('快照已删除');
      loadData();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '删除失败，请稍后重试';
      message.error(`删除失败：${errMsg}`);
    }
  };

  const columns: ColumnsType<Snapshot> = [
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
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该快照？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!numericPositionId) {
    return <Typography.Text type="danger">无效的位置 ID</Typography.Text>;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Link>
          <Link to="/positions">← 返回位置列表</Link>
        </Typography.Link>
        <Typography.Title level={3} style={{ margin: '8px 0' }}>
          {currentPosition?.name ?? '快照记录'}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {currentPosition?.location ?? ''}
        </Typography.Paragraph>
      </div>

      <Card
        title="筛选条件"
        size="small"
      >
        <Form form={filterForm} layout="inline">
          <Form.Item name="content_type" label="内容类型">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 120 }}
              options={CONTENT_TYPES.map((item) => ({ label: item, value: item }))}
            />
          </Form.Item>
          <Form.Item name="is_full_post" label="是否满贴">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 120 }}
              options={[
                { label: '已满贴', value: true },
                { label: '未满贴', value: false },
              ]}
            />
          </Form.Item>
          <Form.Item name="record_date_range" label="记录日期">
            <RangePicker style={{ width: 260 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleFilterSearch}>
                查询
              </Button>
              <Button onClick={handleFilterReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        extra={
          <Button type="primary" onClick={openCreateModal}>
            新增快照
          </Button>
        }
      >
        <Table<Snapshot>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={snapshots}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑快照' : '新增快照'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="position_id" label="位置" rules={[{ required: true }]}>
            <Select
              options={positions.map((item) => ({ label: item.name, value: item.id }))}
              disabled
            />
          </Form.Item>
          <Form.Item name="record_date" label="记录日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content_type" label="内容类型" rules={[{ required: true }]}>
            <Select options={CONTENT_TYPES.map((item) => ({ label: item, value: item }))} />
          </Form.Item>
          <Form.Item name="is_full_post" label="是否满贴" valuePropName="checked">
            <Switch checkedChildren="满贴" unCheckedChildren="未满" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="补充说明" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

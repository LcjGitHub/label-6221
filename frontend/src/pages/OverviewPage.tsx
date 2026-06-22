import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { fetchStatsOverview } from '../api/client';
import type { StatsOverview } from '../types';

const { Title, Paragraph } = Typography;

const CONTENT_TYPE_COLORS: Record<string, string> = {
  通知: '#1677ff',
  活动: '#52c41a',
  物业: '#fa8c16',
  其他: '#722ed1',
};

export default function OverviewPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsOverview | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStatsOverview();
      setStats(data);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '加载统计数据失败，请确认后端已启动';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fullPostPercent =
    stats && stats.total_count > 0 ? Math.round((stats.full_post_count / stats.total_count) * 100) : 0;

  const maxContentTypeCount = stats
    ? Math.max(...stats.content_type_counts.map((item) => item.count), 1)
    : 1;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: '8px 0' }}>
          数据统计概览
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          快照总量、满贴状态以及按内容类型分布的整体统计情况
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="快照总数"
              value={stats?.total_count ?? 0}
              suffix="条"
              prefix={<FileTextOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="已满贴数量"
              value={stats?.full_post_count ?? 0}
              suffix="条"
              prefix={<CheckCircleOutlined style={{ color: '#cf1322' }} />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="未满贴数量"
              value={stats?.not_full_post_count ?? 0}
              suffix="条"
              prefix={<ClockCircleOutlined style={{ color: '#389e0d' }} />}
              valueStyle={{ color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="满贴占比"
              value={fullPostPercent}
              suffix="%"
              prefix={<AppstoreOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="满贴状态分布" loading={loading}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>已满贴</span>
                  <Tag color="red">{stats?.full_post_count ?? 0} 条</Tag>
                </div>
                <Progress percent={fullPostPercent} strokeColor="#cf1322" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>未满贴</span>
                  <Tag color="green">{stats?.not_full_post_count ?? 0} 条</Tag>
                </div>
                <Progress
                  percent={100 - fullPostPercent}
                  strokeColor="#389e0d"
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="按内容类型分布" loading={loading}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {stats && stats.content_type_counts.length > 0 ? (
                stats.content_type_counts.map((item) => {
                  const percent = Math.round((item.count / maxContentTypeCount) * 100);
                  const color = CONTENT_TYPE_COLORS[item.content_type] ?? '#1677ff';
                  return (
                    <div key={item.content_type}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}
                      >
                        <span>
                          <Tag color={color}>{item.content_type}</Tag>
                        </span>
                        <span style={{ color: '#666' }}>{item.count} 条</span>
                      </div>
                      <Progress percent={percent} strokeColor={color} showInfo={false} />
                    </div>
                  );
                })
              ) : (
                <Paragraph type="secondary" style={{ textAlign: 'center', margin: '24px 0' }}>
                  暂无数据
                </Paragraph>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

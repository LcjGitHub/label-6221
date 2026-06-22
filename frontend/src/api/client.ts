import axios from 'axios';
import type {
  Position,
  PositionFormValues,
  Snapshot,
  SnapshotFilterParams,
  SnapshotFormValues,
  StatsOverview,
} from '../types';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.detail ?? error?.message ?? '请求失败';
    return Promise.reject(new Error(message));
  },
);

/** 获取所有公告栏位置 */
export async function fetchPositions(): Promise<Position[]> {
  const { data } = await client.get<Position[]>('/positions');
  return data;
}

/** 创建公告栏位置 */
export async function createPosition(payload: PositionFormValues): Promise<Position> {
  const { data } = await client.post<Position>('/positions', payload);
  return data;
}

/** 更新公告栏位置 */
export async function updatePosition(
  id: number,
  payload: Partial<PositionFormValues>,
): Promise<Position> {
  const { data } = await client.put<Position>(`/positions/${id}`, payload);
  return data;
}

/** 删除公告栏位置 */
export async function deletePosition(id: number): Promise<void> {
  await client.delete(`/positions/${id}`);
}

/** 获取快照列表，可按位置、内容类型、是否满贴、记录日期范围组合筛选 */
export async function fetchSnapshots(
  positionId?: number,
  filter?: SnapshotFilterParams,
): Promise<Snapshot[]> {
  const params: Record<string, unknown> = {};
  if (positionId != null) {
    params.position_id = positionId;
  }
  if (filter?.content_type) {
    params.content_type = filter.content_type;
  }
  if (filter?.is_full_post != null) {
    params.is_full_post = filter.is_full_post;
  }
  if (filter?.record_date_start) {
    params.record_date_start = filter.record_date_start;
  }
  if (filter?.record_date_end) {
    params.record_date_end = filter.record_date_end;
  }
  const { data } = await client.get<Snapshot[]>('/snapshots', { params });
  return data;
}

/** 创建快照 */
export async function createSnapshot(payload: SnapshotFormValues): Promise<Snapshot> {
  const { data } = await client.post<Snapshot>('/snapshots', payload);
  return data;
}

/** 更新快照 */
export async function updateSnapshot(
  id: number,
  payload: Partial<SnapshotFormValues>,
): Promise<Snapshot> {
  const { data } = await client.put<Snapshot>(`/snapshots/${id}`, payload);
  return data;
}

/** 删除快照 */
export async function deleteSnapshot(id: number): Promise<void> {
  await client.delete(`/snapshots/${id}`);
}

/** 获取数据统计概览 */
export async function fetchStatsOverview(): Promise<StatsOverview> {
  const { data } = await client.get<StatsOverview>('/stats/overview');
  return data;
}

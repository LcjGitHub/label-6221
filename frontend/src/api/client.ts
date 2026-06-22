import axios from 'axios';
import type { Position, PositionFormValues, Snapshot, SnapshotFormValues } from '../types';

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

/** 获取快照列表，可按位置筛选 */
export async function fetchSnapshots(positionId?: number): Promise<Snapshot[]> {
  const params = positionId != null ? { position_id: positionId } : undefined;
  const { data } = await client.get<Snapshot[]>('/snapshots', { params });
  return data;
}

/** 获取所有位置的全部快照（全局汇总） */
export async function fetchAllSnapshots(): Promise<Snapshot[]> {
  const { data } = await client.get<Snapshot[]>('/snapshots');
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

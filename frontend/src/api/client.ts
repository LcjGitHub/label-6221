import axios from 'axios';
import type { Position, Snapshot, SnapshotFormValues } from '../types';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/** 获取所有公告栏位置 */
export async function fetchPositions(): Promise<Position[]> {
  const { data } = await client.get<Position[]>('/positions');
  return data;
}

/** 获取快照列表，可按位置筛选 */
export async function fetchSnapshots(positionId?: number): Promise<Snapshot[]> {
  const params = positionId != null ? { position_id: positionId } : undefined;
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

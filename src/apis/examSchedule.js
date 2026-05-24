import apiClient from './client.js';

export async function getExamSchedules() {
  const { data } = await apiClient.get('/api/exam-schedules');
  return data;
}

export async function syncExamSchedules() {
  await apiClient.post('/api/exam-schedules/sync');
}

import apiClient from './client.js';

function unwrapPayload(data) {
  return data?.data ?? data?.result ?? data;
}

export async function getTasks(planId) {
  const { data } = await apiClient.get(`/api/plans/${planId}/tasks`);
  return data;
}

export async function createTask(planId, payload) {
  const { data } = await apiClient.post(`/api/plans/${planId}/tasks`, payload);
  return data;
}

export async function updateTask(planId, taskId, payload) {
  const { data } = await apiClient.patch(
    `/api/plans/${planId}/tasks/${taskId}`,
    payload
  );
  return data;
}

export async function completeTask(planId, taskId) {
  const { data } = await apiClient.patch(
    `/api/plans/${planId}/tasks/${taskId}/complete`
  );
  return unwrapPayload(data);
}

export async function deleteTask(planId, taskId) {
  await apiClient.delete(`/api/plans/${planId}/tasks/${taskId}`);
}

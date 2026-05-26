import apiClient from './client.js';

export async function getPlans() {
  const { data } = await apiClient.get('/api/plans');
  return data;
}

export async function getPlan(planId) {
  const { data } = await apiClient.get(`/api/plans/${planId}`);
  return data;
}

export async function createPlan(payload) {
  const { data } = await apiClient.post('/api/plans', payload);
  return data;
}

export async function updatePlan(planId, payload) {
  const { data } = await apiClient.patch(`/api/plans/${planId}`, payload);
  return data;
}

export async function deletePlan(planId) {
  await apiClient.delete(`/api/plans/${planId}`);
}

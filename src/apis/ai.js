import apiClient from './client.js';

export async function generateStudyPlan(userInput) {
  const { data } = await apiClient.post('/api/ai/generate', { userInput });
  return data;
}

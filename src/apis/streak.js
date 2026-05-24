import apiClient from './client.js';

export async function getStreak() {
  if (!import.meta.env.VITE_API_BASE_URL) {
    return { currentStreak: 8, lastActivityDate: null };
  }

  const { data } = await apiClient.get('/api/streaks');
  return data;
}

import apiClient from './client.js';

const STREAK_KEYS = [
  'currentStreak',
  'streak',
  'streakDays',
  'days',
  'continuousDays',
];

function unwrapPayload(data) {
  return data?.data ?? data?.result ?? data;
}

function normalizeStreak(data) {
  const payload = unwrapPayload(data);
  const matchedKey = STREAK_KEYS.find((key) => payload?.[key] !== undefined);
  const currentStreak = Number(matchedKey ? payload[matchedKey] : 0);

  return {
    ...payload,
    currentStreak: Number.isFinite(currentStreak) ? currentStreak : 0,
  };
}

export async function getStreak() {
  const { data } = await apiClient.get('/api/streaks');
  return normalizeStreak(data);
}

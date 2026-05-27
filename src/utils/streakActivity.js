import { startOfDay } from './date.js';

const STORAGE_KEY = 'onroot:studyActivityDates';
const DAY_MS = 24 * 60 * 60 * 1000;

function parseActivityDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const dateParts = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateParts) {
      const [, year, month, day] = dateParts;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(value) {
  const date = parseActivityDate(value);

  if (!date) {
    return null;
  }

  const normalizedDate = startOfDay(date);
  const year = normalizedDate.getFullYear();
  const month = String(normalizedDate.getMonth() + 1).padStart(2, '0');
  const day = String(normalizedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function readStudyActivityDates() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const dates = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(dates) ? dates.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function markStudyActivity(date = new Date()) {
  if (typeof window === 'undefined') {
    return;
  }

  const dateKey = toDateKey(date);

  if (!dateKey) {
    return;
  }

  const dates = new Set(readStudyActivityDates());
  dates.add(dateKey);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...dates].sort()));
}

export function writeStudyActivityDates(dates) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedDates = [...new Set(dates.map(toDateKey).filter(Boolean))];
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizedDates.sort())
  );
}

export function calculateCurrentStreak(dates, baseDate = new Date()) {
  const dateSet = new Set(dates.map(toDateKey).filter(Boolean));
  let cursor = startOfDay(baseDate);
  let streak = 0;

  while (dateSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  return streak;
}

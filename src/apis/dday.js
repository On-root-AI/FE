import apiClient from './client.js';

const ID_KEYS = ['id', 'ddayId', 'dDayId', 'dday_id'];
const TITLE_KEYS = ['title', 'name', 'content', 'label'];
const DATE_KEYS = ['targetDate', 'date', 'ddayDate', 'dDayDate', 'day'];

function readFirstValue(source, keys) {
  if (!source) return undefined;

  const matchedKey = keys.find((key) => source[key] !== undefined);
  return matchedKey ? source[matchedKey] : undefined;
}

function unwrapPayload(data) {
  return data?.data ?? data?.result ?? data;
}

function parseApiDate(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const dateParts = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateParts) {
    const [, year, month, day] = dateParts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatApiDate(value) {
  if (!(value instanceof Date)) {
    return value;
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDDayItem(data, fallback = {}) {
  const payload = unwrapPayload(data);
  const source = Array.isArray(payload) ? payload[0] : payload;
  const id = readFirstValue(source, ID_KEYS) ?? fallback.id;
  const title = readFirstValue(source, TITLE_KEYS) ?? fallback.title;
  const date = parseApiDate(
    readFirstValue(source, DATE_KEYS) ?? fallback.targetDate ?? fallback.date
  );

  if (id === undefined || !title || !date) {
    return null;
  }

  return {
    id,
    title,
    date,
  };
}

function normalizeDDayList(data) {
  const payload = unwrapPayload(data);
  const items = Array.isArray(payload)
    ? payload
    : payload?.ddays || payload?.items || payload?.content || [];

  return items
    .map((item) => normalizeDDayItem(item))
    .filter((item) => item !== null);
}

export async function getDDays() {
  const { data } = await apiClient.get('/api/ddays');
  return normalizeDDayList(data);
}

export async function createDDay({ title, targetDate }) {
  const payload = { title, targetDate: formatApiDate(targetDate) };
  const { data } = await apiClient.post('/api/ddays', payload);
  return normalizeDDayItem(data, payload);
}

export async function updateDDay(ddayId, { title, targetDate }) {
  const payload = { title, targetDate: formatApiDate(targetDate) };
  const { data } = await apiClient.patch(`/api/ddays/${ddayId}`, payload);
  return normalizeDDayItem(data, { id: ddayId, ...payload });
}

export async function deleteDDay(ddayId) {
  await apiClient.delete(`/api/ddays/${ddayId}`);
}

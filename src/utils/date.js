const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatKoreanFullDate(date) {
  const day = WEEKDAYS[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${day}요일`;
}

export function formatKoreanMonth(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatShortDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function getWeekDays(baseDate) {
  const selected = startOfDay(baseDate);
  const sunday = new Date(selected);
  sunday.setDate(selected.getDate() - selected.getDay());

  return WEEKDAYS.map((week, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);

    return {
      week,
      date,
      selected: startOfDay(date).getTime() === selected.getTime(),
    };
  });
}

export function getCalendarCells(displayDate) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month,
    };
  });
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function getDdayLabel(today, targetDate) {
  const diff = Math.round(
    (startOfDay(targetDate) - startOfDay(today)) / DAY_MS
  );

  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export { WEEKDAYS };

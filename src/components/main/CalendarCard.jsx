import styles from '../../styles/components/main/CalendarCard.module.css';
import {
  formatKoreanMonth,
  getCalendarCells,
  isSameDay,
  WEEKDAYS,
} from '../../utils/date.js';

export default function CalendarCard({
  displayDate = new Date(),
  selectedDate = new Date(),
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  onToggleExpand,
  size = 'compact',
}) {
  const cells = getCalendarCells(displayDate);
  const visibleCells =
    size === 'compact' ? getCompactCells(cells, selectedDate) : cells;

  return (
    <section
      className={`${styles.card} ${styles[size]}`}
      aria-label={`${formatKoreanMonth(displayDate)} 달력`}
    >
      <div className={styles.header}>
        <button type="button" aria-label="이전 달" onClick={onPreviousMonth}>
          ‹
        </button>
        <h2>{formatKoreanMonth(displayDate)}</h2>
        <button type="button" aria-label="다음 달" onClick={onNextMonth}>
          ›
        </button>
      </div>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.grid}>
        {visibleCells.map((cell) => (
          <button
            key={cell.date.toISOString()}
            className={[
              isSameDay(cell.date, selectedDate) ? styles.selected : '',
              cell.inCurrentMonth ? '' : styles.outside,
            ].join(' ')}
            type="button"
            aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
            onClick={() => onSelectDate?.(cell.date)}
          >
            {cell.day}
          </button>
        ))}
      </div>
      {size === 'compact' || size === 'expanded' ? (
        <button
          className={[
            styles.expandButton,
            size === 'expanded' ? styles.collapseButton : '',
          ].join(' ')}
          type="button"
          aria-label={size === 'expanded' ? '달력 접기' : '달력 펼치기'}
          aria-expanded={size === 'expanded'}
          onClick={onToggleExpand}
        />
      ) : null}
    </section>
  );
}

function getCompactCells(cells, selectedDate) {
  const selectedIndex = cells.findIndex((cell) =>
    isSameDay(cell.date, selectedDate)
  );

  if (selectedIndex === -1) {
    return cells.slice(0, 14);
  }

  const selectedRow = Math.floor(selectedIndex / 7);
  const startRow = Math.max(0, selectedRow - 1);

  return cells.slice(startRow * 7, startRow * 7 + 14);
}

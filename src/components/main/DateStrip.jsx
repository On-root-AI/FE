import styles from '../../styles/components/main/DateStrip.module.css';
import { getWeekDays } from '../../utils/date.js';

export default function DateStrip({ selectedDate = new Date(), onSelectDate }) {
  const days = getWeekDays(selectedDate);

  return (
    <div className={styles.strip} aria-label="주간 날짜">
      {days.map((day) => (
        <button
          key={day.date.toISOString()}
          className={`${styles.day} ${day.selected ? styles.selected : ''}`}
          type="button"
          aria-current={day.selected ? 'date' : undefined}
          onClick={() => onSelectDate?.(day.date)}
        >
          <span>{day.week}</span>
          <strong>{day.date.getDate()}</strong>
        </button>
      ))}
    </div>
  );
}

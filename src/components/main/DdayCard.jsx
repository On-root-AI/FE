import styles from '../../styles/components/main/DdayCard.module.css';
import { formatShortDate, getDdayLabel } from '../../utils/date.js';

export default function DdayCard({
  item,
  draftDate,
  today,
  onAdd,
  onSelectDate,
}) {
  const hasItem = Boolean(item);
  const date = hasItem ? item.date : draftDate;
  const title = hasItem ? item.title : '...';
  const label = date ? getDdayLabel(today, date) : 'D-Day';

  return (
    <section className={styles.card} aria-label="D-Day">
      <button
        className={styles.summary}
        type="button"
        onClick={hasItem ? onAdd : onSelectDate}
      >
        <strong>{label}</strong>
        <span>{title}</span>
        {date ? (
          <time dateTime={date.toISOString()}>{formatShortDate(date)}</time>
        ) : null}
      </button>
      <button className={styles.addRow} type="button" onClick={onAdd}>
        <span aria-hidden="true">+</span>
        D-Day 추가하기
      </button>
    </section>
  );
}

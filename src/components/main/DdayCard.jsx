import styles from '../../styles/components/main/DdayCard.module.css';
import { formatShortDate, getDdayLabel } from '../../utils/date.js';

export default function DdayCard({
  item,
  draftDate,
  today,
  isMenuOpen = false,
  onAdd,
  onSelectDate,
  onToggleMenu,
  onEdit,
  onDelete,
}) {
  const hasItem = Boolean(item);
  const date = hasItem ? item.date : draftDate;
  const title = hasItem ? item.title : '...';
  const label = date ? getDdayLabel(today, date) : 'D-Day';

  return (
    <section className={styles.card} aria-label="D-Day">
      <div className={styles.summary}>
        <button
          className={styles.summaryContent}
          type="button"
          onClick={hasItem ? onAdd : onSelectDate}
        >
          <strong>{label}</strong>
          <span className={styles.separator} aria-hidden="true">
            |
          </span>
          <span>{title}</span>
          {date ? (
            <time dateTime={date.toISOString()}>{formatShortDate(date)}</time>
          ) : null}
        </button>
        {hasItem ? (
          <button
            className={styles.menuButton}
            type="button"
            aria-label={`${title} 설정`}
            aria-expanded={isMenuOpen}
            onClick={onToggleMenu}
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
        {hasItem && isMenuOpen ? (
          <div className={styles.menu} role="menu" aria-label="D-Day 설정">
            <button type="button" role="menuitem" onClick={onEdit}>
              <span>수정</span>
              <span className={styles.editIcon} aria-hidden="true" />
            </button>
            <button type="button" role="menuitem" onClick={onDelete}>
              <span>삭제</span>
              <span className={styles.deleteIcon} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
      <button className={styles.addRow} type="button" onClick={onAdd}>
        <span aria-hidden="true">+</span>
        D-Day 추가하기
      </button>
    </section>
  );
}

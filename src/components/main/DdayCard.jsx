import styles from '../../styles/components/main/DdayCard.module.css';
import { formatShortDate, getDdayLabel } from '../../utils/date.js';

export default function DdayCard({
  items = [],
  today,
  onAdd,
  openMenuId,
  onToggleMenu,
  onEdit,
  onDelete,
}) {
  return (
    <section className={styles.card} aria-label="D-Day">
      <div className={styles.summaryList}>
        {items.map((item) => {
          const label = getDdayLabel(today, item.date);
          const isMenuOpen = openMenuId === item.id;

          return (
            <div className={styles.summary} key={item.id}>
              <button
                className={styles.summaryContent}
                type="button"
                onClick={() => onEdit(item.id)}
              >
                <strong>{label}</strong>
                <span className={styles.separator} aria-hidden="true">
                  |
                </span>
                <span>{item.title}</span>
                <time dateTime={item.date.toISOString()}>
                  {formatShortDate(item.date)}
                </time>
              </button>
              <button
                className={styles.menuButton}
                type="button"
                aria-label={`${item.title} 설정`}
                aria-expanded={isMenuOpen}
                onClick={() => onToggleMenu(item.id)}
              >
                <span aria-hidden="true" />
              </button>
              {isMenuOpen ? (
                <div
                  className={styles.menu}
                  role="menu"
                  aria-label="D-Day 설정"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => onEdit(item.id)}
                  >
                    <span>수정</span>
                    <span className={styles.editIcon} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => onDelete(item.id)}
                  >
                    <span>삭제</span>
                    <span className={styles.deleteIcon} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <button className={styles.addRow} type="button" onClick={onAdd}>
        <span aria-hidden="true">+</span>
        D-Day 추가하기
      </button>
    </section>
  );
}

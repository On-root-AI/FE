import styles from '../../styles/components/main/DdayCard.module.css';
import { formatShortDate, getDdayLabel } from '../../utils/date.js';
import penIcon from '../../assets/figma/pen.png';
import deleteIcon from '../../assets/figma/delete.png';

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
          // [수정] date가 문자열로 넘어올 수 있으므로 Date 객체로 변환
          const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
          const label = getDdayLabel(today, itemDate);
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
                {/* [수정] itemDate로 변환된 Date 객체 사용 */}
                <time dateTime={itemDate.toISOString()}>
                  {formatShortDate(itemDate)}
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
                    {/* [수정] pen.png 아이콘 추가 */}
                    <img src={penIcon} alt="" aria-hidden="true" width={10} height={10} />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => onDelete(item.id)}
                  >
                    <span>삭제</span>
                    {/* [수정] delete.png 아이콘 추가 */}
                    <img src={deleteIcon} alt="" aria-hidden="true" width={9} height={10} />
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
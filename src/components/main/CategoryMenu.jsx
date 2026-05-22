import styles from '../../styles/components/main/CategoryMenu.module.css';

export default function CategoryMenu({ onEdit, onDelete }) {
  return (
    <div className={styles.menu} role="menu" aria-label="카테고리 설정">
      <button type="button" role="menuitem" onClick={onEdit}>
        <span>수정</span>
        <span className={styles.editIcon} aria-hidden="true" />
      </button>
      <button type="button" role="menuitem" onClick={onDelete}>
        <span>삭제</span>
        <span className={styles.deleteIcon} aria-hidden="true" />
      </button>
    </div>
  );
}

import styles from '../../styles/components/main/CategoryTaskItem.module.css';

export default function CategoryTaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`${styles.item} ${task.completed ? styles.completed : ''}`}>
      <button
        className={styles.checkButton}
        type="button"
        aria-label={`${task.title} 완료 상태 변경`}
        aria-pressed={task.completed}
        onClick={onToggle}
      >
        <span aria-hidden="true" />
      </button>
      <button className={styles.titleButton} type="button" onClick={onToggle}>
        <span>{task.title}</span>
      </button>
      <button
        className={styles.deleteButton}
        type="button"
        aria-label={`${task.title} 삭제`}
        onClick={onDelete}
      >
        x
      </button>
    </li>
  );
}

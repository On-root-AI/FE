import styles from '../../styles/components/common/ActionCard.module.css';

export default function ActionCard({ children, tone = 'soft', onClick }) {
  return (
    <button
      className={`${styles.card} ${styles[tone]}`}
      type="button"
      onClick={onClick}
    >
      <span className={styles.plus} aria-hidden="true">
        +
      </span>
      <span>{children}</span>
    </button>
  );
}

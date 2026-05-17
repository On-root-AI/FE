import Mascot from '../common/Mascot.jsx';
import styles from '../../styles/components/chat/ChatSearchLoading.module.css';

export default function ChatSearchLoading() {
  return (
    <div className={styles.wrap} role="status" aria-label="AI 탐색중">
      <div className={styles.bubble} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Mascot className={styles.mascot} variant="seed" size="sm" alt="탐색중" />
    </div>
  );
}

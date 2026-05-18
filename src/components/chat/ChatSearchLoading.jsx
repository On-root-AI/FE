import chatBottomMascot from '../../assets/figma/Chat_btm.png';
import styles from '../../styles/components/chat/ChatSearchLoading.module.css';

export default function ChatSearchLoading() {
  return (
    <div className={styles.wrap} role="status" aria-label="AI 탐색중">
      <div className={styles.bubble} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img className={styles.mascot} src={chatBottomMascot} alt="탐색중" />
    </div>
  );
}

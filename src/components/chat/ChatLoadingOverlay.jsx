import loadingChat from '../../assets/figma/loading-chat.png';
import styles from '../../styles/components/chat/ChatLoadingOverlay.module.css';

export default function ChatLoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-label="온루AI 로딩중">
      <div className={styles.loader}>
        <img
          className={styles.loadingMascot}
          src={loadingChat}
          alt="온루AI 로딩"
        />
      </div>
    </div>
  );
}

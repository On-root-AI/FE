import styles from '../../styles/components/chat/ChatBubble.module.css';

export default function ChatBubble({ role, children }) {
  return <div className={`${styles.bubble} ${styles[role]}`}>{children}</div>;
}

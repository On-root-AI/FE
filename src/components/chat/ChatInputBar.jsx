import styles from '../../styles/components/chat/ChatInputBar.module.css';

export default function ChatInputBar({ value, disabled, onChange, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        aria-label="채팅 메시지"
        disabled={disabled}
        placeholder="어떤 도움이 필요한가요?"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        disabled={disabled || !value.trim()}
        type="submit"
        aria-label="메시지 보내기"
      >
        ▲
      </button>
    </form>
  );
}

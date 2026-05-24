import styles from '../../styles/components/chat/ChatInputBar.module.css';

function syncKeyboardInputBottom() {
  const viewport = window.visualViewport;
  const viewportHeight = viewport?.height || window.innerHeight;
  const viewportOffsetTop = viewport?.offsetTop || 0;
  const innerKeyboardOffset = viewport
    ? window.innerHeight - viewportHeight - viewportOffsetTop
    : 0;
  const screenKeyboardOffset = viewport
    ? window.screen.height - viewportHeight - viewportOffsetTop
    : 0;
  const keyboardOffset = Math.max(
    0,
    innerKeyboardOffset,
    screenKeyboardOffset
  );
  const inputBottom = keyboardOffset > 0 ? keyboardOffset + 16 : 24;

  document.documentElement.style.setProperty(
    '--chat-input-bottom',
    `${inputBottom}px`
  );
}

function resetKeyboardInputBottom() {
  document.documentElement.style.removeProperty('--chat-input-bottom');
}

export default function ChatInputBar({ value, disabled, onChange, onSubmit }) {
  const lockViewportScroll = () => {
    syncKeyboardInputBottom();
    window.requestAnimationFrame(syncKeyboardInputBottom);
    window.setTimeout(syncKeyboardInputBottom, 80);
    window.setTimeout(syncKeyboardInputBottom, 180);
    window.setTimeout(syncKeyboardInputBottom, 320);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        aria-label="채팅 메시지"
        disabled={disabled}
        placeholder="어떤 도움이 필요한가요?"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={resetKeyboardInputBottom}
        onFocus={lockViewportScroll}
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

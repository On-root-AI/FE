import { useEffect, useRef } from 'react';
import styles from '../../styles/components/chat/ChatInputBar.module.css';

function syncKeyboardInputBottom() {
  const viewport = window.visualViewport;
  const layoutHeight = Math.max(
    window.innerHeight,
    document.documentElement.clientHeight || 0
  );
  const keyboardOffset = viewport
    ? Math.max(0, layoutHeight - viewport.height - viewport.offsetTop)
    : 0;
  const inputBottom = keyboardOffset > 0 ? keyboardOffset + 12 : 24;

  document.documentElement.style.setProperty(
    '--chat-input-bottom',
    `${inputBottom}px`
  );
}

function resetKeyboardInputBottom() {
  document.documentElement.style.removeProperty('--chat-input-bottom');
}

function resetWindowScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}

export default function ChatInputBar({ value, disabled, onChange, onSubmit }) {
  const isFocusedRef = useRef(false);

  const lockViewportScroll = () => {
    syncKeyboardInputBottom();
    resetWindowScroll();
    window.requestAnimationFrame(syncKeyboardInputBottom);
    window.requestAnimationFrame(resetWindowScroll);
    window.setTimeout(syncKeyboardInputBottom, 80);
    window.setTimeout(resetWindowScroll, 80);
    window.setTimeout(syncKeyboardInputBottom, 180);
    window.setTimeout(resetWindowScroll, 180);
    window.setTimeout(syncKeyboardInputBottom, 320);
    window.setTimeout(resetWindowScroll, 320);
  };

  useEffect(() => {
    const handleViewportChange = () => {
      if (!isFocusedRef.current) {
        return;
      }

      syncKeyboardInputBottom();
      resetWindowScroll();
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        'resize',
        handleViewportChange
      );
      window.visualViewport?.removeEventListener(
        'scroll',
        handleViewportChange
      );
      window.removeEventListener('resize', handleViewportChange);
      resetKeyboardInputBottom();
    };
  }, []);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        aria-label="채팅 메시지"
        disabled={disabled}
        placeholder="어떤 도움이 필요한가요?"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          isFocusedRef.current = false;
          resetKeyboardInputBottom();
          resetWindowScroll();
        }}
        onFocus={() => {
          isFocusedRef.current = true;
          lockViewportScroll();
        }}
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

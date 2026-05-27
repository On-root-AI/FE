import { useEffect, useRef, useState } from 'react';
import Mascot from '../common/Mascot.jsx';
import styles from '../../styles/components/main/CategoryTextInput.module.css';

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
    '--category-input-bottom',
    `${inputBottom}px`
  );
}

function resetKeyboardInputBottom() {
  document.documentElement.style.removeProperty('--category-input-bottom');
}

function resetWindowScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}

export default function CategoryTextInput({
  initialValue = '',
  placeholder,
  onSubmit,
  onClose,
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
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
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
      isFocusedRef.current = true;
      lockViewportScroll();
    }, 0);

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
      window.clearTimeout(focusTimer);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextValue = value.trim();
    if (!nextValue) return;

    onSubmit(nextValue);
  };

  return (
    <div className={styles.overlay}>
      <button
        className={styles.scrim}
        type="button"
        aria-label="입력 닫기"
        onClick={onClose}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <Mascot className={styles.mascot} size="sm" variant="small" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
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
        <button className={styles.submitButton} type="submit" aria-label="완료">
          <span aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

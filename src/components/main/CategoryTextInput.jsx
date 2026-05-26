import { useEffect, useRef, useState } from 'react';
import Mascot from '../common/Mascot.jsx';
import styles from '../../styles/components/main/CategoryTextInput.module.css';

export default function CategoryTextInput({
  initialValue = '',
  placeholder,
  onSubmit,
  onClose,
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
    }, 0);

    return () => window.clearTimeout(focusTimer);
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
        />
        <button className={styles.submitButton} type="submit" aria-label="완료">
          <span aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

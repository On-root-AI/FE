import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/main/DdayTitleInput.module.css';
import { formatShortDate } from '../../utils/date.js';

export default function DdayTitleInput({
  selectedDate,
  initialTitle = '',
  onSubmit,
  onClose,
}) {
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <button className={styles.backdrop} type="button" onClick={onClose}>
        <span>닫기</span>
      </button>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p>{formatShortDate(selectedDate)}</p>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="일정을 입력하세요"
          maxLength={24}
        />
        <button type="submit" disabled={!title.trim()}>
          완료
        </button>
      </form>
    </div>
  );
}

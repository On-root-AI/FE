import { useMemo, useState } from 'react';
import CalendarCard from './CalendarCard.jsx';
import styles from '../../styles/components/main/DatePickerModal.module.css';
import { formatKoreanFullDate } from '../../utils/date.js';

export default function DatePickerModal({
  selectedDate,
  onChange,
  onConfirm,
  onClose,
}) {
  const [displayDate, setDisplayDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const selectedLabel = useMemo(
    () => formatKoreanFullDate(selectedDate),
    [selectedDate]
  );

  const moveMonth = (amount) => {
    setDisplayDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  const handleSelectDate = (date) => {
    onChange(date);
    setDisplayDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <button className={styles.backdrop} type="button" onClick={onClose}>
        <span>닫기</span>
      </button>
      <div className={styles.panel}>
        <CalendarCard
          displayDate={displayDate}
          selectedDate={selectedDate}
          onPreviousMonth={() => moveMonth(-1)}
          onNextMonth={() => moveMonth(1)}
          onSelectDate={handleSelectDate}
          size="large"
        />
        <div className={styles.actions}>
          <p>{selectedLabel}</p>
          <button type="button" onClick={onConfirm}>
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import calendarLeft from '../../assets/figma/Calendar_left.png';
import calendarRight from '../../assets/figma/Calendar_right.png';
import checkIcon from '../../assets/figma/check-icon.png';
import styles from '../../styles/components/main/DatePickerModal.module.css';
import { isSameDay, WEEKDAYS } from '../../utils/date.js';

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

export default function DatePickerModal({
  selectedDate,
  onChange,
  onConfirm,
  onClose,
}) {
  const [displayDate, setDisplayDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const yearOptions = useMemo(() => {
    const displayYear = displayDate.getFullYear();
    return Array.from({ length: 11 }, (_, index) => displayYear - 5 + index);
  }, [displayDate]);

  const calendarCells = useMemo(
    () => getDatePickerCells(displayDate),
    [displayDate]
  );

  const handleSelectDate = (date) => {
    onChange(date);
    setDisplayDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleYearChange = (event) => {
    setDisplayDate(
      new Date(Number(event.target.value), displayDate.getMonth(), 1)
    );
  };

  const handleMonthChange = (event) => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), Number(event.target.value), 1)
    );
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <button className={styles.backdrop} type="button" onClick={onClose}>
        <span>닫기</span>
      </button>
      <div className={styles.panel}>
        <img
          className={`${styles.calendarMascot} ${styles.leftMascot}`}
          src={calendarLeft}
          alt=""
          aria-hidden="true"
        />
        <img
          className={`${styles.calendarMascot} ${styles.rightMascot}`}
          src={calendarRight}
          alt=""
          aria-hidden="true"
        />
        <div className={styles.pickerCard}>
          <div className={styles.pickerHeader}>
            <label className={styles.selectBox}>
              <span className={styles.visuallyHidden}>연도 선택</span>
              <select
                value={displayDate.getFullYear()}
                onChange={handleYearChange}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.selectBox}>
              <span className={styles.visuallyHidden}>월 선택</span>
              <select
                value={displayDate.getMonth()}
                onChange={handleMonthChange}
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month + 1}월
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.pickerBody}>
            <div className={styles.weekdays}>
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className={styles.dateGrid}>
              {calendarCells.map((cell, index) =>
                cell.date ? (
                  <button
                    key={cell.date.toISOString()}
                    className={[
                      styles.dateCell,
                      isSameDay(cell.date, selectedDate)
                        ? styles.selectedCell
                        : '',
                      cell.inCurrentMonth ? '' : styles.outsideCell,
                    ].join(' ')}
                    type="button"
                    aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
                    onClick={() => handleSelectDate(cell.date)}
                  >
                    {cell.day}
                  </button>
                ) : (
                  <span
                    key={`empty-${index}`}
                    className={styles.emptyCell}
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          </div>
        </div>
        <button
          className={styles.confirmButton}
          type="button"
          aria-label="날짜 선택 완료"
          onClick={onConfirm}
        >
          <img src={checkIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function getDatePickerCells(displayDate) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingEmptyCount = firstDay.getDay();
  const currentMonthDays = lastDay.getDate();
  const cells = [];

  for (let index = 0; index < leadingEmptyCount; index += 1) {
    cells.push({ date: null, day: null, inCurrentMonth: false });
  }

  for (let day = 1; day <= currentMonthDays; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      day,
      inCurrentMonth: true,
    });
  }

  const trailingCount = 42 - cells.length;
  for (let day = 1; day <= trailingCount; day += 1) {
    cells.push({
      date: new Date(year, month + 1, day),
      day,
      inCurrentMonth: false,
    });
  }

  return cells;
}

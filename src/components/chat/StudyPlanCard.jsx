import { useState } from 'react';
import minusIcon from '../../assets/figma/minus.png';
import plusIcon from '../../assets/figma/plus.png';
import styles from '../../styles/components/chat/StudyPlanCard.module.css';

function createEditableDays(days) {
  return days.map((day, dayIndex) => ({
    id: `${day.date || 'day'}-${dayIndex}`,
    date: day.date,
    tasks: day.tasks.map((task, taskIndex) => ({
      id: `${day.date || 'day'}-${dayIndex}-task-${taskIndex}`,
      text: task,
      isDone: false,
    })),
  }));
}

export default function StudyPlanCard({
  title = '심리학 기말고사 7일 학습 계획',
  days = [],
  maxDays,
  onExpandedChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingDayIndex, setEditingDayIndex] = useState(null);
  const [editableDays, setEditableDays] = useState(() =>
    createEditableDays(days)
  );
  const visibleDays =
    maxDays && !isExpanded ? editableDays.slice(0, maxDays) : editableDays;
  const hasMore = maxDays && editableDays.length > maxDays;

  function updateDate(dayIndex, value) {
    setEditableDays((prev) =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, date: value } : day
      )
    );
  }

  function updateTask(dayIndex, taskIndex, value) {
    setEditableDays((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              tasks: day.tasks.map((task, currentTaskIndex) =>
                currentTaskIndex === taskIndex ? { ...task, text: value } : task
              ),
            }
          : day
      )
    );
  }

  function toggleTask(dayIndex, taskIndex) {
    setEditableDays((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              tasks: day.tasks.map((task, currentTaskIndex) =>
                currentTaskIndex === taskIndex
                  ? { ...task, isDone: !task.isDone }
                  : task
              ),
            }
          : day
      )
    );
  }

  function toggleExpanded() {
    setIsExpanded((prev) => {
      const next = !prev;
      onExpandedChange?.(next);
      return next;
    });
  }

  return (
    <section
      className={[styles.card, isExpanded ? styles.expanded : ''].join(' ')}
      aria-label={title}
    >
      <header>
        <h2>{title}</h2>
        {hasMore ? (
          <button
            className={styles.expandButton}
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? '학습 계획 접기' : '학습 계획 펼치기'}
            onClick={toggleExpanded}
          >
            <img src={isExpanded ? minusIcon : plusIcon} alt="" />
          </button>
        ) : null}
      </header>
      <div className={styles.days}>
        {visibleDays.map((day, dayIndex) => {
          const isEditing = editingDayIndex === dayIndex;

          return (
            <article className={styles.day} key={day.id}>
              <div className={styles.dayHeader}>
                {isEditing ? (
                  <input
                    className={styles.dateInput}
                    aria-label="플랜 날짜 수정"
                    value={day.date}
                    onChange={(event) =>
                      updateDate(dayIndex, event.target.value)
                    }
                  />
                ) : (
                  <strong>{day.date}</strong>
                )}
                {isExpanded ? (
                  <button
                    className={styles.editDay}
                    type="button"
                    aria-label={isEditing ? '플랜 수정 완료' : '플랜 수정'}
                    onClick={() =>
                      setEditingDayIndex(isEditing ? null : dayIndex)
                    }
                  >
                    {isEditing ? '완료' : '✎'}
                  </button>
                ) : null}
              </div>
              <ul>
                {day.tasks.map((task, taskIndex) => (
                  <li
                    className={task.isDone ? styles.doneTask : ''}
                    key={task.id}
                  >
                    <button
                      className={styles.checkButton}
                      type="button"
                      aria-pressed={task.isDone}
                      aria-label={task.isDone ? '완료 취소' : '완료 표시'}
                      onClick={() => toggleTask(dayIndex, taskIndex)}
                    />
                    {isEditing ? (
                      <textarea
                        className={styles.taskInput}
                        aria-label="플랜 내용 수정"
                        rows={1}
                        value={task.text}
                        onChange={(event) =>
                          updateTask(dayIndex, taskIndex, event.target.value)
                        }
                      />
                    ) : (
                      <span className={styles.taskText}>{task.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

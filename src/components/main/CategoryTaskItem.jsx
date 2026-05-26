import { useRef, useState } from 'react';
import styles from '../../styles/components/main/CategoryTaskItem.module.css';

const MAX_SWIPE_OFFSET = 82;
const DELETE_SWIPE_THRESHOLD = 52;
const DRAG_CLICK_THRESHOLD = 16;
const SWIPE_START_THRESHOLD = 8;

export default function CategoryTaskItem({ task, onToggle, onDelete }) {
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffsetX = useRef(0);
  const suppressClick = useRef(false);
  const isSwiping = useRef(false);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const closeSwipe = () => setOffsetX(0);

  const handlePointerDown = (event) => {
    startX.current = event.clientX;
    startY.current = event.clientY;
    currentOffsetX.current = 0;
    suppressClick.current = false;
    isSwiping.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - startX.current;
    const deltaY = event.clientY - startY.current;

    if (
      !isSwiping.current &&
      Math.abs(deltaX) < SWIPE_START_THRESHOLD &&
      Math.abs(deltaY) < SWIPE_START_THRESHOLD
    ) {
      return;
    }

    if (!isSwiping.current && Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsDragging(false);
      closeSwipe();
      return;
    }

    isSwiping.current = true;

    const nextOffset = Math.min(
      0,
      Math.max(-MAX_SWIPE_OFFSET, deltaX)
    );
    currentOffsetX.current = nextOffset;
    suppressClick.current = Math.abs(nextOffset) > DRAG_CLICK_THRESHOLD;
    setOffsetX(nextOffset);
  };

  const handlePointerEnd = () => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    if (Math.abs(currentOffsetX.current) > DELETE_SWIPE_THRESHOLD) {
      setOffsetX(-MAX_SWIPE_OFFSET);
      suppressClick.current = true;
      onDelete();
      return;
    }

    closeSwipe();
  };

  const handleToggle = (event) => {
    if (suppressClick.current) {
      event.preventDefault();
      suppressClick.current = false;
      return;
    }

    onToggle();
  };

  return (
    <li className={styles.swipeItem}>
      <div
        className={[
          styles.item,
          task.completed ? styles.completed : '',
          isDragging ? styles.dragging : '',
        ].join(' ')}
        style={{ transform: `translateX(${offsetX}px)` }}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
      >
        <button
          className={styles.checkButton}
          type="button"
          aria-label={`${task.title} 완료 상태 변경`}
          aria-pressed={task.completed}
          onClick={handleToggle}
        >
          <span aria-hidden="true" />
        </button>
        <button
          className={styles.titleButton}
          type="button"
          onClick={handleToggle}
        >
          <span>{task.title}</span>
        </button>
      </div>
    </li>
  );
}

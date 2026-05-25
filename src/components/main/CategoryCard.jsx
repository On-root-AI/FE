import { useState } from 'react';
import categoryIcon from '../../assets/figma/Category.png';
import CategoryMenu from './CategoryMenu.jsx';
import CategoryTaskItem from './CategoryTaskItem.jsx';
import styles from '../../styles/components/main/CategoryCard.module.css';

const DEFAULT_VISIBLE_TASK_COUNT = 3;

export default function CategoryCard({
  category,
  isMenuOpen,
  isCollapsed,
  onToggleCollapse,
  onAddTask,
  onToggleMenu,
  onEdit,
  onDelete,
  onToggleTask,
  onDeleteTask,
}) {
  const [isTaskListExpanded, setIsTaskListExpanded] = useState(false);
  const hasHiddenTasks = category.tasks.length > DEFAULT_VISIBLE_TASK_COUNT;
  const visibleTasks = isTaskListExpanded
    ? category.tasks
    : category.tasks.slice(0, DEFAULT_VISIBLE_TASK_COUNT);
  const hiddenTaskCount = category.tasks.length - DEFAULT_VISIBLE_TASK_COUNT;

  return (
    <section
      className={`${styles.card} ${isCollapsed ? styles.collapsed : ''}`}
      aria-label={`${category.title} 카테고리`}
    >
      <header className={styles.header}>
        <img
          className={styles.categoryIcon}
          src={categoryIcon}
          alt=""
          aria-hidden="true"
        />
        <h3>{category.title}</h3>
        <button
          className={styles.collapseButton}
          type="button"
          aria-label={`${category.title} ${isCollapsed ? '펼치기' : '접기'}`}
          aria-expanded={!isCollapsed}
          onClick={onToggleCollapse}
        >
          <span aria-hidden="true" />
        </button>
        <button
          className={styles.addButton}
          type="button"
          aria-label={`${category.title} 항목 추가`}
          onClick={onAddTask}
        >
          <span aria-hidden="true" />
        </button>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={`${category.title} 설정`}
          aria-expanded={isMenuOpen}
          onClick={onToggleMenu}
        >
          <span aria-hidden="true" />
        </button>
        {isMenuOpen ? (
          <CategoryMenu onEdit={onEdit} onDelete={onDelete} />
        ) : null}
      </header>

      {!isCollapsed && category.tasks.length ? (
        <>
          <ul className={styles.tasks}>
            {visibleTasks.map((task) => (
              <CategoryTaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </ul>
          {hasHiddenTasks ? (
            <button
              className={styles.taskMoreButton}
              type="button"
              aria-expanded={isTaskListExpanded}
              onClick={() =>
                setIsTaskListExpanded((isExpanded) => !isExpanded)
              }
            >
              {isTaskListExpanded
                ? '세부 항목 접기'
                : `세부 항목 ${hiddenTaskCount}개 더보기`}
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

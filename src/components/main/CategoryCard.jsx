import { useState } from 'react';
import categoryIcon from '../../assets/figma/Category.png';
import CategoryMenu from './CategoryMenu.jsx';
import CategoryTaskItem from './CategoryTaskItem.jsx';
import styles from '../../styles/components/main/CategoryCard.module.css';

const DEFAULT_VISIBLE_TASK_COUNT = 3;

function TaskGroup({
  title,
  tasks,
  emptyMessage,
  isExpanded,
  onToggleExpand,
  onToggleTask,
  onDeleteTask,
}) {
  const hasHiddenTasks = tasks.length > DEFAULT_VISIBLE_TASK_COUNT;
  const visibleTasks = isExpanded
    ? tasks
    : tasks.slice(0, DEFAULT_VISIBLE_TASK_COUNT);
  const hiddenTaskCount = tasks.length - DEFAULT_VISIBLE_TASK_COUNT;

  return (
    <section className={styles.taskGroup} aria-label={title}>
      <h4 className={styles.taskGroupTitle}>
        {title}
        <span>{tasks.length}</span>
      </h4>
      {tasks.length ? (
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
      ) : (
        <p className={styles.emptyTaskText}>{emptyMessage}</p>
      )}
      {hasHiddenTasks ? (
        <button
          className={styles.taskMoreButton}
          type="button"
          aria-expanded={isExpanded}
          onClick={onToggleExpand}
        >
          {isExpanded ? `${title} 접기` : `${hiddenTaskCount}개 더보기`}
        </button>
      ) : null}
    </section>
  );
}

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
  const [expandedGroups, setExpandedGroups] = useState({
    today: false,
    week: false,
  });
  const todayTasks = category.todayTasks || [];
  const weekTasks = category.weekTasks || [];

  const toggleTaskGroup = (group) => {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [group]: !currentGroups[group],
    }));
  };

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

      {!isCollapsed ? (
        <div className={styles.taskGroups}>
          <TaskGroup
            title="오늘 할 일"
            tasks={todayTasks}
            emptyMessage="오늘은 예정된 계획이 없어요."
            isExpanded={expandedGroups.today}
            onToggleExpand={() => toggleTaskGroup('today')}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
          <TaskGroup
            title="이번 주 할 일"
            tasks={weekTasks}
            emptyMessage="이번 주 예정된 계획이 없어요."
            isExpanded={expandedGroups.week}
            onToggleExpand={() => toggleTaskGroup('week')}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      ) : null}
    </section>
  );
}

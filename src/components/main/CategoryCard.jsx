import categoryIcon from '../../assets/figma/Category.png';
import CategoryMenu from './CategoryMenu.jsx';
import CategoryTaskItem from './CategoryTaskItem.jsx';
import styles from '../../styles/components/main/CategoryCard.module.css';

export default function CategoryCard({
  category,
  isMenuOpen,
  onAddTask,
  onToggleMenu,
  onEdit,
  onDelete,
  onToggleTask,
  onDeleteTask,
}) {
  return (
    <section className={styles.card} aria-label={`${category.title} 카테고리`}>
      <header className={styles.header}>
        <img
          className={styles.categoryIcon}
          src={categoryIcon}
          alt=""
          aria-hidden="true"
        />
        <h3>{category.title}</h3>
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

      {category.tasks.length ? (
        <ul className={styles.tasks}>
          {category.tasks.map((task) => (
            <CategoryTaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

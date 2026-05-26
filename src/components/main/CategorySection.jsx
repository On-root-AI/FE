import { useState } from 'react';
import ActionCard from '../common/ActionCard.jsx';
import CategoryCard from './CategoryCard.jsx';
import styles from '../../styles/components/main/CategorySection.module.css';

export default function CategorySection({
  categories,
  openMenuId,
  onAddCategory,
  onAddTask,
  onToggleMenu,
  onEditCategory,
  onDeleteCategory,
  onToggleTask,
  onDeleteTask,
}) {
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState(
    () => new Set()
  );

  const toggleCollapse = (categoryId) => {
    setCollapsedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(categoryId)) {
        nextIds.delete(categoryId);
      } else {
        nextIds.add(categoryId);
      }

      return nextIds;
    });
  };

  const handleAddTask = (categoryId) => {
    setCollapsedCategoryIds((currentIds) => {
      if (!currentIds.has(categoryId)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);
      nextIds.delete(categoryId);
      return nextIds;
    });
    onAddTask(categoryId);
  };

  if (!categories.length) {
    return (
      <ActionCard tone="strong" onClick={onAddCategory}>
        카테고리 추가하기
      </ActionCard>
    );
  }

  return (
    <section className={styles.section} aria-label="카테고리">
      <div className={styles.list}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isMenuOpen={openMenuId === category.id}
            isCollapsed={collapsedCategoryIds.has(category.id)}
            onToggleCollapse={() => toggleCollapse(category.id)}
            onAddTask={() => handleAddTask(category.id)}
            onToggleMenu={() => onToggleMenu(category.id)}
            onEdit={() => onEditCategory(category.id)}
            onDelete={() => onDeleteCategory(category.id)}
            onToggleTask={(taskId) => onToggleTask(category.id, taskId)}
            onDeleteTask={(taskId) => onDeleteTask(category.id, taskId)}
          />
        ))}
      </div>
      <button className={styles.addRow} type="button" onClick={onAddCategory}>
        <span aria-hidden="true" />
        카테고리 추가하기
      </button>
    </section>
  );
}

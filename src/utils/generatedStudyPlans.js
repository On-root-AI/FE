const STORAGE_KEY = 'onroot:generatedStudyPlans';
const DELETED_STORAGE_KEY = 'onroot:deletedStudyPlanCategories';
const ID_PREFIX = 'chat-plan-';

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function normalizeTaskText(task) {
  if (typeof task === 'string') {
    return task.trim();
  }

  return (task?.text || task?.title || task?.content || '').trim();
}

function createSignature(category) {
  const title = (category?.title || '').trim().toLowerCase();
  const taskTitles = (category?.tasks || [])
    .map((task) => (task?.title || '').trim().toLowerCase())
    .filter(Boolean)
    .join('|');

  return `${title}:${taskTitles}`;
}

function readDeletedCategoryMatches() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const matches = JSON.parse(
      window.localStorage.getItem(DELETED_STORAGE_KEY) || '[]'
    );

    return Array.isArray(matches) ? matches : [];
  } catch {
    return [];
  }
}

function writeDeletedCategoryMatches(matches) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(matches));
}

function createDeleteMatch(category) {
  return {
    id: category?.id,
    signature: createSignature(category),
  };
}

function normalizeStoredCategory(category) {
  if (!category?.id || !category?.title || !Array.isArray(category.tasks)) {
    return null;
  }

  return {
    ...category,
    tasks: category.tasks.map((task, index) => ({
      id: task.id || `${category.id}-task-${index}`,
      title: task.title,
      completed: Boolean(task.completed),
      scheduledDate: task.scheduledDate,
      orderIndex: task.orderIndex ?? index,
    })),
  };
}

export function isGeneratedStudyPlanCategoryId(categoryId) {
  return String(categoryId).startsWith(ID_PREFIX);
}

export function isGeneratedStudyPlanCategory(category) {
  if (!category) {
    return false;
  }

  if (isGeneratedStudyPlanCategoryId(category.id)) {
    return true;
  }

  const categorySignature = createSignature(category);

  return readGeneratedStudyPlanCategories().some(
    (generatedCategory) => createSignature(generatedCategory) === categorySignature
  );
}

export function isDeletedStudyPlanCategory(category) {
  const categorySignature = createSignature(category);

  return readDeletedCategoryMatches().some(
    (match) =>
      (match.id !== undefined && match.id === category?.id) ||
      (match.signature && match.signature === categorySignature)
  );
}

export function filterDeletedStudyPlanCategories(categories) {
  return categories.filter((category) => !isDeletedStudyPlanCategory(category));
}

export function readGeneratedStudyPlanCategories() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const categories = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || '[]'
    );

    return Array.isArray(categories)
      ? categories.map(normalizeStoredCategory).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function writeGeneratedStudyPlanCategories(categories) {
  if (typeof window === 'undefined') {
    return;
  }

  const generatedCategories = categories.filter((category) =>
    isGeneratedStudyPlanCategoryId(category.id)
  );

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(generatedCategories)
  );
}

export function saveGeneratedStudyPlanCategory({ title, days }) {
  if (!Array.isArray(days) || days.length === 0) {
    return null;
  }

  const id = `${ID_PREFIX}${createId()}`;
  const tasks = days.flatMap((day, dayIndex) =>
    (day.tasks || [])
      .map((task, taskIndex) => ({
        id: `${id}-task-${dayIndex}-${taskIndex}`,
        title: normalizeTaskText(task),
        completed: false,
        scheduledDate: day.date,
        orderIndex: dayIndex * 100 + taskIndex,
      }))
      .filter((task) => task.title)
  );

  if (tasks.length === 0) {
    return null;
  }

  const category = {
    id,
    title: title || '학습 계획',
    category: title || '학습 계획',
    targetDate: days[0]?.date,
    tasks,
  };
  const currentCategories = readGeneratedStudyPlanCategories();
  const nextSignature = createSignature(category);
  writeDeletedCategoryMatches(
    readDeletedCategoryMatches().filter(
      (match) => match.id !== category.id && match.signature !== nextSignature
    )
  );

  const nextCategories = [
    category,
    ...currentCategories.filter(
      (currentCategory) => createSignature(currentCategory) !== nextSignature
    ),
  ];

  writeGeneratedStudyPlanCategories(nextCategories);
  return category;
}

export function mergeGeneratedStudyPlanCategories(categories) {
  const currentSignatures = new Set(categories.map(createSignature));
  const generatedCategories = readGeneratedStudyPlanCategories().filter(
    (category) => !currentSignatures.has(createSignature(category))
  );

  return filterDeletedStudyPlanCategories([...categories, ...generatedCategories]);
}

export function removeGeneratedStudyPlanCategory(categoryId) {
  const nextCategories = readGeneratedStudyPlanCategories().filter(
    (category) => category.id !== categoryId
  );

  writeGeneratedStudyPlanCategories(nextCategories);
}

export function removeGeneratedStudyPlanCategoryMatch(category) {
  const categorySignature = createSignature(category);
  const nextCategories = readGeneratedStudyPlanCategories().filter(
    (generatedCategory) =>
      generatedCategory.id !== category?.id &&
      createSignature(generatedCategory) !== categorySignature
  );

  writeGeneratedStudyPlanCategories(nextCategories);
}

export function markStudyPlanCategoryDeleted(category) {
  if (!category) {
    return;
  }

  const nextMatch = createDeleteMatch(category);
  const nextMatches = [
    nextMatch,
    ...readDeletedCategoryMatches().filter(
      (match) => match.id !== nextMatch.id
    ),
  ];

  writeDeletedCategoryMatches(nextMatches);
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createDDay,
  deleteDDay as deleteDDayRequest,
  getDDays,
  updateDDay,
} from '../apis/dday.js';
import {
  createPlan,
  deletePlan as deletePlanRequest,
  getPlan,
  getPlans,
  updatePlan,
} from '../apis/plan.js';
import {
  completeTask,
  createTask,
  deleteTask as deleteTaskRequest,
} from '../apis/task.js';
import { logout } from '../apis/user.js';
import ActionCard from '../components/common/ActionCard.jsx';
import AppHeader from '../components/common/AppHeader.jsx';
import Mascot from '../components/common/Mascot.jsx';
import CalendarCard from '../components/main/CalendarCard.jsx';
import CategorySection from '../components/main/CategorySection.jsx';
import CategoryTextInput from '../components/main/CategoryTextInput.jsx';
import ChatFloatingButton from '../components/main/ChatFloatingButton.jsx';
import DateStrip from '../components/main/DateStrip.jsx';
import DatePickerModal from '../components/main/DatePickerModal.jsx';
import DdayCard from '../components/main/DdayCard.jsx';
import DdayTitleInput from '../components/main/DdayTitleInput.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import styles from '../styles/pages/MainPage.module.css';
import {
  formatKoreanFullDate,
  isSameDay,
  startOfDay,
} from '../utils/date.js';
import {
  filterDeletedStudyPlanCategories,
  isGeneratedStudyPlanCategory,
  markStudyPlanCategoryDeleted,
  mergeGeneratedStudyPlanCategories,
  readGeneratedStudyPlanCategories,
  removeGeneratedStudyPlanCategoryMatch,
  writeGeneratedStudyPlanCategories,
} from '../utils/generatedStudyPlans.js';
import { writeStudyActivityDates } from '../utils/streakActivity.js';

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title,
    completed: Boolean(task.completedAt),
    scheduledDate: task.scheduledDate,
    orderIndex: task.orderIndex ?? 0,
  };
}

function normalizeCategory(plan) {
  return {
    id: plan.id,
    title: plan.title || plan.category || '학습 계획',
    category: plan.category,
    targetDate: plan.targetDate,
    tasks: (plan.tasks || [])
      .map(normalizeTask)
      .sort((a, b) => a.orderIndex - b.orderIndex),
  };
}

function updateTaskCompletion(categories, categoryId, taskId, completed) {
  return categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks.map((task) =>
            task.id === taskId ? { ...task, completed } : task
          ),
        }
      : category
  );
}

function collectScheduledTaskDates(categories) {
  return categories.flatMap((category) =>
    (category.tasks || [])
      .filter((task) => task.scheduledDate)
      .map((task) => ({
        id: task.id,
        date: task.scheduledDate,
        completed: task.completed,
      }))
  );
}

function collectCompletedTaskActivityDates(categories) {
  return categories.flatMap((category) =>
    (category.tasks || [])
      .filter((task) => task.completed)
      .map((task) => task.scheduledDate)
      .filter(Boolean)
  );
}

function parseScheduledDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const dateParts = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateParts) {
    const [, year, month, day] = dateParts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getWeekRange(baseDate) {
  const weekStart = startOfDay(baseDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    weekStart,
    weekEnd,
  };
}

function isDateInRange(date, startDate, endDate) {
  const targetTime = startOfDay(date).getTime();

  return (
    targetTime >= startOfDay(startDate).getTime() &&
    targetTime <= startOfDay(endDate).getTime()
  );
}

function sortTasksBySchedule(tasks, today) {
  return [...tasks].sort((a, b) => {
    const aDate = parseScheduledDate(a.scheduledDate) || today;
    const bDate = parseScheduledDate(b.scheduledDate) || today;
    const dateDiff =
      startOfDay(aDate).getTime() - startOfDay(bDate).getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });
}

function groupTasksByCurrentPeriod(tasks, today) {
  const { weekStart, weekEnd } = getWeekRange(today);
  const todayTasks = [];
  const weekTasks = [];

  (tasks || []).forEach((task) => {
    const scheduledDate = parseScheduledDate(task.scheduledDate);

    if (!scheduledDate) {
      todayTasks.push(task);
      weekTasks.push(task);
      return;
    }

    if (isDateInRange(scheduledDate, weekStart, weekEnd)) {
      weekTasks.push(task);
    }

    if (isSameDay(scheduledDate, today)) {
      todayTasks.push(task);
    }
  });

  return {
    todayTasks: sortTasksBySchedule(todayTasks, today),
    weekTasks: sortTasksBySchedule(weekTasks, today),
  };
}

function buildCurrentPeriodCategories(categories, today) {
  return categories.map((category) => {
    const { todayTasks, weekTasks } = groupTasksByCurrentPeriod(
      category.tasks,
      today
    );

    return {
      ...category,
      todayTasks,
      weekTasks,
      tasks: [...todayTasks, ...weekTasks],
    };
  });
}

export default function MainPage() {
  const navigate = useNavigate();
  const [isCategoryApiEnabled, setIsCategoryApiEnabled] = useState(true);
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [dDayItems, setDdayItems] = useState([]);
  const [draftDate, setDraftDate] = useState(today);
  const [dDayStep, setDdayStep] = useState('idle');
  const [editingDdayId, setEditingDdayId] = useState(null);
  const [openDdayMenuId, setOpenDdayMenuId] = useState(null);
  const [isDdaySaving, setIsDdaySaving] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [categories, setCategories] = useState(() =>
    readGeneratedStudyPlanCategories()
  );
  const scheduledTaskDates = useMemo(
    () => collectScheduledTaskDates(categories),
    [categories]
  );
  const displayedCategories = useMemo(
    () => buildCurrentPeriodCategories(categories, selectedDate),
    [categories, selectedDate]
  );
  const [categoryInput, setCategoryInput] = useState(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);
  const [isCategorySaving, setIsCategorySaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSelectDate = (date) => {
    const nextDate = startOfDay(date);
    setSelectedDate(nextDate);
    setCalendarMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  };

  const refreshDdayItems = useCallback(async () => {
    const items = await getDDays();
    setDdayItems(items);
    return items;
  }, []);

  useEffect(() => {
    let isActive = true;

    getDDays()
      .then((items) => {
        if (isActive) {
          setDdayItems(items);
        }
      })
      .catch((error) => {
        console.error('D-Day 목록을 불러오지 못했어요.', error);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const refreshCategories = useCallback(async () => {
    if (!isCategoryApiEnabled) {
      const generatedCategories = filterDeletedStudyPlanCategories(
        readGeneratedStudyPlanCategories()
      );
      setCategories(generatedCategories);
      return generatedCategories;
    }

    try {
      const plans = await getPlans();
      const planDetails = await Promise.all(
        plans.map((plan) =>
          getPlan(plan.id).catch(() => ({
            ...plan,
            tasks: [],
          }))
        )
      );
      const nextCategories = mergeGeneratedStudyPlanCategories(
        planDetails.map(normalizeCategory)
      );
      setCategories(nextCategories);

      return nextCategories;
    } catch (error) {
      console.error('카테고리 목록을 불러오지 못했어요.', error);
      setIsCategoryApiEnabled(false);

      const generatedCategories = filterDeletedStudyPlanCategories(
        readGeneratedStudyPlanCategories()
      );
      setCategories(generatedCategories);

      return generatedCategories;
    }
  }, [isCategoryApiEnabled]);

  useEffect(() => {
    let isActive = true;

    if (!isCategoryApiEnabled) {
      Promise.resolve().then(() => {
        if (isActive) {
          setCategories(
            filterDeletedStudyPlanCategories(
              readGeneratedStudyPlanCategories()
            )
          );
        }
      });

      return () => {
        isActive = false;
      };
    }

    getPlans()
      .then((plans) =>
        Promise.all(
          plans.map((plan) =>
            getPlan(plan.id).catch(() => ({
              ...plan,
              tasks: [],
            }))
          )
        )
      )
      .then((planDetails) => {
        if (isActive) {
          setCategories(
            mergeGeneratedStudyPlanCategories(
              planDetails.map(normalizeCategory)
            )
          );
        }
      })
      .catch((error) => {
        console.error('카테고리 목록을 불러오지 못했어요.', error);

        if (isActive) {
          setIsCategoryApiEnabled(false);
          setCategories(
            filterDeletedStudyPlanCategories(
              readGeneratedStudyPlanCategories()
            )
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [isCategoryApiEnabled]);

  const startDdayDraft = () => {
    setOpenDdayMenuId(null);
    setOpenCategoryMenuId(null);
    setCategoryInput(null);
    setEditingDdayId(null);
    setDraftDate(selectedDate);
    setDdayStep('date');
  };

  const confirmDate = () => setDdayStep('title');

  const completeDday = async (title) => {
    if (isDdaySaving) return;
    setIsDdaySaving(true);
    try {
      if (editingDdayId) {
        await updateDDay(editingDdayId, { title, targetDate: draftDate });
      } else {
        await createDDay({ title, targetDate: draftDate });
      }
      await refreshDdayItems();
      setEditingDdayId(null);
      setDdayStep('idle');
    } catch (error) {
      console.error('D-Day 저장에 실패했어요.', error);
      alert('D-Day 저장에 실패했어요.');
    } finally {
      setIsDdaySaving(false);
    }
  };

  const closeDdayFlow = () => {
    setEditingDdayId(null);
    setDdayStep('idle');
  };

  const toggleDdayMenu = (id) => {
    setOpenCategoryMenuId(null);
    setOpenDdayMenuId((currentId) => (currentId === id ? null : id));
  };

  const editDday = (id) => {
    const item = dDayItems.find((dDay) => dDay.id === id);
    if (!item) return;
    setOpenDdayMenuId(null);
    setOpenCategoryMenuId(null);
    setCategoryInput(null);
    setEditingDdayId(id);
    setDraftDate(new Date(item.date));
    setDdayStep('title');
  };

  const deleteDday = async (id) => {
    if (isDdaySaving) return;
    setOpenDdayMenuId(null);
    setIsDdaySaving(true);
    try {
      await deleteDDayRequest(id);
      await refreshDdayItems();
      if (editingDdayId === id) {
        setEditingDdayId(null);
        setDdayStep('idle');
      }
    } catch (error) {
      console.error('D-Day 삭제에 실패했어요.', error);
      alert('D-Day 삭제에 실패했어요.');
    } finally {
      setIsDdaySaving(false);
    }
  };

  const moveCalendarMonth = (amount) => {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  const closeDdayInteraction = () => {
    setOpenDdayMenuId(null);
    setEditingDdayId(null);
    setDdayStep('idle');
  };

  const openCategoryInput = () => {
    closeDdayInteraction();
    setOpenCategoryMenuId(null);

    setCategoryInput({
      type: 'category',
      placeholder: '카테고리를 입력하세요',
    });
  };

  const openTaskInput = (categoryId) => {
    closeDdayInteraction();
    setOpenCategoryMenuId(null);
    setCategoryInput({
      type: 'task',
      categoryId,
      placeholder: '오늘의 루트를 입력하세요',
    });
  };

  const openCategoryEdit = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    closeDdayInteraction();
    setOpenCategoryMenuId(null);
    setCategoryInput({
      type: 'editCategory',
      categoryId,
      initialValue: category.title,
      placeholder: '카테고리를 입력하세요',
    });
  };

  const closeCategoryInput = () => setCategoryInput(null);

  const findCategory = (categoryId) =>
    categories.find((category) => category.id === categoryId);

  const shouldUseCategoryApi = (categoryId) => {
    const category = findCategory(categoryId);

    return Boolean(
      isCategoryApiEnabled &&
        category &&
        !isGeneratedStudyPlanCategory(category)
    );
  };

  const updateLocalCategories = (updater) => {
    setCategories((items) => {
      const nextItems = updater(items);
      writeGeneratedStudyPlanCategories(nextItems);
      return nextItems;
    });
  };

  const removeCategoryFromView = (categoryId, category) => {
    if (category) {
      markStudyPlanCategoryDeleted(category);
      removeGeneratedStudyPlanCategoryMatch(category);
    }

    setCategories((items) => items.filter((item) => item.id !== categoryId));
  };

  const submitCategoryInput = async (value) => {
    if (!categoryInput) return;

    if (isCategorySaving) return;
    setIsCategorySaving(true);

    try {
      if (categoryInput.type === 'category') {
        if (isCategoryApiEnabled) {
          await createPlan({
            title: value,
            category: value,
            targetDate: formatDateForApi(selectedDate), 
          });
          await refreshCategories();
        } else {
          updateLocalCategories((items) => [
            ...items,
            { 
              id: crypto.randomUUID(), 
              title: value, 
              targetDate: formatDateForApi(selectedDate), 
              tasks: [] 
            },
          ]);
        }
      }

      if (categoryInput.type === 'task') {
        if (shouldUseCategoryApi(categoryInput.categoryId)) {
          const category = categories.find(
            (item) => item.id === categoryInput.categoryId
          );
          await createTask(categoryInput.categoryId, {
            title: value,
            scheduledDate: formatDateForApi(selectedDate),
            orderIndex: category?.tasks.length || 0,
          });
          await refreshCategories();
        } else {
          updateLocalCategories((items) =>
            items.map((category) =>
              category.id === categoryInput.categoryId
                ? {
                    ...category,
                    tasks: [
                      ...category.tasks,
                      {
                        id: crypto.randomUUID(),
                        title: value,
                        completed: false,
                        scheduledDate: formatDateForApi(selectedDate),
                      },
                    ],
                  }
                : category
            )
          );
        }
      }

      if (categoryInput.type === 'editCategory') {
        if (shouldUseCategoryApi(categoryInput.categoryId)) {
          await updatePlan(categoryInput.categoryId, { title: value });
          await refreshCategories();
        } else {
          updateLocalCategories((items) =>
            items.map((category) =>
              category.id === categoryInput.categoryId
                ? { ...category, title: value }
                : category
            )
          );
        }
      }

      setCategoryInput(null);
    } catch (error) {
      console.error('카테고리 저장에 실패했어요.', error);
      alert('카테고리 저장에 실패했어요.');
    } finally {
      setIsCategorySaving(false);
    }
  };

  const toggleCategoryMenu = (categoryId) => {
    closeDdayInteraction();
    setCategoryInput(null);
    setOpenCategoryMenuId((currentId) =>
      currentId === categoryId ? null : categoryId
    );
  };

  const deleteCategory = async (categoryId) => {
    if (isCategorySaving) return;

    const category = findCategory(categoryId);

    setOpenCategoryMenuId(null);
    setIsCategorySaving(true);

    try {
      if (shouldUseCategoryApi(categoryId)) {
        await deletePlanRequest(categoryId);
        removeGeneratedStudyPlanCategoryMatch(category);
        markStudyPlanCategoryDeleted(category);
        await refreshCategories();
      } else {
        removeCategoryFromView(categoryId, category);
      }

      if (categoryInput?.categoryId === categoryId) setCategoryInput(null);
    } catch (error) {
      console.error('카테고리 삭제에 실패했어요.', error);
      removeCategoryFromView(categoryId, category);
    } finally {
      setIsCategorySaving(false);
    }
  };

  const toggleCategoryTask = async (categoryId, taskId) => {
    if (isCategorySaving) return;

    const category = findCategory(categoryId);
    const currentTask = category?.tasks.find((task) => task.id === taskId);
    const nextCompleted = !currentTask?.completed;
    const useCategoryApi = shouldUseCategoryApi(categoryId);
    const applyTaskCompletion = (items, completed) => {
      const nextItems = updateTaskCompletion(
        items,
        categoryId,
        taskId,
        completed
      );
      writeStudyActivityDates(collectCompletedTaskActivityDates(nextItems));
      return nextItems;
    };

    setIsCategorySaving(true);

    try {
      if (useCategoryApi) {
        setCategories((items) => applyTaskCompletion(items, nextCompleted));

        await completeTask(categoryId, taskId);
        await refreshCategories();
      } else {
        updateLocalCategories((items) =>
          applyTaskCompletion(items, nextCompleted)
        );
      }
    } catch (error) {
      if (useCategoryApi && currentTask) {
        setCategories((items) =>
          applyTaskCompletion(items, currentTask.completed)
        );
      }

      console.error('루트 완료 처리에 실패했어요.', error);
      alert('루트 완료 처리에 실패했어요.');
    } finally {
      setIsCategorySaving(false);
    }
  };

  const deleteCategoryTask = async (categoryId, taskId) => {
    if (isCategorySaving) return;

    setIsCategorySaving(true);

    try {
      if (shouldUseCategoryApi(categoryId)) {
        await deleteTaskRequest(categoryId, taskId);
        await refreshCategories();
      } else {
        updateLocalCategories((items) =>
          items.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  tasks: category.tasks.filter((task) => task.id !== taskId),
                }
              : category
          )
        );
      }
    } catch (error) {
      console.error('루트 삭제에 실패했어요.', error);
      alert('루트 삭제에 실패했어요.');
    } finally {
      setIsCategorySaving(false);
    }
  };

  return (
    <MobileScreenLayout scrollable>
      <AppHeader
        variant="home"
        subtitle={formatKoreanFullDate(selectedDate)}
        subtitleAction={
          <button
            className={styles.logoutButton}
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        }
        rightSlot={
          <Mascot
            variant="small"
            size="sm"
            alt="온루 키우기"
            onClick={() => navigate('/growth')}
          />
        }
      />
      <DateStrip selectedDate={selectedDate} onSelectDate={handleSelectDate} />

      <div className={styles.content}>
        {dDayItems.length > 0 ? (
          <DdayCard
            items={dDayItems}
            today={today}
            openMenuId={openDdayMenuId}
            onAdd={startDdayDraft}
            onToggleMenu={toggleDdayMenu}
            onEdit={editDday}
            onDelete={deleteDday}
          />
        ) : (
          <ActionCard onClick={startDdayDraft}>D-Day 추가하기</ActionCard>
        )}

        <CalendarCard
          displayDate={calendarMonth}
          selectedDate={selectedDate}
          ddayList={dDayItems}
          scheduledTaskList={scheduledTaskDates}
          onSelectDate={handleSelectDate}
          onPreviousMonth={() => moveCalendarMonth(-1)}
          onNextMonth={() => moveCalendarMonth(1)}
          onToggleExpand={() =>
            setIsCalendarExpanded((isExpanded) => !isExpanded)
          }
          size={isCalendarExpanded ? 'expanded' : 'compact'}
        />
        
        <CategorySection
          categories={displayedCategories}
          dayTaskTitle={
            isSameDay(selectedDate, today) ? '오늘 할 일' : '선택한 날 할 일'
          }
          dayEmptyMessage={
            isSameDay(selectedDate, today)
              ? '오늘은 예정된 계획이 없어요.'
              : '선택한 날 예정된 계획이 없어요.'
          }
          weekTaskTitle="이번 주 할 일"
          weekEmptyMessage="이번 주 예정된 계획이 없어요."
          openMenuId={openCategoryMenuId}
          onAddCategory={openCategoryInput}
          onAddTask={openTaskInput}
          onToggleMenu={toggleCategoryMenu}
          onEditCategory={openCategoryEdit}
          onDeleteCategory={deleteCategory}
          onToggleTask={toggleCategoryTask}
          onDeleteTask={deleteCategoryTask}
        />
        <ChatFloatingButton />
      </div>

      <div className={styles.bottomGlow} aria-hidden="true" />
      {dDayStep === 'date' ? (
        <DatePickerModal
          selectedDate={draftDate}
          onChange={setDraftDate}
          onConfirm={confirmDate}
          onClose={closeDdayFlow}
        />
      ) : null}
      {dDayStep === 'title' ? (
        <DdayTitleInput
          selectedDate={draftDate}
          initialTitle={
            dDayItems.find((item) => item.id === editingDdayId)?.title || ''
          }
          onSubmit={completeDday}
          onClose={closeDdayFlow}
        />
      ) : null}
      {categoryInput ? (
        <CategoryTextInput
          key={`${categoryInput.type}-${categoryInput.categoryId || 'new'}-${categoryInput.initialValue || ''}`}
          initialValue={categoryInput.initialValue}
          placeholder={categoryInput.placeholder}
          onSubmit={submitCategoryInput}
          onClose={closeCategoryInput}
        />
      ) : null}
    </MobileScreenLayout>
  );
}

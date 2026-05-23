import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDDay, deleteDDay as deleteDDayRequest, getDDays, updateDDay } from '../apis/dday.js';
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
import { formatKoreanFullDate } from '../utils/date.js';


export default function MainPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [dDayItems, setDdayItems] = useState([]);
  const [draftDate, setDraftDate] = useState(today);
  const [dDayStep, setDdayStep] = useState('idle');
  const [editingDdayId, setEditingDdayId] = useState(null);
  const [openDdayMenuId, setOpenDdayMenuId] = useState(null);
  const [isDdaySaving, setIsDdaySaving] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);

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

  const startDdayDraft = () => {
    setOpenDdayMenuId(null);
    setOpenCategoryMenuId(null);
    setCategoryInput(null);
    setEditingDdayId(null);
    setDraftDate(today);
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
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1)
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
    setCategoryInput({ type: 'category', placeholder: '카테고리를 입력하세요' });
  };

  const openTaskInput = (categoryId) => {
    closeDdayInteraction();
    setOpenCategoryMenuId(null);
    setCategoryInput({ type: 'task', categoryId, placeholder: '오늘의 루트를 입력하세요' });
  };

  const openCategoryEdit = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    closeDdayInteraction();
    setOpenCategoryMenuId(null);
    setCategoryInput({ type: 'editCategory', categoryId, initialValue: category.title, placeholder: '카테고리를 입력하세요' });
  };

  const closeCategoryInput = () => setCategoryInput(null);

  const submitCategoryInput = (value) => {
    if (!categoryInput) return;
    if (categoryInput.type === 'category') {
      setCategories((items) => [...items, { id: crypto.randomUUID(), title: value, tasks: [] }]);
    }
    if (categoryInput.type === 'task') {
      setCategories((items) =>
        items.map((category) =>
          category.id === categoryInput.categoryId
            ? { ...category, tasks: [...category.tasks, { id: crypto.randomUUID(), title: value, completed: false }] }
            : category
        )
      );
    }
    if (categoryInput.type === 'editCategory') {
      setCategories((items) =>
        items.map((category) =>
          category.id === categoryInput.categoryId ? { ...category, title: value } : category
        )
      );
    }
    setCategoryInput(null);
  };

  const toggleCategoryMenu = (categoryId) => {
    closeDdayInteraction();
    setCategoryInput(null);
    setOpenCategoryMenuId((currentId) => (currentId === categoryId ? null : categoryId));
  };

  const deleteCategory = (categoryId) => {
    setCategories((items) => items.filter((category) => category.id !== categoryId));
    setOpenCategoryMenuId(null);
    if (categoryInput?.categoryId === categoryId) setCategoryInput(null);
  };

  const toggleCategoryTask = (categoryId, taskId) => {
    setCategories((items) =>
      items.map((category) =>
        category.id === categoryId
          ? { ...category, tasks: category.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)) }
          : category
      )
    );
  };

  const deleteCategoryTask = (categoryId, taskId) => {
    setCategories((items) =>
      items.map((category) =>
        category.id === categoryId
          ? { ...category, tasks: category.tasks.filter((task) => task.id !== taskId) }
          : category
      )
    );
  };

  return (
    <MobileScreenLayout scrollable>
      <AppHeader
        variant="home"
        subtitle={formatKoreanFullDate(today)}
        rightSlot={
          <Mascot
            variant="small"
            size="sm"
            alt="온루 키우기"
            onClick={() => navigate('/growth')}
          />
        }
      />
      <DateStrip selectedDate={today} />

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
          selectedDate={today}
          ddayList={dDayItems}
          onPreviousMonth={() => moveCalendarMonth(-1)}
          onNextMonth={() => moveCalendarMonth(1)}
          onToggleExpand={() => setIsCalendarExpanded((isExpanded) => !isExpanded)}
          size={isCalendarExpanded ? 'expanded' : 'compact'}
        />
        <CategorySection
          categories={categories}
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
      {dDayStep === 'date' ? <DatePickerModal selectedDate={draftDate} onChange={setDraftDate} onConfirm={confirmDate} onClose={closeDdayFlow} /> : null}
      {dDayStep === 'title' ? <DdayTitleInput selectedDate={draftDate} initialTitle={dDayItems.find((item) => item.id === editingDdayId)?.title || ''} onSubmit={completeDday} onClose={closeDdayFlow} /> : null}
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

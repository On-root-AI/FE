import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/common/ActionCard.jsx';
import AppHeader from '../components/common/AppHeader.jsx';
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
import mascotImg from '../assets/figma/mascot-small.png';

export default function MainPage() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [dDayItems, setDdayItems] = useState([]);
  const [draftDate, setDraftDate] = useState(today);
  const [dDayStep, setDdayStep] = useState('idle');
  const [editingDdayId, setEditingDdayId] = useState(null);
  const [openDdayMenuId, setOpenDdayMenuId] = useState(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);

  const startDdayDraft = () => {
    setOpenDdayMenuId(null);
    setOpenCategoryMenuId(null);
    setCategoryInput(null);
    setEditingDdayId(null);
    setDraftDate(today);
    setDdayStep('date');
  };

  const openDatePicker = () => {
    setOpenDdayMenuId(null);
    setOpenCategoryMenuId(null);
    setCategoryInput(null);
    setDdayStep('date');
  };

  const confirmDate = () => {
    setDdayStep('title');
  };

  const completeDday = (title) => {
    if (editingDdayId) {
      setDdayItems((items) =>
        items.map((item) =>
          item.id === editingDdayId ? { ...item, title } : item
        )
      );
      setEditingDdayId(null);
      setDdayStep('idle');
      return;
    }

    setDdayItems((items) => [
      {
        id: crypto.randomUUID(),
        title,
        date: draftDate,
      },
      ...items,
    ]);
    setDdayStep('idle');
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
    setDraftDate(item.date);
    setDdayStep('title');
  };

  const deleteDday = (id) => {
    setDdayItems((items) => items.filter((item) => item.id !== id));
    setOpenDdayMenuId(null);
    if (editingDdayId === id) {
      setEditingDdayId(null);
      setDdayStep('idle');
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

  const closeCategoryInput = () => {
    setCategoryInput(null);
  };

  const submitCategoryInput = (value) => {
    if (!categoryInput) return;

    if (categoryInput.type === 'category') {
      setCategories((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          title: value,
          tasks: [],
        },
      ]);
    }

    if (categoryInput.type === 'task') {
      setCategories((items) =>
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
                  },
                ],
              }
            : category
        )
      );
    }

    if (categoryInput.type === 'editCategory') {
      setCategories((items) =>
        items.map((category) =>
          category.id === categoryInput.categoryId
            ? { ...category, title: value }
            : category
        )
      );
    }

    setCategoryInput(null);
  };

  const toggleCategoryMenu = (categoryId) => {
    closeDdayInteraction();
    setCategoryInput(null);
    setOpenCategoryMenuId((currentId) =>
      currentId === categoryId ? null : categoryId
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories((items) =>
      items.filter((category) => category.id !== categoryId)
    );
    setOpenCategoryMenuId(null);
    if (categoryInput?.categoryId === categoryId) {
      setCategoryInput(null);
    }
  };

  const toggleCategoryTask = (categoryId, taskId) => {
    setCategories((items) =>
      items.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : category
      )
    );
  };

  const deleteCategoryTask = (categoryId, taskId) => {
    setCategories((items) =>
      items.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.filter((task) => task.id !== taskId),
            }
          : category
      )
    );
  };

  const activeDday = dDayItems[0];
  const handleDdayCardAdd =
    activeDday && dDayStep === 'idle' ? startDdayDraft : openDatePicker;

  return (
    <MobileScreenLayout scrollable>
      <AppHeader 
        variant="home" 
        subtitle={formatKoreanFullDate(today)} 
        rightSlot={
          <img 
            src={mascotImg} 
            alt="온루 키우기" 
            style={{ 
              width: '32px', 
              height: '32px', 
              cursor: 'pointer',
              position: 'relative',
              zIndex: 10
            }}
            onClick={() => navigate('/growth')} 
          />
        }
      />
      <DateStrip selectedDate={today} />

      <div className={styles.content}>
        {activeDday ? (
          <DdayCard
            item={activeDday}
            draftDate={draftDate}
            today={today}
            isMenuOpen={openDdayMenuId === activeDday.id}
            onAdd={handleDdayCardAdd}
            onSelectDate={openDatePicker}
            onToggleMenu={() => toggleDdayMenu(activeDday.id)}
            onEdit={() => editDday(activeDday.id)}
            onDelete={() => deleteDday(activeDday.id)}
          />
        ) : (
          <ActionCard onClick={startDdayDraft}>D-Day 추가하기</ActionCard>
        )}

        <CalendarCard
          displayDate={calendarMonth}
          selectedDate={today}
          onPreviousMonth={() => moveCalendarMonth(-1)}
          onNextMonth={() => moveCalendarMonth(1)}
          onToggleExpand={() =>
            setIsCalendarExpanded((isExpanded) => !isExpanded)
          }
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
          key={`${categoryInput.type}-${categoryInput.categoryId || 'new'}-${
            categoryInput.initialValue || ''
          }`}
          initialValue={categoryInput.initialValue}
          placeholder={categoryInput.placeholder}
          onSubmit={submitCategoryInput}
          onClose={closeCategoryInput}
        />
      ) : null}
    </MobileScreenLayout>
  );
}
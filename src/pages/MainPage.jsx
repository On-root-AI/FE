import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/common/ActionCard.jsx';
import AppHeader from '../components/common/AppHeader.jsx';
import CalendarCard from '../components/main/CalendarCard.jsx';
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

  const startDdayDraft = () => {
    setOpenDdayMenuId(null);
    setEditingDdayId(null);
    setDraftDate(today);
    setDdayStep('date');
  };

  const openDatePicker = () => {
    setOpenDdayMenuId(null);
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
    setOpenDdayMenuId((currentId) => (currentId === id ? null : id));
  };

  const editDday = (id) => {
    const item = dDayItems.find((dDay) => dDay.id === id);
    if (!item) return;

    setOpenDdayMenuId(null);
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
        <ActionCard tone="strong">카테고리 추가하기</ActionCard>
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
    </MobileScreenLayout>
  );
}
import { useMemo, useState } from 'react';
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

export default function MainPage() {
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [dDayItems, setDdayItems] = useState([]);
  const [draftDate, setDraftDate] = useState(today);
  const [dDayStep, setDdayStep] = useState('idle');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const startDdayDraft = () => {
    setDraftDate(today);
    setDdayStep('draft');
  };

  const openDatePicker = () => {
    setDdayStep('date');
  };

  const confirmDate = () => {
    setDdayStep('title');
  };

  const completeDday = (title) => {
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
    setDdayStep('idle');
  };

  const moveCalendarMonth = (amount) => {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  const activeDday = dDayItems[0];
  const isDdayDrafting = dDayStep !== 'idle';
  const handleDdayCardAdd =
    activeDday && dDayStep === 'idle' ? startDdayDraft : openDatePicker;

  return (
    <MobileScreenLayout scrollable>
      <AppHeader variant="home" subtitle={formatKoreanFullDate(today)} />
      <DateStrip selectedDate={today} />

      <div className={styles.content}>
        {activeDday || isDdayDrafting ? (
          <DdayCard
            item={dDayStep === 'idle' ? activeDday : null}
            draftDate={draftDate}
            today={today}
            onAdd={handleDdayCardAdd}
            onSelectDate={openDatePicker}
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
          onSubmit={completeDday}
          onClose={closeDdayFlow}
        />
      ) : null}
    </MobileScreenLayout>
  );
}

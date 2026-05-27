import { useEffect, useMemo, useRef, useState } from 'react';
import AppHeader from '../components/common/AppHeader.jsx';
import ChatBubble from '../components/chat/ChatBubble.jsx';
import ChatInputBar from '../components/chat/ChatInputBar.jsx';
import ChatLanding from '../components/chat/ChatLanding.jsx';
import ChatLoadingOverlay from '../components/chat/ChatLoadingOverlay.jsx';
import ChatSearchLoading from '../components/chat/ChatSearchLoading.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import StudyPlanCard from '../components/chat/StudyPlanCard.jsx';
import chatBottomMascot from '../assets/figma/Chat_btm.png';
import chatSideMascot from '../assets/figma/Chat_side.png';
import { sendChatMessage } from '../apis/chat.js';
import { getPlan, getPlans } from '../apis/plan.js';
import { saveGeneratedStudyPlanCategory } from '../utils/generatedStudyPlans.js';
import styles from '../styles/pages/ChatPage.module.css';

function normalizePlanDetail(plan) {
  return {
    id: plan.id,
    title: plan.title || plan.category || '학습 계획',
    targetDate: plan.targetDate,
    tasks: (plan.tasks || []).sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    ),
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [isPlanListOpen, setIsPlanListOpen] = useState(false);
  const [isPlanListLoading, setIsPlanListLoading] = useState(false);
  const [planListError, setPlanListError] = useState('');
  const [planList, setPlanList] = useState([]);
  const messageId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsInitializing(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const hasStudyPlan = useMemo(
    () => messages.some((message) => message.studyPlan?.length),
    [messages]
  );
  const isEmpty = messages.length === 0;

  async function loadPlanList() {
    setIsPlanListLoading(true);
    setPlanListError('');

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

      setPlanList(planDetails.map(normalizePlanDetail));
    } catch (error) {
      console.error('전체 계획을 불러오지 못했어요.', error);
      setPlanListError('전체 계획을 불러오지 못했어요.');
    } finally {
      setIsPlanListLoading(false);
    }
  }

  function openPlanList() {
    setIsPlanListOpen(true);
    loadPlanList();
  }

  async function submitMessage(event) {
    event.preventDefault();

    const text = input.trim();
    if (!text || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${messageId.current++}`,
      role: 'user',
      answer: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsPlanExpanded(false);

    try {
      const response = await sendChatMessage(text);
      if (response.studyPlan?.length) {
        saveGeneratedStudyPlanCategory({
          title: response.title,
          days: response.studyPlan,
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${messageId.current++}`,
          role: 'assistant',
          ...response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${messageId.current++}`,
          role: 'assistant',
          answer: '응답을 불러오지 못했어요. 다시 시도해 주세요.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MobileScreenLayout background="chat">
      <div className={styles.decorOne} aria-hidden="true" />
      <div className={styles.decorTwo} aria-hidden="true" />
      <div className={styles.decorThree} aria-hidden="true" />
      <div className={styles.decorFour} aria-hidden="true" />
      <div className={styles.decorFive} aria-hidden="true" />
      <AppHeader
        variant="chat"
        title="Onru AI"
        showBack
        rightSlot={
          <button
            className={styles.planListButton}
            type="button"
            onClick={openPlanList}
          >
            전체 계획
          </button>
        }
      />

      {isEmpty ? <ChatLanding /> : null}

      <section
        className={[
          styles.messages,
          hasStudyPlan ? styles.withPlan : '',
          isPlanExpanded ? styles.expandedPlan : '',
          isEmpty ? styles.empty : '',
        ].join(' ')}
      >
        {messages.map((message) => {
          if (message.studyPlan?.length) {
            return (
              <div className={styles.resultGroup} key={message.id}>
                <StudyPlanCard
                  title={message.title}
                  days={message.studyPlan}
                  maxDays={3}
                  onExpandedChange={setIsPlanExpanded}
                />
                {!isPlanExpanded ? (
                  <>
                    <img
                      className={styles.resultMascot}
                      src={chatSideMascot}
                      alt=""
                    />
                    <img
                      className={styles.bottomMascot}
                      src={chatBottomMascot}
                      alt=""
                    />
                  </>
                ) : null}
              </div>
            );
          }

          return (
            <ChatBubble key={message.id} role={message.role}>
              {message.answer}
            </ChatBubble>
          );
        })}

        {isLoading ? <ChatSearchLoading /> : null}
      </section>

      {!isPlanExpanded && !isPlanListOpen ? (
        <>
          <div className={styles.bottomFade} aria-hidden="true" />
          <ChatInputBar
            disabled={isLoading || isInitializing}
            value={input}
            onChange={setInput}
            onSubmit={submitMessage}
          />
        </>
      ) : null}
      {isPlanListOpen ? (
        <div className={styles.planListOverlay}>
          <button
            className={styles.planListBackdrop}
            type="button"
            aria-label="전체 계획 닫기"
            onClick={() => setIsPlanListOpen(false)}
          />
          <section
            className={styles.planListPanel}
            role="dialog"
            aria-modal="true"
            aria-label="전체 계획"
          >
            <header>
              <h2>전체 계획</h2>
              <button type="button" onClick={() => setIsPlanListOpen(false)}>
                닫기
              </button>
            </header>
            <div className={styles.planListBody}>
              {isPlanListLoading ? (
                <p className={styles.planListState}>계획을 불러오는 중이에요.</p>
              ) : null}
              {!isPlanListLoading && planListError ? (
                <div className={styles.planListState}>
                  <p>{planListError}</p>
                  <button type="button" onClick={loadPlanList}>
                    다시 불러오기
                  </button>
                </div>
              ) : null}
              {!isPlanListLoading && !planListError && planList.length === 0 ? (
                <p className={styles.planListState}>
                  아직 생성된 계획이 없어요.
                </p>
              ) : null}
              {!isPlanListLoading && !planListError && planList.length > 0
                ? planList.map((plan) => (
                    <article className={styles.planListCard} key={plan.id}>
                      <div className={styles.planListCardHeader}>
                        <h3>{plan.title}</h3>
                        {plan.targetDate ? (
                          <time dateTime={plan.targetDate}>
                            {plan.targetDate}
                          </time>
                        ) : null}
                      </div>
                      {plan.tasks.length ? (
                        <>
                          <ul>
                            {plan.tasks.slice(0, 5).map((task) => (
                              <li key={task.id}>
                                {task.scheduledDate ? (
                                  <time dateTime={task.scheduledDate}>
                                    {task.scheduledDate}
                                  </time>
                                ) : null}
                                <span>{task.title}</span>
                              </li>
                            ))}
                          </ul>
                          {plan.tasks.length > 5 ? (
                            <p className={styles.planListMore}>
                              외 {plan.tasks.length - 5}개
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p className={styles.planListEmpty}>
                          등록된 세부 계획이 없어요.
                        </p>
                      )}
                    </article>
                  ))
                : null}
            </div>
          </section>
        </div>
      ) : null}
      {isInitializing ? <ChatLoadingOverlay /> : null}
    </MobileScreenLayout>
  );
}

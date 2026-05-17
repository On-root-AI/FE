import { useEffect, useMemo, useRef, useState } from 'react';
import AppHeader from '../components/common/AppHeader.jsx';
import ChatBubble from '../components/chat/ChatBubble.jsx';
import ChatInputBar from '../components/chat/ChatInputBar.jsx';
import ChatLanding from '../components/chat/ChatLanding.jsx';
import ChatLoadingOverlay from '../components/chat/ChatLoadingOverlay.jsx';
import ChatSearchLoading from '../components/chat/ChatSearchLoading.jsx';
import Mascot from '../components/common/Mascot.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import StudyPlanCard from '../components/chat/StudyPlanCard.jsx';
import { sendChatMessage } from '../apis/chat.js';
import styles from '../styles/pages/ChatPage.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const response = await sendChatMessage(text);
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
      <AppHeader variant="chat" title="Onru AI" showBack />

      {isEmpty ? <ChatLanding /> : null}

      <section
        className={[
          styles.messages,
          hasStudyPlan ? styles.withPlan : '',
          isEmpty ? styles.empty : '',
        ].join(' ')}
      >
        {messages.map((message) => {
          if (message.studyPlan?.length) {
            return (
              <div className={styles.resultGroup} key={message.id}>
                <StudyPlanCard days={message.studyPlan} maxDays={3} />
                <Mascot
                  className={styles.resultMascot}
                  variant="sprout"
                  size="lg"
                  alt=""
                />
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

      <div className={styles.bottomFade} aria-hidden="true" />
      <ChatInputBar
        disabled={isLoading || isInitializing}
        value={input}
        onChange={setInput}
        onSubmit={submitMessage}
      />
      {isInitializing ? <ChatLoadingOverlay /> : null}
    </MobileScreenLayout>
  );
}

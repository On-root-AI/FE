import chatHeroMascot from '../../assets/figma/chat-hero-mascot.png';
import styles from '../../styles/components/chat/ChatLanding.module.css';

export default function ChatLanding() {
  return (
    <section className={styles.landing} aria-label="온루AI 시작 화면">
      <div className={styles.greeting}>
        <p>반가워요!</p>
        <p>AI 온루가 오늘의 루틴을 추천해드릴게요.</p>
      </div>
      <img className={styles.heroMascot} src={chatHeroMascot} alt="온루AI" />
    </section>
  );
}

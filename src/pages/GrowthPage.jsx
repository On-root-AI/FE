import { useEffect, useState } from 'react';
import AppHeader from '../components/common/AppHeader.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import GrowthStageCard from '../components/main/GrowthStageCard.jsx';
import { getStreak } from '../apis/streak.js';
import styles from '../styles/pages/ChatPage.module.css';
import seedImg from '../assets/figma/mascot-seed.png';
import sproutImg from '../assets/figma/mascot-sprout.png';
import treeImg from '../assets/figma/mascot-tree.png';
import fruitImg from '../assets/figma/mascot-chatbot.png';

export default function GrowthPage() {
  const [streakDays, setStreakDays] = useState(8);

  useEffect(() => {
    let isActive = true;

    getStreak()
      .then((streak) => {
        if (isActive && Number.isFinite(streak?.currentStreak)) {
          setStreakDays(streak.currentStreak);
        }
      })
      .catch((error) => {
        console.error('스트릭 정보를 불러오지 못했어요.', error);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const checkActiveStage = (min, max) => {
    return streakDays >= min && streakDays <= max;
  };

  return (
    <MobileScreenLayout scrollable background="chat">
      <div className={styles.decorOne} aria-hidden="true" />
      <div className={styles.decorTwo} aria-hidden="true" />
      <div className={styles.decorThree} aria-hidden="true" />
      <div className={styles.decorFour} aria-hidden="true" />
      <div className={styles.decorFive} aria-hidden="true" />
      <AppHeader variant="back" showBack={true} />

      <div
        style={{
          padding: '0 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#44473c',
            margin: '16px 0 24px 0',
            textAlign: 'center',
            lineHeight: '1.4',
          }}
        >
          한 걸음씩 꾸준히, 나만의 열매 <br />
          <span
            style={{ fontSize: '22px', color: '#8b9f5b', fontWeight: '600' }}
          >
            ‘온루’
          </span>
          를 향해
        </h1>

        <div
          style={{
            padding: '8px 24px',
            borderRadius: '100px',
            border: '2px solid #778b3e',
            backgroundColor: 'rgba(254, 255, 251, 0.2)',
            color: '#778b3e',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '32px',
          }}
        >
          연속 학습 일수 : {streakDays}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <GrowthStageCard
            range="0~5"
            title="씨앗"
            imgSrc={seedImg}
            isActive={checkActiveStage(0, 5)}
          />
          <GrowthStageCard
            range="6~15"
            title="새싹"
            imgSrc={sproutImg}
            isActive={checkActiveStage(6, 15)}
          />
          <GrowthStageCard
            range="16~25"
            title="나무"
            imgSrc={treeImg}
            isActive={checkActiveStage(16, 25)}
          />
          <GrowthStageCard
            range="26~30±"
            title="온루 열매"
            imgSrc={fruitImg}
            isActive={streakDays >= 26}
          />
        </div>

        <p
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#44473c',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          매달 새롭게 시작되는 성장 루틴, 일수를 채워
          <br />
          씨앗에서 온루까지 성장해요.
        </p>
      </div>
    </MobileScreenLayout>
  );
}

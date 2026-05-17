import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import onrootLogo from '../assets/figma/onroot-logo.png';
import splashSideLeft from '../assets/figma/splash-side-left.png';
import splashSideRight from '../assets/figma/splash-side-right.png';
import Mascot from '../components/common/Mascot.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import styles from '../styles/pages/SplashPage.module.css';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/main', { replace: true });
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileScreenLayout>
      <img
        className={styles.sideLeft}
        src={splashSideLeft}
        alt=""
        aria-hidden="true"
      />
      <img
        className={styles.sideRight}
        src={splashSideRight}
        alt=""
        aria-hidden="true"
      />

      <section className={styles.content} aria-label="onroot 시작 화면">
        <div className={styles.mascots}>
          <Mascot className={styles.seed} variant="seed" />
          <Mascot className={styles.small} variant="small" />
          <Mascot className={styles.hero} variant="sprout" />
          <Mascot className={styles.tree} variant="tree" />
          <Mascot className={styles.sprout} variant="sprout" />
        </div>

        <img className={styles.logo} src={onrootLogo} alt="onroot" />
        <p>오늘의 한 걸음이, 내일의 뿌리가 되다</p>
      </section>
    </MobileScreenLayout>
  );
}

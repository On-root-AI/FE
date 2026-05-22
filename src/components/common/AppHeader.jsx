import { useNavigate } from 'react-router-dom';
import onrootLogo from '../../assets/figma/onroot-logo.png';
import onruaiLogo from '../../assets/figma/onruai-logo.png';
import Mascot from './Mascot.jsx';
import styles from '../../styles/components/common/AppHeader.module.css';

export default function AppHeader({
  variant = 'home',
  title,
  subtitle,
  showBack = false,
  rightSlot,
}) {
  const navigate = useNavigate();

  return (
    <header className={`${styles.header} ${styles[variant]}`}>
      <div className={styles.content}>
        {showBack ? (
          <button
            className={styles.backButton}
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate('/main')}
          >
            ‹
          </button>
        ) : null}
        {variant === 'home' ? (
          <div className={styles.brandBlock}>
            <img className={styles.logo} src={onrootLogo} alt="onroot" />
            <p>{subtitle}</p>
          </div>
        ) : (
          <img className={styles.chatLogo} src={onruaiLogo} alt={title} />
        )}
        <div className={styles.rightSlot}>
          {rightSlot ||
            (variant === 'home' ? <Mascot variant="small" size="sm" /> : null)}
        </div>
      </div>
    </header>
  );
}
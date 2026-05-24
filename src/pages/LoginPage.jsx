import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../apis/user.js';
import onrootLogo from '../assets/figma/onroot-logo.png';
import Mascot from '../components/common/Mascot.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import styles from '../styles/pages/AuthPage.module.css';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    '로그인에 실패했어요. 입력한 정보를 다시 확인해 주세요.'
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      document.activeElement?.blur();
      navigate('/main', { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileScreenLayout scrollable>
      <section className={styles.page} aria-label="로그인">
        <div className={styles.brand}>
          <img src={onrootLogo} alt="onroot" />
          <Mascot variant="small" size="sm" />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.copy}>
            <h1>반가워요!</h1>
            <p>오늘의 루트를 이어가 볼까요?</p>
          </div>

          <label className={styles.field}>
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중' : '로그인'}
          </button>
        </form>

        <p className={styles.switchText}>
          아직 계정이 없나요? <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </MobileScreenLayout>
  );
}

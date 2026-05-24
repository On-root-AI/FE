import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../apis/user.js';
import onrootLogo from '../assets/figma/onroot-logo.png';
import Mascot from '../components/common/Mascot.jsx';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import styles from '../styles/pages/AuthPage.module.css';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    '회원가입에 실패했어요. 입력한 정보를 다시 확인해 주세요.'
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signup({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
      });
      document.activeElement?.blur();
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileScreenLayout scrollable>
      <section className={styles.page} aria-label="회원가입">
        <div className={styles.brand}>
          <img src={onrootLogo} alt="onroot" />
          <Mascot variant="seed" size="sm" />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.copy}>
            <h1>시작해볼까요?</h1>
            <p>온루트가 오늘의 계획을 함께 챙겨줄게요.</p>
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
              placeholder="6자 이상 입력하세요"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <label className={styles.field}>
            <span>닉네임</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임을 입력하세요"
              autoComplete="nickname"
              minLength={2}
              maxLength={50}
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
            {isSubmitting ? '가입 중' : '회원가입'}
          </button>
        </form>

        <p className={styles.switchText}>
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </section>
    </MobileScreenLayout>
  );
}

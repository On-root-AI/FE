import { Link } from 'react-router-dom';
import MobileScreenLayout from '../components/layout/MobileScreenLayout.jsx';
import styles from '../styles/pages/NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <MobileScreenLayout>
      <section className={styles.content}>
        <h1>페이지를 찾을 수 없어요.</h1>
        <Link to="/main">메인으로 돌아가기</Link>
      </section>
    </MobileScreenLayout>
  );
}

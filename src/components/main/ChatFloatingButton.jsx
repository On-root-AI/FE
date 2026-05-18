import { useNavigate } from 'react-router-dom';
import Mascot from '../common/Mascot.jsx';
import styles from '../../styles/components/main/ChatFloatingButton.module.css';

export default function ChatFloatingButton() {
  const navigate = useNavigate();

  return (
    <button
      className={styles.button}
      type="button"
      onClick={() => navigate('/chat')}
    >
      <Mascot variant="chatbot" size="lg" />
      <span>Chat</span>
    </button>
  );
}

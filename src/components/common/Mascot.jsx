import mascotSeed from '../../assets/figma/mascot-seed.png';
import mascotSmall from '../../assets/figma/mascot-small.png';
import mascotSprout from '../../assets/figma/mascot-sprout.png';
import mascotTree from '../../assets/figma/mascot-tree.png';
import mascotChatbot from '../../assets/figma/mascot-chatbot.png';
import styles from '../../styles/components/common/Mascot.module.css';

const mascotByVariant = {
  seed: mascotSeed,
  small: mascotSmall,
  sprout: mascotSprout,
  tree: mascotTree,
  chatbot: mascotChatbot,
};

export default function Mascot({
  size = 'md',
  variant = 'small',
  className = '',
  alt = '',
  onClick,
}) {
  return (
    <img
      className={`${styles.mascot} ${styles[size]} ${className}`}
      src={mascotByVariant[variant]}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      // [수정] onClick 추가
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    />
  );
}
import { useEffect } from 'react';
import styles from '../../styles/components/layout/MobileScreenLayout.module.css';

export default function MobileScreenLayout({
  children,
  background = 'default',
  className = '',
  scrollable = false,
}) {
  useEffect(() => {
    const root = document.documentElement;

    const setAppHeight = () => {
      root.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    const setKeyboardOffset = () => {
      const viewport = window.visualViewport;
      const keyboardOffset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0;

      root.style.setProperty('--keyboard-offset', `${keyboardOffset}px`);
    };

    setAppHeight();
    setKeyboardOffset();
    window.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('resize', setKeyboardOffset);
    window.visualViewport?.addEventListener('scroll', setKeyboardOffset);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setKeyboardOffset);
      window.visualViewport?.removeEventListener('scroll', setKeyboardOffset);
    };
  }, []);

  return (
    <main className={styles.viewport}>
      <section
        className={[
          styles.screen,
          styles[background],
          scrollable ? styles.scrollable : '',
          className,
        ].join(' ')}
        aria-label="Onroot mobile preview"
      >
        {children}
      </section>
    </main>
  );
}

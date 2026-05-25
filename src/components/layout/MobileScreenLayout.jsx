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
      const visualHeight = window.visualViewport?.height || 0;
      const appHeight = Math.ceil(Math.max(window.innerHeight, visualHeight));

      root.style.setProperty('--app-height', `${appHeight}px`);
    };

    const setViewportMetrics = () => {
      const viewport = window.visualViewport;
      const visualHeight = Math.ceil(viewport?.height || window.innerHeight);
      const visualOffsetTop = Math.ceil(viewport?.offsetTop || 0);
      const keyboardOffset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0;
      const inputBottom = keyboardOffset > 0 ? keyboardOffset + 16 : 24;

      root.style.setProperty('--visual-viewport-height', `${visualHeight}px`);
      root.style.setProperty(
        '--visual-viewport-offset-top',
        `${visualOffsetTop}px`
      );
      root.style.setProperty('--keyboard-offset', `${keyboardOffset}px`);
      root.style.setProperty('--keyboard-input-bottom', `${inputBottom}px`);

      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.matches?.('input, textarea, [contenteditable="true"]') ||
        false;

      if (!isTyping) {
        window.scrollTo(0, 0);
      }
    };

    setAppHeight();
    setViewportMetrics();
    window.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('scroll', setAppHeight);
    window.addEventListener('resize', setViewportMetrics);
    window.visualViewport?.addEventListener('resize', setViewportMetrics);
    window.visualViewport?.addEventListener('scroll', setViewportMetrics);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('scroll', setAppHeight);
      window.removeEventListener('resize', setViewportMetrics);
      window.visualViewport?.removeEventListener('resize', setViewportMetrics);
      window.visualViewport?.removeEventListener('scroll', setViewportMetrics);
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

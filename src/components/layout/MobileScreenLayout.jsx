import { useEffect } from 'react';
import styles from '../../styles/components/layout/MobileScreenLayout.module.css';

function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1)
  );
}

function isStandaloneDisplay() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function getAppHeight() {
  const visualHeight = window.visualViewport?.height || 0;
  const innerHeight = window.innerHeight || 0;
  const clientHeight = document.documentElement.clientHeight || 0;
  const screenHeight =
    isIOSDevice() && isStandaloneDisplay()
      ? Math.max(window.screen?.height || 0, window.screen?.availHeight || 0)
      : 0;

  return Math.ceil(
    Math.max(visualHeight, innerHeight, clientHeight, screenHeight)
  );
}

export default function MobileScreenLayout({
  children,
  background = 'default',
  className = '',
  scrollable = false,
}) {
  useEffect(() => {
    const root = document.documentElement;

    const setAppHeight = () => {
      root.style.setProperty('--app-height', `${getAppHeight()}px`);
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

    const syncViewport = () => {
      setAppHeight();
      setViewportMetrics();
    };

    syncViewport();
    const syncTimers = [
      window.setTimeout(syncViewport, 120),
      window.setTimeout(syncViewport, 480),
    ];
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('scroll', setAppHeight);
    window.addEventListener('resize', setViewportMetrics);
    window.addEventListener('orientationchange', setViewportMetrics);
    window.visualViewport?.addEventListener('resize', setViewportMetrics);
    window.visualViewport?.addEventListener('scroll', setViewportMetrics);

    return () => {
      syncTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('scroll', setAppHeight);
      window.removeEventListener('resize', setViewportMetrics);
      window.removeEventListener('orientationchange', setViewportMetrics);
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

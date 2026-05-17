import styles from '../../styles/components/layout/MobileScreenLayout.module.css';

export default function MobileScreenLayout({
  children,
  background = 'default',
  className = '',
}) {
  return (
    <main className={styles.viewport}>
      <section
        className={`${styles.screen} ${styles[background]} ${className}`}
        aria-label="Onroot mobile preview"
      >
        {children}
      </section>
    </main>
  );
}

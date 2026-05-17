import styles from '../../styles/components/chat/StudyPlanCard.module.css';

export default function StudyPlanCard({
  title = '심리학 기말고사 7일 학습 계획',
  days = [],
  maxDays,
}) {
  const visibleDays = maxDays ? days.slice(0, maxDays) : days;
  const hasMore = maxDays && days.length > maxDays;

  return (
    <section className={styles.card} aria-label={title}>
      <header>
        <h2>{title}</h2>
        <button type="button" aria-label="학습 계획 편집">
          ✎
        </button>
      </header>
      <div className={styles.days}>
        {visibleDays.map((day) => (
          <article className={styles.day} key={day.date}>
            <strong>{day.date}</strong>
            <ul>
              {day.tasks.map((task) => (
                <li key={task}>
                  <span aria-hidden="true" />
                  {task}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {hasMore ? <p className={styles.more}>...</p> : null}
      </div>
    </section>
  );
}

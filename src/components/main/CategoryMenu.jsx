import styles from '../../styles/components/main/CategoryMenu.module.css';

export default function CategoryMenu({ onEdit, onDelete }) {
  return (
    <div className={styles.menu} role="menu" aria-label="카테고리 설정">
      <button type="button" role="menuitem" onClick={onEdit}>
        <span>수정</span>
        <span className={styles.editIcon} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.73524 0.560424C7.0943 0.201497 7.58123 -9.3728e-05 8.08893 3.26918e-08C8.59662 9.37934e-05 9.08348 0.201864 9.44241 0.560924C9.80134 0.919985 10.0029 1.40692 10.0028 1.91462C10.0027 2.42231 9.80097 2.90917 9.44191 3.2681L9.20794 3.50207L6.50126 0.795396L6.73524 0.560424ZM5.79435 1.50231L0.649964 6.64569C0.580527 6.71545 0.533223 6.80414 0.513981 6.90066L0.0100411 9.40037C-0.00639956 9.48115 -0.00260513 9.56476 0.0210864 9.64372C0.0447779 9.72269 0.0876311 9.79457 0.145829 9.85297C0.204028 9.91137 0.275765 9.95446 0.354652 9.97842C0.433538 10.0024 0.517126 10.0065 0.597971 9.99029L3.10167 9.49035C3.19831 9.47083 3.28702 9.42317 3.35664 9.35337L8.50102 4.20899L5.79435 1.50231Z" fill="var(--onroot-------, #FB9F65)"/>
          </svg>
        </span>
      </button>
      
      <div className={styles.divider} />

      <button type="button" role="menuitem" onClick={onDelete}>
        <span>삭제</span>
        <span className={styles.deleteIcon} aria-hidden="true">
          <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.66992 0.414773L2.5 0.909091H0.625C0.279297 0.909091 0 1.17992 0 1.51515C0 1.85038 0.279297 2.12121 0.625 2.12121H8.125C8.4707 2.12121 8.75 1.85038 8.75 1.51515C8.75 1.17992 8.4707 0.909091 8.125 0.909091H6.25L6.08008 0.414773C5.99414 0.166667 5.75586 0 5.48633 0H3.26367C2.99414 0 2.75586 0.166667 2.66992 0.414773ZM8.125 3.0303H0.625L1.03711 9.14962C1.06836 9.62879 1.47852 10 1.97266 10H6.77734C7.27148 10 7.68164 9.62879 7.71289 9.14962L8.125 3.0303Z" fill="var(--onroot-------, #FB9F65)"/>
          </svg>
        </span>
      </button>
    </div>
  );
}
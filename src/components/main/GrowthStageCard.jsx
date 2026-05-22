export default function GrowthStageCard({ range, title, imgSrc, isActive }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '130px',
        height: '200px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        border: isActive ? '2px solid #778b3e' : '2px solid #cfd2be',
        backgroundColor: isActive ? '#fafafa' : 'rgba(250, 250, 250, 0.5)',
        boxShadow: isActive ? '0px 3px 10px rgba(100, 106, 64, 0.3)' : 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        src={imgSrc}
        alt={title}
        style={{
          width: '80px',
          height: '98px',
          objectFit: 'contain',
          marginTop: '24px',
        }}
      />

      <div
        style={{
          width: '100%',
          height: '52px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive
            ? 'linear-gradient(180deg, #879e47, #778b3e)'
            : 'linear-gradient(180deg, #dbdec8, #cfd2be)',
          color: isActive ? '#fefffb' : '#7d806c',
          borderRadius: '16px 16px 6px 6px',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: '600' }}>{range}</span>
        <span style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>{title}</span>
      </div>
    </div>
  );
}
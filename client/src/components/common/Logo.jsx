import logoImg from '../../assets/logo.png';

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { container: 32, img: 20 },
    md: { container: 48, img: 30 },
    lg: { container: 80, img: 50 },
    xl: { container: 120, img: 75 }
  };

  const { container, img } = sizes[size] || sizes.md;

  return (
    <div 
      className={`logo-wrapper ${className}`}
      style={{
        width: container,
        height: container,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f0eeff 0%, #e8e4ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 8px 24px -6px rgba(76, 64, 230, 0.16), 0 4px 8px -2px rgba(76, 64, 230, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        flexShrink: 0,
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(76, 64, 230, 0.25), 0 0 15px rgba(76, 64, 230, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(76, 64, 230, 0.16), 0 4px 8px -2px rgba(76, 64, 230, 0.1)';
      }}
    >
      {/* Subtle Inner Glow */}
      <div style={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
        pointerEvents: 'none'
      }} />

      <img 
        src={logoImg} 
        alt="AuditArch Logo" 
        style={{ 
          width: img, 
          height: img, 
          objectFit: 'contain',
          position: 'relative',
          zIndex: 2,
          filter: 'drop-shadow(0 2px 4px rgba(76, 64, 230, 0.1))'
        }} 
      />

      {/* Glass Reflection */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default Logo;

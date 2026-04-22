import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firmName = user?.profile?.firmName || 'CA Billing';
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '⧉' },
    { label: 'Past Bills', path: '/bills', icon: '📄' },
    { label: 'Recycle Bin', path: '/recycle-bin', icon: '🗑️' }
  ];

  const avatarLetter = (user?.profile?.firmName || 'U')[0].toUpperCase();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <Logo size="sm" />
        {!isCollapsed && (
          <span style={{ 
            letterSpacing: '-0.02em', 
            fontWeight: 800, 
            marginLeft: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {firmName}
          </span>
        )}
        <button 
          className="sidebar-toggle" 
          onClick={onToggle}
          style={{ 
            marginLeft: isCollapsed ? '0' : 'auto', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: 20, 
            color: 'var(--text-muted)',
            padding: isCollapsed ? '10px 0' : '0'
          }}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
      
      <nav className="nav-group">
        {navItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: 20, opacity: 0.8 }}>{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!isCollapsed && (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 16,
              right: 16,
              marginBottom: 12,
              background: 'white',
              borderRadius: 12,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div 
                style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', borderBottom: '1px solid var(--border)', color: '#0f172a' }}
                onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                ⚙️ Manage Profile
              </div>
              <div 
                style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#ef4444' }}
                onClick={handleLogout}
                onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                🚪 Sign Out
              </div>
            </div>
          )}

          <div 
            className="sidebar-profile" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className="profile-avatar" style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              fontWeight: 800,
              fontSize: 16
            }}>
              {avatarLetter}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
               <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                 {user?.profile?.firmName || 'Complete Profile'}
               </div>
               <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                 {user?.email || 'user@ca-portal.com'}
               </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

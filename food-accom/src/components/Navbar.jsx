import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleScroll = (id) => {
    // If we are on home pages, scroll directly
    const isHome = window.location.pathname === '/' || window.location.pathname === '/user/home';
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate then scroll
      navigate(user ? '/user/home' : '/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>

        {/* LOGO */}
        <Link to={user ? "/user/home" : "/"} style={logoStyle}>
          <span style={{ fontSize: '24px' }}>🏠</span> StayMate
        </Link>



        {/* RIGHT SIDE (Auth Actions) */}
        <div>
          {!user ? (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => navigate('/login')}
                style={loginBtnStyle}
                onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                style={registerBtnStyle}
                onMouseOver={(e) => e.target.style.background = '#6b4291'}
                onMouseOut={(e) => e.target.style.background = '#764ba2'}
              >
                Register
              </button>
            </div>
          ) : (
            <div style={userProfileStyle}>
              <div style={userInfoStyle} onClick={() => navigate(getUserProfileLink(user))}>
                <div style={avatarStyle}>
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
                <span style={userEmailStyle}>
                  {user.firstName || user.name || "User"}
                </span>
              </div>
              <button onClick={logout} style={logoutBtnStyle}>Logout</button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

// Helpers
const getUserProfileLink = (user) => {
  if (user.role === 'OWNER') return '/owner/pg/profile'; // Generic fallback
  if (user.role === 'ADMIN') return '/admin/dashboard';
  return '/user/profile';
}

// STYLES
const navStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  padding: '16px 0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};

const navContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyle = {
  fontSize: '22px',
  fontWeight: '800',
  color: '#764ba2',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  letterSpacing: '-0.5px'
};

const navLinkStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: '15px',
  fontWeight: '600',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'color 0.2s',
  padding: 0
};

const loginBtnStyle = {
  padding: '10px 24px',
  borderRadius: '8px',
  border: '1px solid #764ba2',
  background: 'transparent',
  color: '#764ba2',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s'
};

const registerBtnStyle = {
  padding: '10px 24px',
  borderRadius: '8px',
  border: 'none', // Removing border for cleaner look
  background: '#764ba2',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  boxShadow: '0 4px 6px -1px rgba(118, 75, 162, 0.3)',
  transition: 'all 0.2s'
};

const userProfileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: '10px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  transition: 'background 0.2s'
};

const avatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '14px'
};

const userEmailStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#334155'
};

const logoutBtnStyle = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #fee2e2',
  background: '#fff1f2',
  color: '#ef4444',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.2s'
};

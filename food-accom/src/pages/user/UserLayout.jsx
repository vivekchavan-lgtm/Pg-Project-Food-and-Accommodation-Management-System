import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function UserLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfc' }}>
            {/* Student Navbar */}
            <nav style={navStyle}>
                <div style={navContainerStyle}>
                    <Link to="/user/home" style={logoStyle}>
                        <span style={logoIconStyle}>🏠</span> PG & Mess Finder
                    </Link>

                    <div style={navLinksStyle}>
                        <Link to="/user/search/pg" style={navLinkStyle}>PGs</Link>
                        <Link to="/user/search/mess" style={navLinkStyle}>Mess</Link>
                    </div>

                    <div style={navUserStyle}>
                        {user ? (
                            <div style={userProfileStyle}>
                                <div style={userInfoStyle} onClick={() => navigate('/user/profile')}>
                                    <div style={avatarStyle}>{(user.name || user.email || "U")[0].toUpperCase()}</div>
                                    <span style={userEmailStyle}>{user.name || user.email}</span>
                                </div>
                                <button onClick={logout} style={logoutBtnStyle}>Logout</button>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/login')} style={loginBtnStyle}>Sign In</button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Student Footer */}
            <footer style={footerStyle}>
                <div style={footerContainerStyle}>
                    <div>
                        <h3 style={{ marginBottom: '15px' }}>PG & Mess Finder</h3>
                        <p style={{ opacity: 0.7, fontSize: '14px' }}>Connecting students with the best accommodations and food services since 2024.</p>
                    </div>
                </div>
                <div style={copyrightStyle}>
                    © 2024 PG & Mess Finder. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

// Styles
const navStyle = {
    background: '#fff',
    borderBottom: '1px solid #f1f5f9',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '15px 0'
};

const navContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const logoStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#764ba2',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const logoIconStyle = {
    fontSize: '24px'
};

const navLinksStyle = {
    display: 'flex',
    gap: '30px'
};

const navLinkStyle = {
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'color 0.2s'
};

const navUserStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
};

const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
};

const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '8px',
    transition: 'background 0.2s'
};

const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#764ba2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px'
};

const userEmailStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b'
};

const logoutBtnStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    background: 'transparent',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

const loginBtnStyle = {
    padding: '8px 20px',
    borderRadius: '10px',
    border: 'none',
    background: '#764ba2',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600'
};

const footerStyle = {
    background: '#1e293b',
    color: 'white',
    padding: '60px 0 20px 0',
    marginTop: 'auto'
};

const footerContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px'
};

const copyrightStyle = {
    textAlign: 'center',
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '12px',
    opacity: 0.6
};

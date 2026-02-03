import React from 'react';

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div style={columnStyle}>
          <h3 style={logoStyle}>
            <span style={{ fontSize: '24px' }}>🏠</span> PG & Mess Finder
          </h3>
          <p style={taglineStyle}>
            Connecting students with the best accommodations and authentic home-style food services since 2024.
          </p>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Quick Links</h4>
          <div style={linkGroupStyle}>
            <a href="/" style={linkStyle}>Home</a>
            <a href="/login" style={linkStyle}>Sign In</a>
            <a href="/register" style={linkStyle}>Register</a>
          </div>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Legal</h4>
          <div style={linkGroupStyle}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms of Service</a>
            <a href="#" style={linkStyle}>Cookie Policy</a>
          </div>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Contact</h4>
          <p style={contactStyle}>support@pgfinder.com</p>
          <p style={contactStyle}>+91 123 456 7890</p>
          <p style={contactStyle}>Mumbai, India</p>
        </div>
      </div>

      <div style={copyrightStyle}>
        © {new Date().getFullYear()} PG & Mess Finder. All rights reserved. | Built with ❤️ using React & Spring Boot
      </div>
    </footer>
  );
}

// STYLES
const footerStyle = {
  background: '#1e293b',
  color: '#e2e8f0',
  padding: '60px 0 20px 0',
  marginTop: 'auto',
  fontFamily: '"Inter", sans-serif'
};

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '40px',
  marginBottom: '40px'
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const logoStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: 0
};

const taglineStyle = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#94a3b8',
  margin: 0
};

const headingStyle = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: '700',
  marginBottom: '5px'
};

const linkGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.2s',
  cursor: 'pointer'
};

const contactStyle = {
  color: '#cbd5e1',
  fontSize: '14px',
  margin: 0
};

const copyrightStyle = {
  textAlign: 'center',
  paddingTop: '20px',
  borderTop: '1px solid #334155',
  color: '#64748b',
  fontSize: '13px',
  maxWidth: '1200px',
  margin: '0 auto'
};

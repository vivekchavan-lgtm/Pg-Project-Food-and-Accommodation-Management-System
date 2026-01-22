import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
const nav = useNavigate()

return (
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff7f2' }}>


      {/* ===== HEADER ===== */}
    <header
        style={{
        background: '#fff',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
    >
        {/* Logo / Brand */}
<div>
<h2
    style={{ margin: 0, color: '#ff5200', cursor: 'pointer' }}
    onClick={() => nav('/')}
>
    Food & PG Finder
</h2>
<p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
    Discover verified PGs and home-style food near you
</p>
</div>


        {/* Right side buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
        <button className="btn-primary" onClick={() => nav('/register')}>
            Register
        </button>
        <button className="btn-primary" onClick={() => nav('/login')}>
            Sign In
        </button>
        </div>
    </header>

      {/* ===== MAIN CONTENT ===== */}
    <main
    style={{
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    }}
>
    <div style={{ width: '70%', textAlign: 'center' }}>

    {/* Bold statement */}
    <h1
    style={{
    marginBottom: '40px',
    fontWeight: '800',
    fontSize: '40px',
    color: '#1f2937'
    }}
>

        Discover verified PGs and home-style food near you
    </h1>

    {/* ✅ TWO CARDS PARALLEL */}
    <div
        style={{
        display: 'flex',          // 🔥 KEY FIX
        gap: '40px',
        justifyContent: 'center'
        }}
    >
      {/* CARD 1 */}
    <div
    style={{
    flex: 1,
    background: '#ffffff',
    padding: '60px',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(30,64,175,0.15)',
    border: '2px solid #1e40af'
    }}
>

        <h2>🏠 Find PG / Accommodation</h2>
        <p className="small">
        Search PGs, hostels & rooms near you
        </p>
    </div>

      {/* CARD 2 */}
    <div
    style={{
    flex: 1,
    background: '#ffffff',
    padding: '60px',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(255,82,0,0.2)',
    border: '2px solid #ff5200',
    transition: 'all 0.25s ease'

    }}
>


    <h2>🍽️ Find Food</h2>
    <p className="small">
        find home-style food from nearby mess 
        </p>
    </div>
    </div>

    </div>
</main>

      {/* ===== FOOTER ===== */}
    <footer
        style={{
        background: '#fff',
        padding: '14px 40px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
        borderTop: '1px solid #ddd'
        }}
    >
        © 2026 Food & PG Finder | Built with React & Spring Boot
    </footer>

    </div>
    )
}

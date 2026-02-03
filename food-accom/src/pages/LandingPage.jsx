import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LandingPage() {
    const nav = useNavigate()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* SHARED NAVBAR */}
            <Navbar />

            {/* ===== MAIN CONTENT ===== */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '60px 20px'
                }}
            >
                <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>

                    {/* Hero Text */}
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '24px',
                        color: 'white',
                        marginBottom: '60px',
                        boxShadow: '0 20px 40px rgba(118, 75, 162, 0.2)'
                    }}>
                        <h1
                            style={{
                                marginBottom: '20px',
                                fontWeight: '800',
                                fontSize: '48px',
                                lineHeight: 1.2
                            }}
                        >
                            Find Your Perfect Home <br /> Away From Home
                        </h1>

                        <p style={{ fontSize: '20px', opacity: '0.9', maxWidth: '700px', margin: '0 auto' }}>
                            Discover verified PGs and home-style food services near your college with verified listings.
                        </p>
                    </div>

                    {/* ✅ TWO CARDS PARALLEL */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '40px',
                            justifyContent: 'center'
                        }}
                    >
                        {/* CARD 1: PG */}
                        <div
                            onClick={() => nav('/user/search/pg')}
                            style={cardStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)'
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(118, 75, 162, 0.15)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏠</div>
                            <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Find PG / Hostels</h2>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Search strictly verified PGs, hostels & rooms with all amenities included.
                            </p>
                            <div style={{ marginTop: '20px', color: '#764ba2', fontWeight: 'bold' }}>Search PGs &rarr;</div>
                        </div>

                        {/* CARD 2: MESS */}
                        <div
                            onClick={() => nav('/user/search/mess')}
                            style={cardStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)'
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 82, 0, 0.15)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍽️</div>
                            <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Find Food / Mess</h2>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Discover home-style hygienic food services and daily tiffins near you.
                            </p>
                            <div style={{ marginTop: '20px', color: '#ff5200', fontWeight: 'bold' }}>Find Food &rarr;</div>
                        </div>
                    </div>


                    {/* Contact Us Section */}
                    <div id="contact" style={{ padding: '60px 0', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '40px' }}>Contact Us</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                            <div style={contactCardStyle}>
                                <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>📞</span>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Call Us</h3>
                                <p style={{ fontSize: '16px', color: '#64748b' }}>+91 98765 43210</p>
                            </div>
                            <div style={contactCardStyle}>
                                <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>📧</span>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Email Us</h3>
                                <p style={{ fontSize: '16px', color: '#64748b' }}>support@staymate.com</p>
                            </div>
                            <div style={contactCardStyle}>
                                <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>📍</span>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>Visit Us</h3>
                                <p style={{ fontSize: '16px', color: '#64748b' }}>123, Tech Park, Pune, India</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* SHARED FOOTER */}
            <Footer />

        </div>
    );
}

// STYLES
const cardStyle = {
    background: '#ffffff',
    padding: '50px 40px',
    borderRadius: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    textAlign: 'left'
}

const contactCardStyle = {
    padding: '30px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    minWidth: '250px',
    border: '1px solid #f1f5f9',
    textAlign: 'center'
}

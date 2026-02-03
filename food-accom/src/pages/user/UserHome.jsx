import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = "http://localhost:8080/api/public/listings";
console.log("SPRING API:", import.meta.env.VITE_SPRING_API);

export default function UserHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        fetchRecent();
    }, []);

    const fetchRecent = async () => {
        try {
            const res = await axios.get(API_URL);
            // Show latest 3
            setRecentListings(res.data.slice(-3).reverse());
        } catch (err) {
            console.error("Failed to fetch recent listings", err);
        }
    };

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroStyle}>
                <h1 style={heroTitleStyle}>Find Your Perfect Home Away From Home</h1>
                <p style={heroSubStyle}>Discover the best PGs and Mess services near your college with verified listings and student reviews.</p>
                <div style={heroActionStyle}>
                    <button
                        style={actionBtnStyle}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => navigate('/user/search/pg')}
                    >
                        Explore PGs
                    </button>
                    <button
                        style={actionBtnStyle}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => navigate('/user/search/mess')}
                    >
                        Find Mess
                    </button>
                </div>
            </div>

            {/* Recently Added Section */}
            {recentListings.length > 0 && (
                <div style={{ marginBottom: '80px' }}>
                    <h2 style={sectionTitleStyle}>Recently Added</h2>
                    <div style={recentGridStyle}>
                        {recentListings.map(item => (
                            <div
                                key={item.ownerId}
                                style={recentCardStyle}
                                onClick={() => navigate(`/user/${item.ownerType.toLowerCase()}/${item.ownerId}`)}
                            >
                                <img
                                    src={item.imageUrl || (item.ownerType === 'PG' ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' : 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400')}
                                    alt={item.name}
                                    style={recentImgStyle}
                                />
                                <div style={recentContentStyle}>
                                    <span style={recentBadgeStyle}>{item.ownerType}</span>
                                    <h4 style={recentTitleStyle}>{item.ownerType === 'PG' ? item.pgName : item.messName}</h4>
                                    <p style={recentAddressStyle}>📍 {item.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats / Info */}
            <div style={infoGridStyle}>
                <div style={infoCardStyle}>
                    <span style={iconStyle}>🏠</span>
                    <h3>Verified PGs</h3>
                    <p>All our PG listings are manually verified for safety and comfort.</p>
                </div>
                <div style={infoCardStyle}>
                    <span style={iconStyle}>🍱</span>
                    <h3>Healthy Food</h3>
                    <p>Find mess services that offer nutritious meals tailored to your taste.</p>
                </div>
                <div style={infoCardStyle}>
                    <span style={iconStyle}>⭐</span>
                    <h3>Student Reviews</h3>
                    <p>Read honest feedback from your peers before making a choice.</p>
                </div>
            </div>



            {/* Contact Us Section */}
            <div style={contactSectionStyle} id="contact">
                <h2 style={sectionTitleStyle}>Contact Us</h2>
                <div style={contactGridStyle}>
                    <div style={contactCardStyle}>
                        <span style={contactIconStyle}>📞</span>
                        <h3 style={contactLabelStyle}>Call Us</h3>
                        <p style={contactValueStyle}>+91 98765 43210</p>
                    </div>
                    <div style={contactCardStyle}>
                        <span style={contactIconStyle}>📧</span>
                        <h3 style={contactLabelStyle}>Email Us</h3>
                        <p style={contactValueStyle}>support@pgmessfinder.com</p>
                    </div>
                    <div style={contactCardStyle}>
                        <span style={contactIconStyle}>📍</span>
                        <h3 style={contactLabelStyle}>Visit Us</h3>
                        <p style={contactValueStyle}>123, Tech Park, Pune, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '"Inter", sans-serif'
};

const heroStyle = {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Reverted to Brand Purple Gradient
    borderRadius: '24px',
    color: 'white',
    marginBottom: '60px',
    boxShadow: '0 20px 40px rgba(118, 75, 162, 0.2)'
};

const heroTitleStyle = {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2'
};

const heroSubStyle = {
    fontSize: '20px',
    opacity: '0.9',
    maxWidth: '700px',
    margin: '0 auto 40px auto'
};

const heroActionStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center'
};

const actionBtnStyle = {
    padding: '20px 40px',
    fontSize: '20px',
    fontWeight: '700',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#fff', // White background
    color: '#764ba2', // Purple text
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '80px'
};

const infoCardStyle = {
    padding: '40px',
    background: '#f8fafc',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
};

const iconStyle = {
    fontSize: '40px',
    marginBottom: '20px',
    display: 'block'
};

const featuredSectionStyle = {
    textAlign: 'center',
    padding: '60px 0'
};

const sectionTitleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#1e293b'
};

const featureListStyle = {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center',
    flexWrap: 'wrap'
};

const featureItemStyle = {
    flex: '1',
    minWidth: '250px',
    textAlign: 'left',
    padding: '20px',
    borderLeft: '4px solid #764ba2'
};

const recentGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
};

const recentCardStyle = {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #f1f5f9'
};

const recentImgStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
};

const recentContentStyle = {
    padding: '20px'
};

const recentBadgeStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#764ba2',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block'
};

const recentTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px'
};

const recentAddressStyle = {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
};



const contactSectionStyle = {
    textAlign: 'center',
    marginBottom: '60px'
};

const contactGridStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap'
};

const contactCardStyle = {
    padding: '30px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    minWidth: '250px',
    border: '1px solid #f1f5f9'
};

const contactIconStyle = {
    fontSize: '32px',
    marginBottom: '15px',
    display: 'block'
};

const contactLabelStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '5px'
};

const contactValueStyle = {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500'
};

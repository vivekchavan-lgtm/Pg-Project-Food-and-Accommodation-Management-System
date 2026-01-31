import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8080/api";

export default function UserProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.userId) fetchUserProfile();
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            // We can fetch from OwnerController if they are an owner, 
            // but for a general user, we might need a general User endpoint.
            // Since we don't have a specific /api/users/{id} that returns full details 
            // including owner info easily for public, let's use the owner endpoint if they are an owner.

            let url = `${API_URL}/admin/users/${user.userId}`; // Assuming this exists from AdminController
            if (user.role === 'OWNER') {
                url = `${API_URL}/admin/owners/${user.userId}`;
            }

            const res = await axios.get(url);
            setUserData(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={containerStyle}>Loading Profile...</div>;
    if (!userData) return <div style={containerStyle}>Profile not found.</div>;

    const isOwner = user.role === 'OWNER';

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <div style={avatarLargeStyle}>
                        {(userData.firstName || "U")[0].toUpperCase()}
                    </div>
                    <h2 style={nameTitleStyle}>{userData.firstName} {userData.lastName}</h2>
                    <span style={roleBadgeStyle}>{user.role}</span>
                </div>

                <div style={infoGridStyle}>
                    <div style={infoItemStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <p style={valueStyle}>{userData.email}</p>
                    </div>
                    <div style={infoItemStyle}>
                        <label style={labelStyle}>Mobile Number</label>
                        <p style={valueStyle}>{userData.mobile || userData.contactNo || 'Not Provided'}</p>
                    </div>
                    <div style={infoItemStyle}>
                        <label style={labelStyle}>City</label>
                        <p style={valueStyle}>{userData.city || userData.address || 'Not Provided'}</p>
                    </div>
                    <div style={infoItemStyle}>
                        <label style={labelStyle}>Gender</label>
                        <p style={valueStyle}>{userData.gender || 'Not Provided'}</p>
                    </div>
                </div>

                {isOwner && (
                    <div style={ownerSectionStyle}>
                        <h3 style={sectionTitleStyle}>Your {userData.ownerType} Listing</h3>
                        <div style={ownerInfoCardStyle}>
                            <p><strong>Name:</strong> {userData.pgName || userData.messName}</p>
                            <p><strong>Status:</strong> <span style={{ color: userData.status === 'ACTIVE' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>{userData.status}</span></p>
                            <button
                                style={manageBtnStyle}
                                onClick={() => navigate(userData.ownerType === 'PG' ? '/owner/pg/dashboard' : '/owner/mess/dashboard')}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                <div style={actionRowStyle}>
                    <button style={editBtnStyle} onClick={() => alert("Edit Profile Coming Soon")}>Edit Profile</button>
                    <button style={logoutBtnStyle} onClick={logout}>Sign Out</button>
                </div>
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    maxWidth: '800px',
    margin: '60px auto',
    padding: '0 20px'
};

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
};

const avatarLargeStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '800',
    margin: '0 auto 20px auto',
    boxShadow: '0 10px 20px rgba(118, 75, 162, 0.2)'
};

const nameTitleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '8px'
};

const roleBadgeStyle = {
    padding: '4px 12px',
    background: '#f1f5f9',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    padding: '30px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9'
};

const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const valueStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#334155'
};

const ownerSectionStyle = {
    marginTop: '40px'
};

const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px'
};

const ownerInfoCardStyle = {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const manageBtnStyle = {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: '#764ba2',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    width: 'fit-content'
};

const actionRowStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '40px',
    justifyContent: 'center'
};

const editBtnStyle = {
    padding: '12px 30px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: 'white',
    color: '#1e293b',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s'
};

const logoutBtnStyle = {
    padding: '12px 30px',
    borderRadius: '12px',
    border: 'none',
    background: '#fee2e2',
    color: '#ef4444',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s'
};

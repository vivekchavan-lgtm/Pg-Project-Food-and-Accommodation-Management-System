import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = "http://localhost:8080/api";

export default function UserProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Form States
    const [editFormData, setEditFormData] = useState({
        firstName: '', lastName: '', mobile: '', city: '', gender: ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '', newPassword: '', confirmPassword: ''
    });

    useEffect(() => {
        if (user && user.userId) {
            fetchUserProfile();
            fetchUserBookings();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/bookings/user/${user.userId}`);
            setUserBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const url = `${API_URL}/users/${user.userId}`;
            const res = await axios.get(url);
            setUserData(res.data);
            setEditFormData({
                firstName: res.data.firstName || '',
                lastName: res.data.lastName || '',
                mobile: res.data.mobile || '',
                city: res.data.city || '',
                gender: res.data.gender || ''
            });
        } catch (err) {
            console.error("Failed to fetch profile", err);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitEditProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/users/${user.userId}`, editFormData);
            toast.success("Profile updated successfully!");
            setShowEditModal(false);
            fetchUserProfile(); // Refresh data
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    const submitChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        try {
            await axios.put(`${API_URL}/users/${user.userId}/password`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully!");
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to change password");
        }
    };

    // Rating States
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingData, setRatingData] = useState({ ownerId: null, score: 5, feedback: '' });

    const openRatingModal = (ownerId) => {
        setRatingData({ ownerId, score: 5, feedback: '' });
        setShowRatingModal(true);
    };

    const submitRating = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/ratings`, {
                userId: user.userId,
                ownerId: ratingData.ownerId,
                score: parseInt(ratingData.score),
                feedback: ratingData.feedback
            });
            toast.success("Thank you for your feedback!");
            setShowRatingModal(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit rating");
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (!userData) return <div>User not found</div>;

    const isOwner = userData.ownerType === 'PG' || userData.ownerType === 'MESS';

    // Helper component for details (assuming it's defined elsewhere or will be added)
    const DetailItem = ({ label, value }) => (
        <div style={infoItemStyle}>
            <label style={labelStyle}>{label}</label>
            <p style={valueStyle}>{value || 'Not Provided'}</p>
        </div>
    );

    return (
        <div style={containerStyle}>
            {/* Header Section */}
            <div style={headerStyle}>
                <div style={avatarStyle}>{userData.firstName?.charAt(0)}</div>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b' }}>{userData.firstName} {userData.lastName}</h1>
                    <p style={{ margin: '5px 0 0', color: '#64748b' }}>{userData.email}</p>
                </div>
            </div>

            <div style={gridStyle}>
                {/* Personal Details */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={sectionTitleStyle}>Personal Details</h3>
                        <button onClick={() => {
                            setEditFormData({
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                mobile: userData.mobile,
                                city: userData.city,
                                gender: userData.gender
                            });
                            setShowEditModal(true);
                        }} style={editBtnStyle}>Edit Profile</button>
                    </div>
                    <div style={detailsGridStyle}>
                        <DetailItem label="Mobile" value={userData.mobile} />
                        <DetailItem label="City" value={userData.city} />
                        <DetailItem label="Gender" value={userData.gender} />
                        <DetailItem label="Joined" value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'} />
                    </div>
                    <button onClick={() => setShowPasswordModal(true)} style={changePasswordBtnStyle}>Change Password</button>
                </div>

                <div style={ownerSectionStyle}>
                    <h3 style={sectionTitleStyle}>My Bookings</h3>
                    {userBookings.length === 0 ? <p style={{ color: '#94a3b8' }}>No bookings found.</p> : (
                        <div style={bookingsGridStyle}>
                            {userBookings.map(booking => (
                                <div key={booking.bookingId} style={bookingCardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>{booking.ownerName}</h4>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px',
                                            background: booking.status === 'ACCEPTED' ? '#dcfce7' : (booking.status === 'PENDING' ? '#ffedd5' : '#fee2e2'),
                                            color: booking.status === 'ACCEPTED' ? '#166534' : (booking.status === 'PENDING' ? '#9a3412' : '#991b1b')
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#64748b' }}>{new Date(booking.createdAt).toLocaleDateString()}</p>
                                    <p style={{ margin: 0, fontSize: '14px', background: '#f8fafc', padding: '8px', borderRadius: '6px', color: '#334155' }}>
                                        "{booking.message}"
                                    </p>

                                    {booking.status === 'ACCEPTED' && (
                                        <button
                                            onClick={() => openRatingModal(booking.ownerId)}
                                            style={{
                                                marginTop: '10px', padding: '5px 10px', fontSize: '12px',
                                                background: '#f5a623', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                            }}
                                        >
                                            ⭐ Rate Owner
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <h2>Edit Profile</h2>
                        <form onSubmit={submitEditProfile}>
                            <div style={inputGroupStyle}>
                                <label>First Name</label>
                                <input type="text" name="firstName" value={editFormData.firstName} onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Last Name</label>
                                <input type="text" name="lastName" value={editFormData.lastName} onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Mobile</label>
                                <input type="text" name="mobile" value={editFormData.mobile} onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>City</label>
                                <input type="text" name="city" value={editFormData.city} onChange={e => setEditFormData({ ...editFormData, city: e.target.value })} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Gender</label>
                                <select name="gender" value={editFormData.gender} onChange={e => setEditFormData({ ...editFormData, gender: e.target.value })} style={inputStyle}>
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setShowEditModal(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={saveBtnStyle}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <h2>Change Password</h2>
                        <form onSubmit={submitChangePassword}>
                            <div style={inputGroupStyle}>
                                <label>Old Password</label>
                                <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} style={inputStyle} required />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>New Password</label>
                                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={inputStyle} required />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={inputStyle} required />
                            </div>
                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setShowPasswordModal(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={saveBtnStyle}>Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <h2>Rate Owner</h2>
                        <form onSubmit={submitRating}>
                            <div style={inputGroupStyle}>
                                <label>Score (1-5)</label>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setRatingData({ ...ratingData, score: star })}
                                            style={{
                                                fontSize: '30px',
                                                cursor: 'pointer',
                                                color: star <= ratingData.score ? '#f5a623' : '#e2e8f0',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Feedback</label>
                                <textarea
                                    value={ratingData.feedback}
                                    onChange={e => setRatingData({ ...ratingData, feedback: e.target.value })}
                                    style={{ ...inputStyle, height: '80px' }}
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>
                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setShowRatingModal(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={saveBtnStyle}>Submit Rating</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

const avatarStyle = {
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

const gridStyle = {
    display: 'grid',
    gap: '30px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    alignItems: 'start'
};

const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    padding: '20px 0',
    marginBottom: '20px',
    borderBottom: '1px solid #f1f5f9'
};

// Renamed and adjusted to match previous usage
const infoGridStyle = {
    display: 'contents'
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

const bookingsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px'
};

const bookingCardStyle = {
    background: '#f8fafc',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
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
    justifyContent: 'center',
    flexWrap: 'wrap'
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

const changePasswordBtnStyle = {
    padding: '12px 30px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: 'white',
    color: '#d97706',
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

// Modal Styles
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const inputStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '16px'
};

const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px'
};

const cancelBtnStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#f1f5f9',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600'
};

const saveBtnStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#764ba2',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600'
};

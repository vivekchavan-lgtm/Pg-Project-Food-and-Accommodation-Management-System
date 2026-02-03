import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = "http://localhost:8080/api";

export default function OwnerProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [form, setForm] = useState({
        // Common
        name: '', contactNo: '', address: '',
        idCardType: 'AADHAR', idCardNumber: '',
        // PG
        pgName: '', totalRooms: 0, pgType: 'BOTH', facilities: '',
        // Mess
        messName: '', messType: 'BOTH', timings: 'FULLDAY', description: '',
        imageUrl: ''
    });

    useEffect(() => {
        console.log("DEBUG: OwnerProfile useEffect, user:", user);
        if (user && user.userId) loadOwner();
    }, [user]);

    const loadOwner = async () => {
        try {
            if (!user || !user.userId) {
                console.log("DEBUG: No userId found in user object");
                setLoading(false);
                return;
            }

            console.log("DEBUG: Fetching profile for userId:", user.userId);
            const res = await axios.get(`${API_URL}/admin/owners/${user.userId}`);
            const data = res.data;
            console.log("DEBUG: Profile data received:", data);
            setOwner(data);

            setForm({
                name: data.name || '',
                contactNo: data.contactNo || '',
                address: data.address || '',
                idCardType: data.idCardType || 'AADHAR',
                idCardNumber: data.idCardNumber || '',
                pgName: data.pgName || '',
                totalRooms: data.totalRooms || 0,
                pgType: data.pgType || 'BOTH',
                facilities: data.facilities || '',
                messName: data.messName || '',
                messType: data.messType || 'BOTH',
                timings: data.timings || 'FULLDAY',
                description: data.description || '',
                imageUrl: data.imageUrl || ''
            });
        } catch (err) {
            console.error("Failed to load profile", err);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const isOwnerPG = owner.ownerType === 'PG';
            await axios.put(`${API_URL}/admin/owners/${user.userId}/profile`, form);
            toast.success("Profile Updated Successfully!");
            navigate(isOwnerPG ? "/owner/pg/dashboard" : "/owner/mess/dashboard");
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div style={containerStyle}>Loading...</div>;
    if (!owner) return <div style={containerStyle}>Owner not found.</div>;

    const isPG = owner.ownerType === 'PG';

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h2>{isPG ? 'PG' : 'Mess'} Owner Profile</h2>
                        <p>Complete your details according to the system requirements.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>

                        {/* Section: Account Status (Read Only) */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>Account Status</h3>
                            <div style={grid2Col}>
                                <div>
                                    <label style={labelStyle}>Email (Login ID)</label>
                                    <input style={{ ...inputStyle, backgroundColor: '#e9ecef' }} value={owner.email} readOnly />
                                </div>
                                <div>
                                    <label style={labelStyle}>Profile Status</label>
                                    <input style={{ ...inputStyle, backgroundColor: '#e9ecef', fontWeight: 'bold', color: owner.status === 'ACTIVE' ? 'green' : 'orange' }} value={owner.status} readOnly />
                                </div>
                            </div>
                        </div>

                        {/* Section: Personal Information */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>Basic Personal Information</h3>
                            <div style={grid2Col}>
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Contact Number</label>
                                    <input style={inputStyle} name="contactNo" value={form.contactNo} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ marginTop: '15px' }}>
                                <label style={labelStyle}>Permanent Address</label>
                                <textarea style={inputStyle} name="address" value={form.address} onChange={handleChange} required rows="2" />
                            </div>
                        </div>

                        {/* Section: Identity Verification */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>Identity Verification</h3>
                            <div style={grid2Col}>
                                <div>
                                    <label style={labelStyle}>ID Card Type</label>
                                    <select style={inputStyle} name="idCardType" value={form.idCardType} onChange={handleChange} required>
                                        <option value="AADHAR">Aadhar Card</option>
                                        <option value="PAN">PAN Card</option>
                                        <option value="VOTER_ID">Voter ID</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>ID Card Number</label>
                                    <input style={inputStyle} name="idCardNumber" value={form.idCardNumber} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Section: Specific Details */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>{isPG ? 'PG Property Details' : 'Mess Service Details'}</h3>
                            {isPG ? (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <div>
                                        <label style={labelStyle}>PG Name</label>
                                        <input style={inputStyle} name="pgName" value={form.pgName} onChange={handleChange} required />
                                    </div>
                                    <div style={grid2Col}>
                                        <div>
                                            <label style={labelStyle}>Total Rooms</label>
                                            <input style={inputStyle} type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} required min="1" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>PG Type</label>
                                            <select style={inputStyle} name="pgType" value={form.pgType} onChange={handleChange}>
                                                <option value="BOTH">Combined (Boys & Girls)</option>
                                                <option value="BOYS">Boys Only</option>
                                                <option value="GIRLS">Girls Only</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Facilities (Separated by commas)</label>
                                        <textarea style={inputStyle} name="facilities" value={form.facilities} onChange={handleChange} rows="3" placeholder="WiFi, Laundry, AC, etc." />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Property Image URL</label>
                                        <input style={inputStyle} name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/pg-photo.jpg" />
                                        {form.imageUrl && <img src={form.imageUrl} alt="PG" style={{ marginTop: '10px', width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <div>
                                        <label style={labelStyle}>Mess Name</label>
                                        <input style={inputStyle} name="messName" value={form.messName} onChange={handleChange} required />
                                    </div>
                                    <div style={grid2Col}>
                                        <div>
                                            <label style={labelStyle}>Mess Food Type</label>
                                            <select style={inputStyle} name="messType" value={form.messType} onChange={handleChange}>
                                                <option value="BOTH">Veg & Non-Veg</option>
                                                <option value="VEG">Veg Only</option>
                                                <option value="NONVEG">Non-Veg Only</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Operating Timings</label>
                                            <select style={inputStyle} name="timings" value={form.timings} onChange={handleChange}>
                                                <option value="FULLDAY">Full Day</option>
                                                <option value="MORNING">Morning Only</option>
                                                <option value="EVENING">Evening Only</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Description / Menu Highlights</label>
                                        <textarea style={inputStyle} name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe your food quality and menu..." />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Mess Image URL</label>
                                        <input style={inputStyle} name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/mess-photo.jpg" />
                                        {form.imageUrl && <img src={form.imageUrl} alt="Mess" style={{ marginTop: '10px', width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Save Profile Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem'
};

const cardStyle = {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
};

const headerStyle = {
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
    marginBottom: '30px',
    textAlign: 'center'
};

const sectionStyle = {
    padding: '20px',
    background: '#fcfcfc',
    borderRadius: '8px',
    border: '1px solid #f0f0f0'
};

const sectionTitleStyle = {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#333',
    borderLeft: '4px solid #007bff',
    paddingLeft: '10px'
};

const grid2Col = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '15px'
};

const submitButtonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px'
};

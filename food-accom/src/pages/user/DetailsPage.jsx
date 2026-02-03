import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from '../../contexts/AuthContext';

const API_URL = "http://localhost:8080/api/public/listings";
const BOOKING_API = "http://localhost:8080/api/bookings";

export default function DetailsPage({ contentType }) {
    const { id } = useParams();
    const type = contentType;
    const { user } = useAuth(); // Get logged in user
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/${id}`);
            setData(res.data);
            if (res.data?.owner?.ownerId) {
                fetchReviews(res.data.owner.ownerId);
            }
        } catch (err) {
            console.error("Failed to fetch details", err);
            toast.error("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (ownerId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/ratings/${ownerId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.warn("Please login to book!");
            return;
        }

        if (confirm(`Send booking request to ${data.owner.name}?`)) {
            try {
                setBookingLoading(true);
                const payload = {
                    userId: user.userId,
                    ownerId: data.owner.ownerId,
                    message: "I am interested in your services."
                };
                await axios.post(BOOKING_API, payload);
                toast.success("Booking request sent! The owner will contact you soon.");
            } catch (err) {
                console.error("Booking failed", err);
                toast.error(err.response?.data || "Failed to send booking request.");
            } finally {
                setBookingLoading(false);
            }
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Details...</div>;
    if (!data) return <div style={{ padding: '100px', textAlign: 'center' }}>Listing not found.</div>;

    const { owner, rooms, menu } = data;

    return (
        <div style={containerStyle}>
            {/* Gallery / Cover */}
            <div style={coverStyle}>
                <img
                    src={owner.imageUrl || (type === 'pg' ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200' : 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200')}
                    alt={type === 'pg' ? owner.pgName : owner.messName}
                    style={coverImgStyle}
                />
                <div style={coverOverlayStyle}>
                    <h1 style={titleStyle}>{type === 'pg' ? owner.pgName : owner.messName}</h1>
                    <p style={subTitleStyle}>📍 {owner.address}</p>
                </div>
            </div>

            <div style={contentGridStyle}>
                {/* Main Content */}
                <div style={mainContentStyle}>
                    <section style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>About this {type === 'pg' ? 'PG' : 'Mess'}</h2>
                        <p style={descriptionStyle}>
                            {type === 'pg' ? owner.facilities : owner.description || "Experience top-notch services and a friendly atmosphere tailored for students."}
                        </p>
                    </section>

                    {type === 'pg' && rooms && (
                        <section style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Available Rooms</h2>
                            <div style={itemGridStyle}>
                                {rooms.map(room => (
                                    <div key={room.roomId} style={itemCardStyle}>
                                        <h3>Room {room.roomNumber}</h3>
                                        <p>Price: ₹{room.price} / month</p>
                                        <p>Capacity: {room.capacity} Person(s)</p>
                                        <p style={{ color: room.availability ? 'green' : 'red', fontWeight: 'bold' }}>
                                            {room.availability ? 'Available' : 'Occupied'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {type === 'mess' && menu && (
                        <section style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Our Menu</h2>
                            <div style={itemGridStyle}>
                                {menu.map(item => (
                                    <div key={item.menuId} style={itemCardStyle}>
                                        <h3>{item.itemName}</h3>
                                        <span style={badgeStyle}>{item.category}</span>
                                        <p style={priceStyle}>₹{item.price}</p>
                                        <p style={{ color: item.available ? 'green' : 'red', fontSize: '13px' }}>
                                            {item.available ? '● Serving Today' : '○ Not Available Today'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}


                    {/* Reviews Section */}
                    <section style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>Reviews & Ratings</h2>
                        {reviewsLoading ? <p>Loading reviews...</p> : (
                            reviews.length === 0 ? <p style={{ color: '#64748b' }}>No reviews yet. Be the first to rate!</p> : (
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {reviews.map(review => (
                                        <div key={review.ratingId} style={{ ...itemCardStyle, background: '#fff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{review.userName}</span>
                                                <span style={{ color: '#f5a623', fontWeight: 'bold' }}>{'★'.repeat(review.score)}</span>
                                            </div>
                                            <p style={{ margin: '5px 0', fontSize: '13px', color: '#94a3b8' }}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                            <p style={{ margin: 0, color: '#334155' }}>"{review.feedback}"</p>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </section>
                </div>

                {/* Sidebar / Contact */}
                <div style={sidebarStyle}>
                    <div style={contactCardStyle}>
                        <h3>Interested?</h3>
                        <p>Contact the owner directly to book your spot.</p>
                        <div style={contactInfoStyle}>
                            <p><strong>Owner:</strong> {owner.name}</p>
                            <p><strong>Phone:</strong> {owner.contactNo}</p>
                            <p><strong>Email:</strong> {owner.email}</p>
                            <p><strong>Address:</strong> {owner.address}</p>
                        </div>
                        <button
                            style={{ ...bookBtnStyle, opacity: bookingLoading ? 0.7 : 1 }}
                            onClick={handleBooking}
                            disabled={bookingLoading}
                        >
                            {bookingLoading ? "Sending..." : "Send Booking Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

// Styles
const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 80px 20px'
};

const coverStyle = {
    position: 'relative',
    height: '450px',
    borderRadius: '0 0 30px 30px',
    overflow: 'hidden',
    marginBottom: '50px',
    marginTop: '20px'
};

const coverImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const coverOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: '40px',
    color: 'white'
};

const titleStyle = {
    fontSize: '42px',
    fontWeight: '800',
    margin: '0 0 10px 0'
};

const subTitleStyle = {
    fontSize: '18px',
    opacity: 0.9
};

const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '50px'
};

const mainContentStyle = {
    display: 'grid',
    gap: '40px'
};

const sectionStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9'
};

const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#1e293b'
};

const descriptionStyle = {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6'
};

const itemGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px'
};

const itemCardStyle = {
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
};

const sidebarStyle = {};

const contactCardStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    position: 'sticky',
    top: '100px'
};

const contactInfoStyle = {
    margin: '25px 0',
    fontSize: '15px',
    color: '#475569',
    lineHeight: '2'
};

const bookBtnStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: '#764ba2',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s'
};

const badgeStyle = {
    fontSize: '11px',
    background: '#764ba2',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'inline-block'
};

const priceStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#764ba2',
    margin: '10px 0'
};

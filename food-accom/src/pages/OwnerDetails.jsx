import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOwnerById, getOwnerRatings, addRating, getAverageRating } from '../services/ownerService';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Rating from '../components/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function OwnerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    // ... (keep state same)
    const [owner, setOwner] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [average, setAverage] = useState(0);
    const [items, setItems] = useState([]); // Rooms or Menus
    const [loading, setLoading] = useState(true);

    // Rating Form
    const [userRating, setUserRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);
    // ...
    const loadData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Owner (I need to ensure getOwnerById is exported from ownerService)
            // Since I haven't added it to ownerService.js yet, I will do it now or use raw axios here temporarily, 
            // but better to add it to service. I'll assume I'll add it.
            const ownerRes = await axios.get(`http://localhost:8080/api/admin/owners/${id}`);
            setOwner(ownerRes.data);

            // 2. Fetch Ratings
            const ratingsRes = await getOwnerRatings(id);
            setRatings(ratingsRes.data);

            const avgRes = await getAverageRating(id);
            setAverage(avgRes.data);

            // 3. Fetch Items based on type
            if (ownerRes.data.ownerType === 'PG') {
                const roomRes = await axios.get(`http://localhost:8080/api/rooms/owner/${id}`);
                setItems(roomRes.data);
            } else {
                const menuRes = await axios.get(`http://localhost:8080/api/mess/menu/owner/${id}`);
                setItems(menuRes.data);
            }

        } catch (err) {
            console.error("Error fetching owner details", err);
            toast.error("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async () => {
        if (!user) return toast.warn("Please login to rate");
        if (userRating === 0) return toast.warn("Select a star rating");

        try {
            await addRating({
                userId: user.id, // Assuming user object has id
                ownerId: id,
                score: userRating,
                feedback
            });
            toast.success("Rating submitted!");
            setUserRating(0);
            setFeedback("");
            loadData(); // Reload to show new rating
        } catch (err) {
            toast.error("Failed to submit rating");
        }
    };

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
    if (!owner) return <div style={{ padding: 20 }}>Owner not found</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <Navbar />
            <div className="container" style={{ padding: '20px' }}>

                {/* Header / Owner Info */}
                <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>{owner.name}</h1>
                    <p style={{ color: '#666' }}>{owner.ownerType === 'PG' ? 'PG / Hostel' : 'Mess / Tiffin Service'} • {owner.address}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <Rating value={average} size="24px" />
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{average.toFixed(1)}</span>
                        <span style={{ color: '#666' }}>({ratings.length} reviews)</span>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                    {/* Left Col: Items (Rooms/Menus) */}
                    <div>
                        <h2 style={{ marginTop: 0 }}>Available {owner.ownerType === 'PG' ? 'Rooms' : 'Menu Items'}</h2>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {items.length === 0 && <p>No items listed yet.</p>}
                            {items.map(item => (
                                <div key={item.roomId || item.menuId} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                                    <div>
                                        {owner.ownerType === 'PG' ? (
                                            <>
                                                <strong>Room {item.roomNumber}</strong>
                                                <div className="small">{item.capacity} Person(s) • {item.facilities}</div>
                                            </>
                                        ) : (
                                            <>
                                                <strong>{item.itemName}</strong>
                                                <div className="small">{item.category} • {item.available ? 'Available' : 'Sold Out'}</div>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: '#059669' }}>₹{item.price}</div>
                                        <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '12px', marginTop: '5px' }}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Col: Reviews & Add Rating */}
                    <div>
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Write a Review</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <Rating value={userRating} onRate={setUserRating} size="28px" />
                            </div>
                            <textarea
                                className="input"
                                rows="3"
                                placeholder="Share your experience..."
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <button className="btn-primary" onClick={handleRate} style={{ width: '100%' }}>Submit Review</button>
                        </div>

                        <div className="card">
                            <h3>Reviews</h3>
                            {ratings.length === 0 && <p className="small">No reviews yet.</p>}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                                {ratings.map(r => (
                                    <div key={r.ratingId} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <strong>{r.user ? (r.user.firstName || "User") : "User"}</strong>
                                            <Rating value={r.score} size="14px" />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{r.feedback}</p>
                                        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

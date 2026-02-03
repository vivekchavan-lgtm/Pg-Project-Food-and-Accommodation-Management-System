import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function OwnerRatings() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.userId) {
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            // Check owner info first to get ownerId if needed, but the current backend 
            // implementation of getOwnerRatings uses the @PathVariable as ownerId.
            // Wait, I need to know the *OwnerId* (from Owner table), not just UserId.
            // The service looks up Owner by User ID: `ownerRepository.findByUser_Id(userId)`
            // Wait, my updated service changed that logic.
            // "The userId passed here is actually ownerId... So the argument is ownerId."
            // AND "List<Rating> ratings = ratingRepository.findByOwner_OwnerId(userId);"

            // IF I passed userId to my updated service, it would try to find owner by ownerId=userId which is WRONG.
            // My previous thought in the service update was: "Controller: getRatings(@PathVariable Long ownerId)".
            // BUT for the owner dashboard, we might only have `user.userId`.

            // Let's check if `user` object in AuthContext has `ownerId` or if we need to fetch it.
            // Usually `user` has core fields.

            // Let's assume we need to fetch owner details first OR use an endpoint that accepts userId.
            // Actually, the previous implementation `ratingService.getOwnerRatings` took `userId` and looked up Owner.
            // I CHANGED it to take `ownerId` directly.
            // So I need to get the `ownerId` first.

            // OPTION: Fetch owner profile to get ownerId, then fetch ratings.

            const ownerRes = await axios.get(`http://localhost:8080/api/owners/user/${user.userId}`);
            const ownerId = ownerRes.data.ownerId;

            const res = await axios.get(`http://localhost:8080/api/ratings/${ownerId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>My Ratings & Reviews</h2>
            {reviews.length === 0 ? <p>No reviews yet.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {reviews.map(review => (
                        <div key={review.ratingId} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{review.userName}</span>
                                <span style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: '8px', color: '#d97706', fontWeight: 'bold' }}>
                                    ★ {review.score}
                                </span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '10px' }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            <p style={{ color: '#334155', lineHeight: '1.5' }}>"{review.feedback}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
};

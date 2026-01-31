import React from 'react';

// Simple Star Rating Component
// value: number (0-5)
// onRate: function(rating) - if provided, makes it interactive
const Rating = ({ value, onRate, count, size = '20px' }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onRate && onRate(star)}
                    style={{
                        cursor: onRate ? 'pointer' : 'default',
                        color: star <= value ? '#f59e0b' : '#d1d5db',
                        fontSize: size,
                    }}
                >
                    ★
                </span>
            ))}
            {count !== undefined && <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>({count})</span>}
        </div>
    );
};

export default Rating;

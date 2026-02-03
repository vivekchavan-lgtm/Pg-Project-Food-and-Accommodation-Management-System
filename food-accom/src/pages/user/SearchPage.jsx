import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:8080/api/public/listings";

export default function SearchPage() {
    const { type } = useParams(); // 'pg' or 'mess'
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'ALL', // BOYS/GIRLS/VEG/NONVEG
        priceMax: 20000
    });

    useEffect(() => {
        fetchListings();
    }, [type]);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, listings]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/${type}`);
            setListings(res.data);
            setFilteredListings(res.data);
        } catch (err) {
            console.error("Failed to fetch listings", err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = listings;

        // Search by Name or Address
        if (searchTerm) {
            result = result.filter(item =>
                (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.pgName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.messName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.address?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Type Filter
        if (filters.type !== 'ALL') {
            if (type === 'pg') {
                result = result.filter(item => item.pgType === filters.type || item.pgType === 'BOTH');
            } else {
                result = result.filter(item => item.messType === filters.type || item.messType === 'BOTH');
            }
        }

        setFilteredListings(result);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading listings...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1>{type === 'pg' ? 'Student PGs' : 'Mess Services'}</h1>
                <p>Browse through verified {type === 'pg' ? 'accommodations' : 'food services'} near you.</p>
            </div>

            {/* Filter Bar */}
            <div style={filterBarStyle}>
                <input
                    style={searchInputStyle}
                    placeholder="Search by name, area or landmark..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    style={selectStyle}
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="ALL">All Types</option>
                    {type === 'pg' ? (
                        <>
                            <option value="BOYS">Boys Only</option>
                            <option value="GIRLS">Girls Only</option>
                        </>
                    ) : (
                        <>
                            <option value="VEG">Veg Only</option>
                            <option value="NONVEG">Non-Veg Only</option>
                        </>
                    )}
                </select>
            </div>

            {/* Results Grid */}
            <div style={gridStyle}>
                {filteredListings.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                        <h3>No listings found matching your criteria.</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    filteredListings.map(item => (
                        <div key={item.ownerId} style={cardStyle} onClick={() => navigate(`/user/${type}/${item.ownerId}`)}>
                            <div style={imageWrapperStyle}>
                                <img
                                    src={item.imageUrl || (type === 'pg' ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500' : 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500')}
                                    alt={item.name}
                                    style={imageStyle}
                                />
                                <div style={badgeStyle}>
                                    {type === 'pg' ? item.pgType : item.messType}
                                </div>
                            </div>
                            <div style={cardContentStyle}>
                                <h3 style={cardTitleStyle}>{type === 'pg' ? item.pgName : item.messName}</h3>
                                <p style={addressStyle}>📍 {item.address}</p>
                                <div style={cardFooterStyle}>
                                    <button style={viewBtnStyle}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '80vh'
};

const headerStyle = {
    marginBottom: '40px',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '24px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(118, 75, 162, 0.2)'
};

const filterBarStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    marginTop: '-40px', // Overlap effect
    marginLeft: '20px',
    marginRight: '20px',
    position: 'relative'
};

const searchInputStyle = {
    flex: '1',
    minWidth: '250px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none'
};

const selectStyle = {
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: 'white',
    outline: 'none',
    minWidth: '150px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '30px'
};

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #f1f5f9'
};

const imageWrapperStyle = {
    position: 'relative',
    height: '240px'
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const badgeStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase'
};

const cardContentStyle = {
    padding: '25px'
};

const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px'
};

const addressStyle = {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '20px',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
};

const cardFooterStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px'
};



const viewBtnStyle = {
    background: '#764ba2',
    color: '#white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#764ba2',
    color: 'white'
};

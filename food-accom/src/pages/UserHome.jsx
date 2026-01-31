import React, { useEffect, useState } from 'react';
import { getAllOwners } from '../services/ownerService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Rating from '../components/Rating'; // We can use this to show avg rating if we had it in list api, but list api returns owner entity. 
// Ideally we need avg rating in owner list response. For now I'll just show styles.

export default function UserHome() {
  const [owners, setOwners] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PG, MESS
  const navigate = useNavigate();

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const res = await getAllOwners();
      setOwners(res.data);
    } catch (err) {
      console.error("Failed to load owners", err);
    }
  };

  const filteredOwners = owners.filter(o =>
    filter === 'ALL' ? true : o.ownerType === filter
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>

        {/* Hero / Filter Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1f2937' }}>Find Your Perfect Stay & Food</h1>
          <div style={{ display: 'inline-flex', background: '#fff', padding: '5px', borderRadius: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            {['ALL', 'PG', 'MESS'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  background: filter === type ? '#ff5200' : 'transparent',
                  color: filter === type ? '#fff' : '#666',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {type === 'ALL' ? 'All' : type === 'PG' ? 'PG / Hostels' : 'Mess / Food'}
              </button>
            ))}
          </div>
        </div>

        {/* Owners Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredOwners.map(owner => (
            <div
              key={owner.ownerId}
              onClick={() => navigate(`/owner-details/${owner.ownerId}`)}
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '140px', background: owner.ownerType === 'PG' ? '#3b82f6' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '40px' }}>
                {owner.ownerType === 'PG' ? '🏠' : '🍽️'}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ margin: '0 0 5px', color: '#111' }}>{owner.name}</h3>
                  <span style={{ fontSize: '12px', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{owner.ownerType}</span>
                </div>
                <p style={{ margin: '0 0 15px', color: '#666', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  📍 {owner.address}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                  <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '14px' }}>View Details</div>
                  {/* Placeholder for rating if available in list */}
                  <div style={{ color: '#f59e0b' }}>★★★★☆</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOwners.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            No owners found for this category.
          </div>
        )}

      </div>
    </div>
  );
}

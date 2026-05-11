import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function scoreColor(score) {
  if (score >= 7) return 'var(--green)';
  if (score >= 4) return 'var(--yellow)';
  return 'var(--red)';
}

const intensityEmoji = { mild: '😊', spicy: '🌶️', brutal: '💀' };

export default function RecentRoasts() {
  const [roasts, setRoasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/roast/recent')
      .then(res => setRoasts(res.data))
      .catch(() => {});
  }, []);

  if (roasts.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: 2, color: 'var(--text-muted)' }}>
          RECENTLY ROASTED
        </h2>
        <button
          className="btn btn-outline"
          style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          onClick={() => navigate('/history')}
        >
          View All →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {roasts.map(roast => (
          <div
            key={roast._id}
            className="card"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => navigate(`/results/${roast._id}`)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--fire)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{
                fontFamily: 'Bebas Neue', fontSize: '1.8rem',
                color: scoreColor(roast.score), lineHeight: 1,
              }}>
                {roast.score}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/10</span>
              </span>
              <span style={{ fontSize: '1rem' }}>{intensityEmoji[roast.intensity]}</span>
            </div>

            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {roast.title || 'Untitled'}
            </p>
            <p style={{ color: 'var(--fire)', fontFamily: 'Space Mono', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {roast.url?.replace(/^https?:\/\//, '').slice(0, 40)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
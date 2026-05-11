import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const intensityEmoji = { mild: '😊', spicy: '🌶️', brutal: '💀' };

function scoreColor(score) {
  if (score >= 7) return 'var(--green)';
  if (score >= 4) return 'var(--yellow)';
  return 'var(--red)';
}

export default function History() {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/roast/history')
      .then(res => setRoasts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', letterSpacing: 3, marginBottom: 8 }}>
            🔥 ROAST HISTORY
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.8rem' }}>
            All the sites that got burned
          </p>
        </div>

        {loading && (
          <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.85rem' }}>
            Loading history...
          </p>
        )}

        {!loading && roasts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', marginBottom: 24 }}>
              No roasts yet. Be the first victim.
            </p>
            <button className="btn btn-fire" onClick={() => navigate('/')}>Roast a Site 🔥</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roasts.map(roast => (
            <div
              key={roast._id}
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: 20, alignItems: 'flex-start' }}
              onClick={() => navigate(`/results/${roast._id}`)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--fire)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Score */}
              <div style={{
                minWidth: 56, height: 56,
                borderRadius: 10,
                background: 'var(--bg3)',
                border: `2px solid ${scoreColor(roast.score)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', color: scoreColor(roast.score), lineHeight: 1 }}>
                  {roast.score}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>/10</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                    {roast.title || 'Untitled Site'}
                  </span>
                  <span style={{ fontSize: '0.75rem' }}>{intensityEmoji[roast.intensity]}</span>
                </div>
                <p style={{ color: 'var(--fire)', fontFamily: 'Space Mono', fontSize: '0.75rem', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {roast.url?.replace(/^https?:\/\//, '').slice(0, 60)}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {roast.roast?.split('\n\n')[0]?.slice(0, 150)}...
                </p>
              </div>

              {/* Date */}
              <div style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.7rem', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                {new Date(roast.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RoastCard from '../components/RoastCard';
import SuggestionList from '../components/SuggestionList';
import ScoreBoard from '../components/ScoreBoard';

export default function Results() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state) {
      axios.get(`/api/roast/${id}`)
        .then(res => setData(res.data))
        .catch(() => setError('Roast not found.'))
        .finally(() => setLoading(false));
    }
  }, [id, location.state]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
      Loading roast...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <p style={{ color: 'var(--red)', fontFamily: 'Space Mono' }}>{error}</p>
      <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => navigate('/')}>← Back Home</button>
    </div>
  );

  if (!data) return null;

  const intensityEmoji = { mild: '😊', spicy: '🌶️', brutal: '💀' };

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button className="btn btn-outline" style={{ marginBottom: 24, fontSize: '0.8rem' }} onClick={() => navigate('/')}>
            ← Roast another site
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 2, marginBottom: 6 }}>
                {intensityEmoji[data.intensity] || '🔥'} THE ROAST IS SERVED
              </h1>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.8rem' }}>
                {data.title} &nbsp;·&nbsp;
                <a href={data.url} target="_blank" rel="noreferrer" style={{ color: 'var(--fire)', textDecoration: 'underline' }}>
                  {data.url.replace(/^https?:\/\//, '').slice(0, 50)}
                </a>
              </p>
            </div>
            <ShareButton roastData={data} />
          </div>
        </div>

        {/* Score Board */}
        {data.scores && <ScoreBoard score={data.score} scores={data.scores} />}

        {/* Roast */}
        <RoastCard roast={data.roast} intensity={data.intensity} />

        {/* Suggestions */}
        {data.suggestions?.length > 0 && <SuggestionList suggestions={data.suggestions} />}
      </div>
    </main>
  );
}

function ShareButton({ roastData }) {
  const handleShare = () => {
    const text = `🔥 My site got roasted by AI!\n\n"${roastData.roast.split('\n\n')[0].slice(0, 200)}..."\n\nScore: ${roastData.score}/10\nRoast yours: ${window.location.origin}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Roast copied to clipboard! 🔥');
    });
  };

  return (
    <button className="btn btn-outline" onClick={handleShare} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
      📋 Share Roast
    </button>
  );
}
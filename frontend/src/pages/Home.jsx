import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import RecentRoasts from '../components/RecentRoasts';

const LOADING_MESSAGES = [
  "Judging your font choices...",
  "Counting unnecessary divs...",
  "Asking why there's no dark mode...",
  "Inspecting your H1 with disappointment...",
  "Roasting your meta description...",
  "Calculating how many lorem ipsums survived...",
  "Checking if you actually wrote alt tags...",
  "Evaluating your CTA button creativity...",
  "Shaking head at your SEO...",
  "Preparing the roast... medium-well done.",
];

const INTENSITIES = [
  { value: 'mild', label: '😊 Mild', desc: 'Friendly & constructive' },
  { value: 'spicy', label: '🌶️ Spicy', desc: 'Sarcastic & witty' },
  { value: 'brutal', label: '💀 Brutal', desc: 'Absolutely savage' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [intensity, setIntensity] = useState('spicy');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingMsg(LOADING_MESSAGES[0]);
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleRoast = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);

    try {
      const { data } = await axios.post('/api/roast', { url: url.trim(), intensity });
      toast.success('Roast is ready! 🔥');
      navigate(`/results/${data.id}`, { state: data });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Is the URL reachable?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative' }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,69,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--fire)', letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' }}>
            AI-Powered Website Analysis
          </p>

          <h1 style={{
            fontFamily: 'Bebas Neue',
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            letterSpacing: 4,
            lineHeight: 1,
            marginBottom: 16,
            background: 'linear-gradient(135deg, #ff4500, #ff6b35, #ffd60a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ROAST MY SITE
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Paste your deployed URL and get a savage AI roast + actionable suggestions to make it actually good.
          </p>

          {/* Form */}
          <form onSubmit={handleRoast} style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Intensity selector */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
              {INTENSITIES.map((i) => (
                <button
                  key={i.value}
                  type="button"
                  onClick={() => setIntensity(i.value)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: intensity === i.value ? '1px solid var(--fire)' : '1px solid var(--border)',
                    background: intensity === i.value ? 'var(--fire-glow)' : 'var(--bg2)',
                    color: intensity === i.value ? 'var(--fire)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'Space Mono',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    minWidth: 100,
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{i.label}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{i.desc}</span>
                </button>
              ))}
            </div>

            {/* URL Input */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontFamily: 'Space Mono',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--fire)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <button type="submit" className="btn btn-fire" disabled={loading || !url.trim()}>
                {loading ? '🔥' : 'ROAST IT 🔥'}
              </button>
            </div>
          </form>

          {/* Loading state */}
          {loading && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--fire)',
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.85rem', transition: 'all 0.3s' }}>
                {loadingMsg}
              </p>
              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); opacity: 0.4; }
                  50% { transform: translateY(-8px); opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </div>
      </section>

      {/* Recent roasts */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <RecentRoasts />
        </div>
      </section>
    </main>
  );
}
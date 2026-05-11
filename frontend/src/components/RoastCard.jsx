import React, { useState } from 'react';

const intensityConfig = {
  mild: { emoji: '😊', label: 'MILD ROAST', color: 'var(--green)', bg: 'rgba(0,208,132,0.05)' },
  spicy: { emoji: '🌶️', label: 'SPICY ROAST', color: 'var(--fire2)', bg: 'rgba(255,107,53,0.05)' },
  brutal: { emoji: '💀', label: 'BRUTAL ROAST', color: 'var(--red)', bg: 'rgba(255,59,92,0.05)' },
};

export default function RoastCard({ roast, intensity = 'spicy' }) {
  const [copied, setCopied] = useState(false);
  const config = intensityConfig[intensity] || intensityConfig.spicy;
  const paragraphs = roast?.split('\n\n').filter(Boolean) || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.color}33`,
      borderRadius: 12,
      padding: 32,
      marginBottom: 32,
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>{config.emoji}</span>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: 3, color: config.color }}>
            {config.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-outline"
          style={{ fontSize: '0.75rem', padding: '6px 14px' }}
        >
          {copied ? '✅ Copied' : '📋 Copy'}
        </button>
      </div>

      {/* Roast text */}
      <div style={{ fontFamily: 'Space Mono', fontSize: '0.88rem', lineHeight: 1.9, color: 'var(--text)' }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ marginBottom: i < paragraphs.length - 1 ? 20 : 0 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Decorative quote mark */}
      <div style={{
        position: 'absolute', top: 20, right: 28,
        fontFamily: 'Bebas Neue', fontSize: '6rem',
        color: config.color, opacity: 0.06, lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none',
      }}>
        "
      </div>
    </div>
  );
}
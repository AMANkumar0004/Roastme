import React from 'react';

const CATEGORIES = [
  { key: 'design', label: 'Design', icon: '🎨' },
  { key: 'seo', label: 'SEO', icon: '🔍' },
  { key: 'ux', label: 'UX', icon: '🧭' },
  { key: 'performance', label: 'Performance', icon: '⚡' },
  { key: 'content', label: 'Content', icon: '✍️' },
];

function scoreColor(score) {
  if (score >= 7) return 'var(--green)';
  if (score >= 4) return 'var(--yellow)';
  return 'var(--red)';
}

function scoreLabel(score) {
  if (score >= 8) return 'Great';
  if (score >= 6) return 'Decent';
  if (score >= 4) return 'Meh';
  return 'Yikes';
}

export default function ScoreBoard({ score, scores }) {
  return (
    <div className="card" style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Overall score */}
        <div style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{
            fontFamily: 'Bebas Neue',
            fontSize: '4rem',
            lineHeight: 1,
            color: scoreColor(score),
            textShadow: `0 0 30px ${scoreColor(score)}`,
          }}>
            {score}
          </div>
          <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 10 OVERALL</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: scoreColor(score), letterSpacing: 1, marginTop: 4 }}>
            {scoreLabel(score)}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 80, background: 'var(--border)', flexShrink: 0 }} />

        {/* Category scores */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
          {CATEGORIES.map(cat => {
            const val = scores?.[cat.key] ?? 5;
            return (
              <div key={cat.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {cat.icon} {cat.label}
                  </span>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: scoreColor(val) }}>
                    {val}/10
                  </span>
                </div>
                {/* Bar */}
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${val * 10}%`,
                    background: scoreColor(val),
                    borderRadius: 4,
                    transition: 'width 0.6s ease',
                    boxShadow: `0 0 8px ${scoreColor(val)}`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
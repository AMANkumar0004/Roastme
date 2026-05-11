import React from 'react';

function getBadgeClass(category) {
  const map = {
    seo: 'badge-seo',
    ux: 'badge-ux',
    design: 'badge-design',
    performance: 'badge-performance',
    content: 'badge-content',
    accessibility: 'badge-accessibility',
  };
  return 'badge ' + (map[category?.toLowerCase()] || 'badge-content');
}

export default function SuggestionList({ suggestions }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 2 }}>
          💡 HOW TO FIX IT
        </h2>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {suggestions.length} suggestions
        </span>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {suggestions.map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {/* Number */}
            <div style={{
              minWidth: 36, height: 36,
              borderRadius: 8,
              background: 'var(--bg3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue', fontSize: '1.1rem',
              color: 'var(--fire)', flexShrink: 0,
            }}>
              {i + 1}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className={getBadgeClass(s.category)}>{s.category}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.issue}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--green)', fontFamily: 'Space Mono', fontSize: '0.75rem' }}>FIX → </span>
                {s.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
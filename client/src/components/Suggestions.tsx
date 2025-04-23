import React, { useState } from 'react';

interface Props {
  suggestions: string[];
  theme: "light" | "dark";
}

const Suggestions: React.FC<Props> = ({ suggestions, theme }) => {
  const [displayStyle, setDisplayStyle] = useState<"minimal" | "detailed" | "playful">("minimal");
  const [showSelector, setShowSelector] = useState(false);

  if (suggestions.length === 0) return null;

  const containerStyle = {
    marginTop: '2rem',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9',
    color: theme === 'dark' ? '#f9f9f9' : '#111',
    border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
    maxWidth: '700px',
    marginInline: 'auto',
  };

  const cardBase = {
    padding: '1rem 1.2rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
    color: theme === 'dark' ? '#fff' : '#111',
    boxShadow: theme === 'dark'
      ? '0 1px 3px rgba(255,255,255,0.06)'
      : '0 2px 6px rgba(0,0,0,0.05)',
  };

  const playfulCard = (index: number) => ({
    ...cardBase,
    backgroundColor: ["#fce4ec", "#e3f2fd", "#e8f5e9", "#fff8e1"][index % 4],
    color: "#333",
    borderLeft: `6px solid #b494e3`,
  });

  const renderCard = (item: string, index: number, style: any, subtitle?: string) => (
    <li key={index} style={style}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {subtitle && (
          <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '0.4rem' }}>
            {subtitle}
          </div>
        )}
        <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
          {displayStyle === 'playful' ? '✨' : '🌿'} {item}
        </div>
      </div>
    </li>
  );

  const renderList = (cardStyleFn: (i: number) => any, subtitle?: string) => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) =>
        renderCard(item, index, displayStyle === 'playful' ? cardStyleFn(index) : cardBase, subtitle)
      )}
    </ul>
  );

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
          {displayStyle === "minimal" && "🌿 Wellness Suggestions"}
          {displayStyle === "detailed" && "📋 Personalized Recommendations"}
          {displayStyle === "playful" && "🎉 Fun Self-Care Ideas"}
        </h2>

        <button
          onClick={() => setShowSelector(!showSelector)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#b494e3',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
        >
          {showSelector ? 'Hide View Options' : '⚙️ Customize View'}
        </button>

        {showSelector && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "0.75rem",
              flexWrap: 'wrap',
            }}
          >
            {(["minimal", "detailed", "playful"] as const).map((option) => {
              const isSelected = displayStyle === option;
              return (
                <label
                  key={option}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    border: `2px solid ${isSelected ? "#b494e3" : "#ccc"}`,
                    backgroundColor: isSelected ? "#f5eaff" : "#fff",
                    color: isSelected ? "#5e4b8b" : "#333",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(180, 148, 227, 0.25)"
                      : "none",
                  }}
                >
                  <input
                    type="radio"
                    name="viewStyle"
                    value={option}
                    checked={displayStyle === option}
                    onChange={() => setDisplayStyle(option)}
                    style={{ display: "none" }}
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {displayStyle === 'minimal' && renderList(() => cardBase)}
      {displayStyle === 'detailed' && renderList(() => cardBase, 'Suggested for your current mood • Tap to explore more')}
      {displayStyle === 'playful' && renderList(playfulCard)}
    </div>
  );
};

export default Suggestions;

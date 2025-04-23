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

  const listItemStyle = {
    padding: '0.75rem 1rem',
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
    color: theme === 'dark' ? '#ffffff' : '#111',
    borderRadius: '10px',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: theme === 'dark'
      ? '0 1px 4px rgba(255,255,255,0.05)'
      : '0 1px 4px rgba(0,0,0,0.05)',
  };

  const playfulStyle = (index: number) => ({
    ...listItemStyle,
    backgroundColor: ["#fce4ec", "#e3f2fd", "#e8f5e9", "#fff8e1"][index % 4],
    color: "#333",
    fontWeight: 600,
    fontSize: "1.05rem",
    borderLeft: `6px solid #b494e3`,
    animation: "fadeIn 0.3s ease-in-out",
  });

  const renderMinimal = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) => (
        <li key={index} style={listItemStyle}>
          🌿 {item}
        </li>
      ))}
    </ul>
  );

  const renderDetailed = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) => (
        <li key={index} style={listItemStyle}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{item}</div>
            <div style={{ fontSize: '0.85rem', color: theme === 'dark' ? '#bbb' : '#666' }}>
              Suggested for your current mood • Tap to explore more
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderPlayful = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) => (
        <li key={index} style={playfulStyle(index)}>
          ✨ {item}
        </li>
      ))}
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
            textDecoration: 'underline'
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

      {displayStyle === "minimal" && renderMinimal()}
      {displayStyle === "detailed" && renderDetailed()}
      {displayStyle === "playful" && renderPlayful()}
    </div>
  );
};

export default Suggestions;

import React from 'react';

interface Props {
  suggestions: string[];
  theme: "light" | "dark";
  displayStyle: "minimal" | "detailed" | "playful";
}

const Suggestions: React.FC<Props> = ({ suggestions, theme, displayStyle }) => {
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
      <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.4rem' }}>
        {displayStyle === "minimal" && "🌿 Wellness Suggestions"}
        {displayStyle === "detailed" && "📋 Personalized Recommendations"}
        {displayStyle === "playful" && "🎉 Fun Self-Care Ideas"}
      </h2>
      {displayStyle === "minimal" && renderMinimal()}
      {displayStyle === "detailed" && renderDetailed()}
      {displayStyle === "playful" && renderPlayful()}
    </div>
  );
};

export default Suggestions;

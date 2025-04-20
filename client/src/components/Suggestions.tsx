import React from 'react';

interface Props {
  suggestions: string[];
  theme: "light" | "dark";
}

const Suggestions: React.FC<Props> = ({ suggestions, theme }) => {
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
    boxShadow: theme === 'dark' ? '0 1px 4px rgba(255,255,255,0.05)' : '0 1px 4px rgba(0,0,0,0.05)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.4rem' }}>
        🧘 Wellness Suggestions
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {suggestions.map((item, index) => (
          <li key={index} style={listItemStyle}>
            🌿 {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;

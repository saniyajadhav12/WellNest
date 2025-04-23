import React, { useEffect, useState } from 'react';

interface Props {
  suggestions: string[];
  theme: "light" | "dark";
}

interface Feedback {
  favorite: boolean;
}

const Suggestions: React.FC<Props> = ({ suggestions, theme }) => {
  const [displayStyle, setDisplayStyle] = useState<"minimal" | "detailed" | "playful">("minimal");
  const [showSelector, setShowSelector] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<number, Feedback>>({});

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
  }, []);

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: #b494e3;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (suggestions.length === 0) return null;

  const toggleFavorite = (index: number) => {
    setFeedbacks((prev) => {
      const updated = {
        ...prev,
        [index]: {
          ...prev[index],
          favorite: !prev[index]?.favorite,
        },
      };
      localStorage.setItem("favorites", JSON.stringify(updated));
      showToast(updated[index].favorite ? "Added to Favorites ✅" : "Removed from Favorites ❌");
      return updated;
    });
  };

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  
      <button
        onClick={() => toggleFavorite(index)}
        title="Save to favorites"
        style={{
          fontSize: '1.3rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: feedbacks[index]?.favorite ? '#b494e3' : '#bbb',
          transition: 'transform 0.2s ease',
        }}
      >
        {feedbacks[index]?.favorite ? '❤️' : '🤍'}
      </button>
    </li>
  );
  
  const filteredSuggestions = showOnlyFavorites
    ? suggestions.filter((_, index) => feedbacks[index]?.favorite)
    : suggestions;

  const renderMinimal = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) => renderCard(item, index, cardBase))}
    </ul>
  );

  const renderDetailed = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {suggestions.map((item, index) =>
        renderCard(item, index, cardBase, "Suggested for your current mood • Tap to explore more")
      )}
    </ul>
  );

  const renderPlayful = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {filteredSuggestions.map((item, index) => renderCard(item, index, playfulCard(index)))}
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

        {/* Favorites toggle */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{
            marginTop: '1.25rem',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            border: '1px solid #b494e3',
            backgroundColor: showOnlyFavorites ? '#f5eaff' : '#fff',
            color: '#5e4b8b',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {showOnlyFavorites ? 'Show All Suggestions' : '⭐ View Favorites Only'}
        </button>
      </div>

      {displayStyle === "minimal" && renderMinimal()}
      {displayStyle === "detailed" && renderDetailed()}
      {displayStyle === "playful" && renderPlayful()}
    </div>
  );
};

export default Suggestions;

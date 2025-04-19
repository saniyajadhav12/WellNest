import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Suggestions from '../components/Suggestions';

const Home: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>WellNest – Self-Care Scheduler</h1>
      <InputForm onSuggestionsReceived={setSuggestions} />
      <Suggestions suggestions={suggestions} />
    </div>
  );
};

export default Home;

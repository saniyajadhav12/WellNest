import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Suggestions from '../components/Suggestions';
import PastSuggestions from '../components/PastSuggestions';

const Home: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>WellNest – Self-Care Scheduler</h1>
      <InputForm onSuggestionsReceived={setSuggestions} />
      <Suggestions suggestions={suggestions} />
      <PastSuggestions />
    </div>
  );
};

export default Home;

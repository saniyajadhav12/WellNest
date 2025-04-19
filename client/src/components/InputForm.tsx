import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onSuggestionsReceived: (suggestions: string[]) => void;
}

const InputForm: React.FC<Props> = ({ onSuggestionsReceived }) => {
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);

  type SuggestionResponse = {
    suggestions: string[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<SuggestionResponse>('http://localhost:8000/suggest', {
        mood,
        energy,
        time,
      });
      onSuggestionsReceived(res.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label>
        Mood:
        <select value={mood} onChange={(e) => setMood(e.target.value)} required>
          <option value="">Select mood</option>
          <option value="happy">Happy</option>
          <option value="tired">Tired</option>
          <option value="anxious">Anxious</option>
          <option value="sad">Sad</option>
        </select>
      </label>

      <label>
        Energy Level: {energy}
        <input
          type="range"
          min={1}
          max={10}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
        />
      </label>

      <label>
        Available Time (minutes):
        <input
          type="number"
          min={5}
          max={120}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          required
        />
      </label>

      <button type="submit">Get Suggestions</button>
    </form>
  );
};

export default InputForm;

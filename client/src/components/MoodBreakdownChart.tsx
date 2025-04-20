import React, { useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#d0ed57'];

type MoodData = {
  mood: string;
  count: number;
};

const MoodBreakdownChart: React.FC = () => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [useFiltered, setUseFiltered] = useState(false);
  const [mood, setMood] = useState('');
  const [date, setDate] = useState('');
  const [data, setData] = useState<MoodData[]>([]);

  const fetchData = async () => {
    try {
      const params: any = {};
      if (useFiltered) {
        if (mood) params.mood = mood;
        if (date) params.date = date;
      }

      const res = await axios.get<{ results: MoodData[] }>(
        'http://localhost:8000/mood-summary',
        { params }
      );
      setData(res.data.results);
    } catch (err) {
      console.error('Error fetching mood data', err);
    }
  };

  const hasOnlyOneMood = data.length === 1;

  return (
    <div
      style={{
        marginTop: '3rem',
        backgroundColor: '#fefeff',
        padding: '1.5rem',
        borderRadius: '12px',
        maxWidth: '600px',
        marginInline: 'auto',
        border: '1px solid #ddd',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>🧠 Mood Summary Settings</h2>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={useFiltered}
            onChange={() => setUseFiltered(!useFiltered)}
          />
          &nbsp;Use Filtered Data
        </label>

        <label>
          Chart Type:&nbsp;
          <select value={chartType} onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}>
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </label>
      </div>

      {useFiltered && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Mood filter"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          className="btn"
          onClick={fetchData}
        >
          Apply Filters
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>📉 Mood Breakdown</h2>

      {!data.length ? (
        <p style={{ textAlign: 'center' }}>No data to display.</p>
      ) : hasOnlyOneMood ? (
        <p style={{ textAlign: 'center' }}>Only one mood found — not enough variety for comparison.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="mood" cx="50%" cy="50%" outerRadius={90}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey="mood" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodBreakdownChart;

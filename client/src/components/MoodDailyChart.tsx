import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

type DailyMood = {
  date: string;
  mood: string;
  count: number;
};

const COLORS: Record<string, string> = {
  happy: '#82ca9d',
  sad: '#ff7f50',
  tired: '#8884d8',
  anxious: '#ffc658'
};

const MoodDailyChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ results: DailyMood[] }>('http://localhost:8000/mood-daily-summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const raw = res.data.results;

      // Transform into stacked format
      const grouped: Record<string, any> = {};
      raw.forEach(({ date, mood, count }) => {
        if (!grouped[date]) grouped[date] = { date };
        grouped[date][mood] = count;
      });

      const transformed = Object.values(grouped);
      setData(transformed);
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "3rem", maxWidth: "700px", marginInline: "auto" }}>
      <h2 style={{ textAlign: "center" }}>📊 Mood Trends (Past 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(COLORS).map((mood) => (
            <Bar key={mood} dataKey={mood} stackId="a" fill={COLORS[mood]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDailyChart;

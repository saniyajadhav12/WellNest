import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

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
};``

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: theme === 'dark' ? "#1e1e1e" : "#fff",
        border: `1px solid ${theme === 'dark' ? "#444" : "#ccc"}`,
        borderRadius: "12px",
        padding: "1rem",
        boxShadow:
          theme === 'dark'
            ? "0 0 10px rgba(0,0,0,0.4)"
            : "0 4px 10px rgba(0,0,0,0.1)",
        color: theme === 'dark' ? "#fff" : "#111",
        fontSize: "0.9rem",
        minWidth: "140px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "0.5rem",
          borderBottom: `1px solid ${theme === 'dark' ? "#555" : "#ddd"}`,
          paddingBottom: "4px",
        }}
      >
        {label}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: COLORS[entry.name],
              color: "#111",
              borderRadius: "20px",
              padding: "4px 10px",
              fontWeight: 600,
            }}
          >
            <span>{entry.name}</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
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
          <Tooltip content={<CustomTooltip />} />
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

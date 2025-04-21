import React, { useEffect, useState } from 'react';
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

type Props = {
  chartType: 'pie' | 'bar';
  date: string;
};

const MoodBreakdownChart: React.FC<Props> = ({ chartType, date }) => {
  const [data, setData] = useState<MoodData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get<{ results: MoodData[] }>('http://localhost:8000/mood-summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { date },
        });
        setData(res.data.results);
      } catch (err) {
        console.error('Error fetching chart data', err);
      }
    };

    if (date) fetchData();
  }, [chartType, date]);

  if (!data.length) {
    return <p style={{ textAlign: 'center', marginTop: '1rem' }}>No data to display.</p>;
  }

  if (data.length === 1) {
    return <p style={{ textAlign: 'center', marginTop: '1rem' }}>Only one mood found — not enough variety for comparison.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>📉 Mood Breakdown</h2>
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
    </div>
  );
};

export default MoodBreakdownChart;

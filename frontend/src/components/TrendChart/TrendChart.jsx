import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import './TrendChart.scss';

const TrendChart = ({ data, itemName, city }) => {
  return (
    <div className="trend-chart-container">
      <h3 className="chart-title">{itemName} - 7-Day Price Trend ({city})</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
          <XAxis 
            dataKey="date" 
            stroke="#cbd5e1"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            stroke="#cbd5e1"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Price (PKR)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(30, 41, 59, 0.95)', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc'
            }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend 
            wrapperStyle={{ color: '#cbd5e1' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Price (PKR)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;


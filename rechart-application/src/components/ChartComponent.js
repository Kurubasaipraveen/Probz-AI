import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { parseISO, format, addDays, startOfWeek, startOfMonth } from 'date-fns';

import data from './data.json';  // Import data directly
import './index.css'

const ChartComponent = () => {
  const [timeframe, setTimeframe] = useState('daily');

  const formatData = () => {
    switch (timeframe) {
      case 'weekly':
        return aggregateDataWeekly(data);
      case 'monthly':
        return aggregateDataMonthly(data);
      default:
        return data;
    }
  };

  const aggregateDataWeekly = (data) => {
    if (!data.length) return [];

    const result = [];
    let currentWeek = startOfWeek(parseISO(data[0].timestamp));
    let sum = 0;
    let count = 0;

    data.forEach(item => {
      const itemDate = parseISO(item.timestamp);
      if (itemDate < addDays(currentWeek, 7)) {
        sum += item.value;
        count++;
      } else {
        result.push({ timestamp: format(currentWeek, 'yyyy-MM-dd'), value: sum / count });
        currentWeek = startOfWeek(itemDate);
        sum = item.value;
        count = 1;
      }
    });

    if (count > 0) {
      result.push({ timestamp: format(currentWeek, 'yyyy-MM-dd'), value: sum / count });
    }

    console.log('Weekly aggregated data:', result); // Debugging: log aggregated weekly data
    return result;
  };

  const aggregateDataMonthly = (data) => {
    if (!data.length) return [];

    const result = [];
    let currentMonth = startOfMonth(parseISO(data[0].timestamp));
    let sum = 0;
    let count = 0;

    data.forEach(item => {
      const itemDate = parseISO(item.timestamp);
      if (itemDate < addDays(currentMonth, 30)) {
        sum += item.value;
        count++;
      } else {
        result.push({ timestamp: format(currentMonth, 'yyyy-MM-dd'), value: sum / count });
        currentMonth = startOfMonth(itemDate);
        sum = item.value;
        count = 1;
      }
    });

    if (count > 0) {
      result.push({ timestamp: format(currentMonth, 'yyyy-MM-dd'), value: sum / count });
    }

    console.log('Monthly aggregated data:', result); // Debugging: log aggregated monthly data
    return result;
  };

  return (
    <div>
      <div>
        <button onClick={() => setTimeframe('daily')}>Daily</button>
        <button onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')}>Monthly</button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formatData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;

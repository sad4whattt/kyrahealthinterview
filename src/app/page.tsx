'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, BarChart3, Users } from 'lucide-react';

interface RateData {
  StateCode: string;
  Age: number;
  IndividualRate: number;
  Tobacco: string;
  [key: string]: any;
}

interface ChartData {
  name: string;
  value: number;
  count?: number;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [data, setData] = useState<RateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedMetric, setSelectedMetric] = useState<'state' | 'age' | 'tobacco'>('state');

  useEffect(() => {
    Papa.parse('/rate-puf.csv', {
      download: true,
      header: true,
      complete: (results: { data: Record<string, string>[] }) => {
        const parsedData = results.data
          .map((row) => ({
            ...row,
            IndividualRate: parseFloat(row.IndividualRate),
            Age: parseInt(row.Age),
            StateCode: row.StateCode,
            Tobacco: row.Tobacco,
          }))
          .filter(
            (row: RateData) =>
              !isNaN(row.IndividualRate) &&
              row.IndividualRate > 0 &&
              row.Age >= 0 &&
              row.Age <= 100 &&
              row.StateCode
          );
        setData(parsedData);
        setLoading(false);
      },
    });
  }, []);

  const getChartData = (): ChartData[] => {
    if (data.length === 0) return [];

    switch (selectedMetric) {
      case 'state': {
        const stateData = data.reduce((acc: { [key: string]: { sum: number; count: number } }, row) => {
          if (!acc[row.StateCode]) {
            acc[row.StateCode] = { sum: 0, count: 0 };
          }
          acc[row.StateCode].sum += row.IndividualRate;
          acc[row.StateCode].count += 1;
          return acc;
        }, {});

        return Object.entries(stateData)
          .map(([state, { sum, count }]) => ({
            name: state,
            value: Math.round(sum / count),
            count,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      }
      case 'age': {
        const ageGroups = {
          '18-25': { sum: 0, count: 0 },
          '26-35': { sum: 0, count: 0 },
          '36-45': { sum: 0, count: 0 },
          '46-55': { sum: 0, count: 0 },
          '56-65': { sum: 0, count: 0 },
          '65+': { sum: 0, count: 0 },
        };

        data.forEach((row) => {
          const age = row.Age;
          let group: keyof typeof ageGroups;
          if (age <= 25) group = '18-25';
          else if (age <= 35) group = '26-35';
          else if (age <= 45) group = '36-45';
          else if (age <= 55) group = '46-55';
          else if (age <= 65) group = '56-65';
          else group = '65+';

          ageGroups[group].sum += row.IndividualRate;
          ageGroups[group].count += 1;
        });

        return Object.entries(ageGroups)
          .map(([group, { sum, count }]) => ({
            name: group,
            value: count > 0 ? Math.round(sum / count) : 0,
            count,
          }))
          .filter((item) => item.count > 0);
      }
      case 'tobacco': {
        const tobaccoData = data.reduce((acc: { [key: string]: { sum: number; count: number } }, row) => {
          const key = row.Tobacco || 'Unknown';
          if (!acc[key]) {
            acc[key] = { sum: 0, count: 0 };
          }
          acc[key].sum += row.IndividualRate;
          acc[key].count += 1;
          return acc;
        }, {});

        return Object.entries(tobaccoData)
          .map(([tobacco, { sum, count }]) => ({
            name: tobacco,
            value: Math.round(sum / count),
            count,
          }))
          .sort((a, b) => b.value - a.value);
      }
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const totalRecords = data.length;
  const avgRate = data.length > 0 ? Math.round(data.reduce((sum, row) => sum + row.IndividualRate, 0) / data.length) : 0;
  const uniqueStates = new Set(data.map((row) => row.StateCode)).size;

  const renderChart = () => {
    if (selectedChart === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData.slice(0, 6)}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.slice(0, 6).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value}`, 'Avg Rate']} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (selectedChart === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
              formatter={(value) => [`$${value}`, 'Avg Rate']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              name="Average Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB',
            }}
            formatter={(value) => [`$${value}`, 'Avg Rate']}
          />
          <Legend />
          <Bar dataKey="value" fill="#3B82F6" name="Average Rate" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading health insurance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Health Insurance Rate Analytics
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Interactive visualization of health insurance rates across states, age groups, and tobacco usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-white">{totalRecords.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Average Rate</p>
                <p className="text-3xl font-bold text-white">${avgRate}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">States Covered</p>
                <p className="text-3xl font-bold text-white">{uniqueStates}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-200 mb-2">Chart Type</label>
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value as 'bar' | 'line' | 'pie')}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-200 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'state' | 'age' | 'tobacco')}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="state">By State (Top 10)</option>
                <option value="age">By Age Group</option>
                <option value="tobacco">By Tobacco Usage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Average Insurance Rates {selectedMetric === 'state' ? 'by State' : selectedMetric === 'age' ? 'by Age Group' : 'by Tobacco Usage'}
          </h2>
          {renderChart()}
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-200">
            Built with Next.js, TypeScript, and Recharts • Data visualization proof of concept
          </p>
        </div>
      </div>
    </div>
  );
}

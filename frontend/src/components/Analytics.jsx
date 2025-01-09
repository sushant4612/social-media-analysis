import React, { useState } from 'react';
import { Line, Bar } from 'recharts';
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import data from '../assets/data.json';

const Analytics = () => {
  const [selectedType, setSelectedType] = useState('Reel');

  // Process the data for the last 3 months by post type
  const processData = () => {
    // Group data by month and post type
    const monthlyStats = data.reduce((acc, post) => {
      const date = new Date(post.PostDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const postType = post.PostType;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          Reel: { likes: 0, shares: 0, comments: 0, count: 0 },
          Static: { likes: 0, shares: 0, comments: 0, count: 0 },
          Carousel: { likes: 0, shares: 0, comments: 0, count: 0 }
        };
      }
      
      acc[monthYear][postType].likes += post.Likes;
      acc[monthYear][postType].shares += post.Shares;
      acc[monthYear][postType].comments += post.Comments;
      acc[monthYear][postType].count += 1;
      
      return acc;
    }, {});

    // Convert to array and calculate averages
    return Object.entries(monthlyStats)
      .map(([monthYear, data]) => ({
        month: new Date(monthYear).toLocaleString('default', { month: 'short' }),
        reelLikes: data.Reel.count ? Math.round(data.Reel.likes / data.Reel.count) : 0,
        reelShares: data.Reel.count ? Math.round(data.Reel.shares / data.Reel.count) : 0,
        reelComments: data.Reel.count ? Math.round(data.Reel.comments / data.Reel.count) : 0,
        staticLikes: data.Static.count ? Math.round(data.Static.likes / data.Static.count) : 0,
        staticShares: data.Static.count ? Math.round(data.Static.shares / data.Static.count) : 0,
        staticComments: data.Static.count ? Math.round(data.Static.comments / data.Static.count) : 0,
        carouselLikes: data.Carousel.count ? Math.round(data.Carousel.likes / data.Carousel.count) : 0,
        carouselShares: data.Carousel.count ? Math.round(data.Carousel.shares / data.Carousel.count) : 0,
        carouselComments: data.Carousel.count ? Math.round(data.Carousel.comments / data.Carousel.count) : 0
      }))
      .slice(-3); // Get last 3 months
  };

  const chartData = processData();

  const getDataKeys = (type) => {
    const typePrefix = type.toLowerCase();
    return {
      likes: `${typePrefix}Likes`,
      shares: `${typePrefix}Shares`,
      comments: `${typePrefix}Comments`
    };
  };

  const dataKeys = getDataKeys(selectedType);

  return (
    <div className="w-full h-full p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide text-center">
          CONTENT PERFORMANCE ANALYTICS
        </h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => setSelectedType('Reel')}
            className={`px-4 py-2 rounded ${selectedType === 'Reel' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Reels
          </button>
          <button 
            onClick={() => setSelectedType('Static')}
            className={`px-4 py-2 rounded ${selectedType === 'Static' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Static
          </button>
          <button 
            onClick={() => setSelectedType('Carousel')}
            className={`px-4 py-2 rounded ${selectedType === 'Carousel' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Carousel
          </button>
        </div>
      </div>

      <div className="grid grid-rows-2 gap-6 h-[calc(100%-4rem)]">
        <div className="w-full h-full">
          <h3 className="text-lg mb-2  font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Engagement Trends - {selectedType}</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              />
              <Legend />
              <Line type="monotone" dataKey={dataKeys.likes} stroke="#8884d8" name="Likes" />
              <Line type="monotone" dataKey={dataKeys.shares} stroke="#82ca9d" name="Shares" />
              <Line type="monotone" dataKey={dataKeys.comments} stroke="#ffc658" name="Comments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-full">
          <h3 className="text-lg mb-2 font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Engagement Comparison - {selectedType}</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              />
              <Legend />
              <Bar dataKey={dataKeys.likes} fill="#8884d8" name="Likes" />
              <Bar dataKey={dataKeys.shares} fill="#82ca9d" name="Shares" />
              <Bar dataKey={dataKeys.comments} fill="#ffc658" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
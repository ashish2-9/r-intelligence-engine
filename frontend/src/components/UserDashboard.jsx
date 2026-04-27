import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const UserDashboard = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/users/${userId}/dashboard`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch user stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Listen for custom event to refresh when a new decision is made
    window.addEventListener('decision_made', fetchStats);
    return () => window.removeEventListener('decision_made', fetchStats);
  }, [userId]);

  if (loading) return <div className="card animate-pulse h-32"></div>;
  if (!stats) return null;

  return (
    <div className="card bg-gray-900 text-white border-none shadow-lg relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCircle className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-300">Your Impact Profile</h3>
          </div>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md border border-gray-700">
            ID: {userId.split('-')[0]}...
          </span>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Sustainability Score</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white">{stats.sustainability_score.toFixed(1)}</span>
            <div className="flex items-center text-brand-green mb-1 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Top 20%</span>
            </div>
          </div>
        </div>

        {stats.behavioral_nudge && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3 mt-4">
            <AlertTriangle className="text-amber-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm font-medium leading-snug">
                Behavioral Insight
              </p>
              <p className="text-amber-100/70 text-xs mt-1 leading-relaxed">
                {stats.behavioral_nudge}
              </p>
            </div>
          </div>
        )}
        
        {!stats.behavioral_nudge && (
          <div className="bg-gray-800/50 rounded-lg p-3 mt-4 text-center border border-gray-700/50">
            <p className="text-gray-400 text-xs">
              Great job! You're making sustainable choices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { supabase, fetchLeaderboard } from '../services/supabaseService';
import { LeaderboardEntry, Difficulty } from '../types';
import { Trophy, User } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Difficulty>('simple');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when tab changes or generic real-time update
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const entries = await fetchLeaderboard(activeTab);
      setData(entries);
      setLoading(false);
    };

    loadData();

    // Real-time subscription
    const channel = supabase
      .channel('leaderboard_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_scores' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quiz_scores' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  return (
    <section id="leaderboard" className="py-20 bg-black/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Community Leaderboard</h2>
          <p className="text-gray-400">Top performers in the Raiku ecosystem.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {(['simple', 'hard', 'tough'] as Difficulty[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-raiku-primary text-white shadow-lg shadow-raiku-primary/25'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-raiku-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-xs font-bold uppercase text-gray-500 tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">User</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-right hidden sm:block">Date</div>
          </div>

          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading scores...</div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No scores yet. Be the first!</div>
            ) : (
              data.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-2 text-center flex justify-center">
                    {index === 0 ? <Trophy className="text-yellow-400" size={20} /> :
                     index === 1 ? <Trophy className="text-gray-300" size={20} /> :
                     index === 2 ? <Trophy className="text-amber-600" size={20} /> :
                     <span className="text-gray-500 font-mono">#{index + 1}</span>}
                  </div>
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-raiku-primary to-raiku-accent flex items-center justify-center text-xs font-bold">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{entry.username}</span>
                  </div>
                  <div className="col-span-2 text-right font-mono text-raiku-secondary font-bold">
                    {entry.score}
                  </div>
                  <div className="col-span-2 text-right text-xs text-gray-500 hidden sm:block">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
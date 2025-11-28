import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from '../types';

// NOTE: These should be in environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://xyz.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signInWithDiscord = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) console.error('Error logging in:', JSON.stringify(error, null, 2));
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const fetchLeaderboard = async (difficulty: string): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching leaderboard:', JSON.stringify(error, null, 2));
      return [];
    }
    return (data || []) as LeaderboardEntry[];
  } catch (err) {
    console.error('Unexpected error in fetchLeaderboard:', err);
    return [];
  }
};

export const saveScoreToDb = async (userId: string, username: string, difficulty: string, score: number) => {
  // Check if user has a higher score already
  const { data: existing, error: fetchError } = await supabase
    .from('quiz_scores')
    .select('score')
    .eq('user_id', userId)
    .eq('difficulty', difficulty)
    .single();

  // PGRST116: JSON object requested, multiple (or no) rows returned.
  // This is expected if it's the first time the user plays this difficulty.
  if (fetchError && fetchError.code !== 'PGRST116') {
     console.error('Error checking existing score:', JSON.stringify(fetchError, null, 2));
  }

  if (existing && existing.score >= score) {
    // Current score in DB is higher or equal, don't overwrite
    return;
  }

  // Upsert (Insert or Update)
  const { error } = await supabase
    .from('quiz_scores')
    .upsert(
      { 
        user_id: userId, 
        username, 
        difficulty, 
        score,
        created_at: new Date().toISOString()
      },
      { onConflict: 'user_id,difficulty' } 
    );

  if (error) console.error('Error saving score:', JSON.stringify(error, null, 2));
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
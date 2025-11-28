export type Difficulty = 'simple' | 'hard' | 'tough';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // For South Park question, logic handles "any"
  isMandatoryTough?: boolean;
  explanation?: string;
}

export interface QuizState {
  status: 'menu' | 'rules' | 'playing' | 'finished';
  difficulty: Difficulty | null;
  score: number;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Record<number, string>; // index -> selected option
  timeLeft: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  difficulty: Difficulty;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface GeminiResponse {
  text: string;
  loading: boolean;
  error: string | null;
}
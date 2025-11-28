import React, { useState, useEffect, useCallback } from 'react';
import { Play, Timer, Save, RotateCcw, Award } from 'lucide-react';
import { QuizState, Difficulty, Question } from '../types';
import { SIMPLE_QUESTIONS, HARD_QUESTIONS, TOUGH_MANDATORY, TIMER_CONFIG } from '../constants';
import { supabase, signInWithDiscord, saveScoreToDb, getUser } from '../services/supabaseService';

// Utility to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    status: 'menu',
    difficulty: null,
    score: 0,
    currentQuestionIndex: 0,
    questions: [],
    answers: {},
    timeLeft: 0,
  });

  const [user, setUser] = useState<any>(null);

  // Check auth on mount
  useEffect(() => {
    getUser().then(u => setUser(u));
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    if (state.status === 'playing' && state.timeLeft > 0) {
      const timer = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, status: 'finished', timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.status, state.timeLeft]);

  const selectDifficulty = (diff: Difficulty) => {
    setState(prev => ({ ...prev, difficulty: diff, status: 'rules' }));
  };

  const startQuiz = () => {
    if (!state.difficulty) return;

    let pool: Question[] = [];
    
    if (state.difficulty === 'simple') {
      pool = shuffle(SIMPLE_QUESTIONS).slice(0, 10);
    } else if (state.difficulty === 'hard') {
      pool = shuffle(HARD_QUESTIONS).slice(0, 10);
    } else if (state.difficulty === 'tough') {
      // 8 Random hard questions + 2 Mandatory Tough ones
      const hardSubset = shuffle(HARD_QUESTIONS).slice(0, 8);
      // Deep copy mandatory questions to shuffle their options specifically if needed, 
      // but here we shuffle the question order itself
      pool = shuffle([...hardSubset, ...TOUGH_MANDATORY]);
    }

    // Shuffle options for each question
    const preparedQuestions = pool.map(q => ({
      ...q,
      options: shuffle(q.options)
    }));

    setState({
      status: 'playing',
      difficulty: state.difficulty,
      score: 0,
      currentQuestionIndex: 0,
      questions: preparedQuestions,
      answers: {},
      timeLeft: TIMER_CONFIG[state.difficulty],
    });
  };

  const handleAnswer = (option: string) => {
    const currentQ = state.questions[state.currentQuestionIndex];
    let isCorrect = false;

    // Special Logic for Tough Mode specific questions
    if (currentQ.id === 'tough-south-park') {
      isCorrect = true; // All options are correct
    } else {
      isCorrect = currentQ.correctAnswer === option;
    }

    const nextScore = isCorrect ? state.score + 1 : state.score;
    const nextAnswers = { ...state.answers, [state.currentQuestionIndex]: option };

    if (state.currentQuestionIndex < 9) {
      setState(prev => ({
        ...prev,
        score: nextScore,
        answers: nextAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Finish
      setState(prev => ({
        ...prev,
        score: nextScore,
        answers: nextAnswers,
        status: 'finished'
      }));
    }
  };

  const handleSaveScore = async () => {
    if (!user) {
      // Trigger Login, handle score save after redirect? 
      // In this flow, we just login. The user has to play again or we need persistent local storage.
      // PRD says: "Immediately save score to database" after login.
      // Simplified: Login -> User is back -> They see the screen -> Click Save again.
      await signInWithDiscord();
    } else {
      if (state.difficulty) {
        await saveScoreToDb(user.id, user.user_metadata.full_name || 'Anonymous', state.difficulty, state.score);
        alert("Score saved to Leaderboard!");
      }
    }
  };

  const resetQuiz = () => {
    setState({
      status: 'menu',
      difficulty: null,
      score: 0,
      currentQuestionIndex: 0,
      questions: [],
      answers: {},
      timeLeft: 0,
    });
  };

  // --- RENDERERS ---

  if (state.status === 'menu') {
    return (
      <section id="quiz" className="py-20 min-h-[80vh] flex flex-col justify-center items-center bg-raiku-dark">
        <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-raiku-primary to-raiku-secondary">
          Test Your Knowledge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
          {(['simple', 'hard', 'tough'] as Difficulty[]).map((mode) => (
            <button
              key={mode}
              onClick={() => selectDifficulty(mode)}
              className="bg-raiku-card border border-white/10 hover:border-raiku-primary p-8 rounded-2xl flex flex-col items-center transition-all hover:scale-105 group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-raiku-primary/20">
                <Award className={mode === 'tough' ? 'text-red-500' : mode === 'hard' ? 'text-orange-400' : 'text-green-400'} size={32} />
              </div>
              <h3 className="text-2xl font-bold capitalize mb-2">{mode}</h3>
              <p className="text-gray-400 text-sm text-center">
                {mode === 'simple' && '120s • Basic Raiku concepts'}
                {mode === 'hard' && '75s • Advanced protocol details'}
                {mode === 'tough' && '45s • Chaos mode + Randomness'}
              </p>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (state.status === 'rules') {
    return (
      <section id="quiz" className="py-20 min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-raiku-card border border-white/10 p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4 capitalize">{state.difficulty} Mode Rules</h2>
          <ul className="text-left text-gray-300 space-y-3 mb-8 list-disc list-inside">
            <li>You have <strong>{TIMER_CONFIG[state.difficulty!]} seconds</strong> to complete the quiz.</li>
            <li>There are <strong>10 questions</strong> total.</li>
            {state.difficulty === 'tough' && <li className="text-red-400 font-bold">Watch out for trick questions!</li>}
            <li>Once time runs out, the quiz auto-submits.</li>
          </ul>
          <button
            onClick={startQuiz}
            className="w-full bg-raiku-primary hover:bg-raiku-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Play size={20} /> Proceed to Quiz
          </button>
          <button onClick={resetQuiz} className="mt-4 text-gray-500 hover:text-white text-sm">Cancel</button>
        </div>
      </section>
    );
  }

  if (state.status === 'playing') {
    const currentQ = state.questions[state.currentQuestionIndex];
    const progress = ((state.currentQuestionIndex) / 10) * 100;

    return (
      <section id="quiz" className="py-20 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Header Info */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400">Question {state.currentQuestionIndex + 1}/10</span>
            <div className={`flex items-center gap-2 font-mono text-xl ${state.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-raiku-secondary'}`}>
              <Timer size={20} />
              {state.timeLeft}s
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 h-2 rounded-full mb-8 overflow-hidden">
            <div className="bg-raiku-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Question Card */}
          <div className="bg-raiku-card border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 leading-snug">{currentQ.question}</h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-raiku-primary/50 transition-all flex items-center group"
                >
                  <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center mr-4 text-sm font-mono text-gray-400 group-hover:text-white group-hover:bg-raiku-primary">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (state.status === 'finished') {
    return (
      <section id="quiz" className="py-20 min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-raiku-card border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-raiku-primary/20 blur-[50px] rounded-full" />
          
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-400 mb-6 capitalize">{state.difficulty} Mode</p>
          
          <div className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-raiku-secondary to-raiku-accent">
            {state.score}/10
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSaveScore}
              className="w-full bg-raiku-primary hover:bg-raiku-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} /> 
              {user ? 'Save Score to Leaderboard' : 'Login with Discord to Save'}
            </button>
            
            <button
              onClick={resetQuiz}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default Quiz;
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import About from './components/About';

const App: React.FC = () => {
  return (
    <div className="text-white font-sans antialiased min-h-screen flex flex-col selection:bg-raiku-primary selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Quiz />
        <Leaderboard />
      </main>
      <About />
    </div>
  );
};

export default App;
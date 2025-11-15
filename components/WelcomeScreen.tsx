
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50 dark:bg-slate-800">
      <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-6">
        <SparklesIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">AI-Powered Sales Training</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs">
        Hone your skills with realistic scenarios, practice your pitch, and get instant AI feedback.
      </p>
      <button
        onClick={onStart}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
      >
        Start Training
      </button>
    </div>
  );
};

export default WelcomeScreen;

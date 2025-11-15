
import React from 'react';
import { TrainingScenario } from '../types';

interface FeedbackScreenProps {
  scenario: TrainingScenario;
  userAnswer: string;
  feedback: string;
  onNext: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ scenario, userAnswer, feedback, onNext }) => {
    
    function formatFeedback(text: string) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-slate-100">$1</strong>')
            .replace(/\n/g, '<br />')
            .replace(/\* (.*?)(?=<br \/>|$)/g, '<li class="ml-4 list-disc">$1</li>');
    }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">SCENARIO QUESTION</p>
          <p className="text-slate-700 dark:text-slate-300 italic">"{scenario.question}"</p>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">YOUR RESPONSE</p>
          <p className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">{userAnswer}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">AI FEEDBACK</p>
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: formatFeedback(feedback) }}
          />
        </div>
      </div>
      <footer className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm">
        <button
          onClick={onNext}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Next Question
        </button>
      </footer>
    </div>
  );
};

export default FeedbackScreen;

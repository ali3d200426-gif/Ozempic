
import React, { useState } from 'react';
import { TrainingScenario } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import { PlayIcon } from './icons/PlayIcon';

interface TrainingScreenProps {
  scenario: TrainingScenario;
  onSubmit: (answer: string) => void;
}

const TrainingScreen: React.FC<TrainingScreenProps> = ({ scenario, onSubmit }) => {
  const [answerText, setAnswerText] = useState('');
  const { isRecording, audioURL, startRecording, stopRecording, resetRecording, error } = useAudioRecorder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerText.trim()) {
      onSubmit(answerText);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      resetRecording();
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <img src={scenario.imageUrl} alt="Training Scenario" className="w-full h-48 object-cover" />
        <div className="p-4">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">DOCTOR'S QUESTION</p>
          <p className="text-slate-800 dark:text-slate-200 font-medium">{scenario.question}</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <label htmlFor="answer" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          YOUR RESPONSE
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
            Practice your pitch out loud, then summarize it below for AI feedback.
        </p>
        <textarea
          id="answer"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Enter the key points of your verbal response here..."
          className="w-full h-32 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {audioURL && (
            <div className="mt-2">
                <audio src={audioURL} controls className="w-full" />
            </div>
        )}
         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <footer className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleRecording}
            className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRecording ? <StopIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-8 h-8 text-white" />}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!answerText.trim()}
            className="w-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
          >
            Submit for Feedback
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TrainingScreen;

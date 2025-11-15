
import React, { useState, useCallback } from 'react';
import { AppState, TrainingScenario } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import TrainingScreen from './components/TrainingScreen';
import FeedbackScreen from './components/FeedbackScreen';
import LoadingOverlay from './components/LoadingOverlay';
import { generateTrainingScenario, getFeedbackOnAnswer } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [scenario, setScenario] = useState<TrainingScenario | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadScenario = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Generating new training scenario...');
    setError(null);
    try {
      const newScenario = await generateTrainingScenario();
      setScenario(newScenario);
      setAppState(AppState.TRAINING);
    } catch (err) {
      console.error(err);
      setError('Failed to generate a training scenario. Please try again.');
      setAppState(AppState.WELCOME);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartTraining = () => {
    loadScenario();
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!scenario) return;
    setUserAnswer(answer);
    setIsLoading(true);
    setLoadingMessage('Analyzing your response and crafting feedback...');
    setError(null);
    try {
      const newFeedback = await getFeedbackOnAnswer(scenario.question, answer);
      setFeedback(newFeedback);
      setAppState(AppState.FEEDBACK);
    } catch (err) {
      console.error(err);
      setError('Failed to get feedback. Please try again.');
      setAppState(AppState.TRAINING);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    loadScenario();
  };
  
  const handleTryAgain = () => {
    setError(null);
    if(appState === AppState.WELCOME) {
        handleStartTraining();
    } else {
        loadScenario();
    }
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleTryAgain}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (appState) {
      case AppState.TRAINING:
        return scenario && <TrainingScreen scenario={scenario} onSubmit={handleAnswerSubmit} />;
      case AppState.FEEDBACK:
        return scenario && <FeedbackScreen scenario={scenario} userAnswer={userAnswer} feedback={feedback} onNext={handleNextQuestion} />;
      case AppState.WELCOME:
      default:
        return <WelcomeScreen onStart={handleStartTraining} />;
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center font-sans">
      <div className="relative w-full max-w-md h-full md:h-[90vh] md:max-h-[800px] bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden flex flex-col">
        <header className="flex items-center justify-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <SparklesIcon className="w-6 h-6 text-indigo-500 mr-2" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Ozempic AI Sales Trainer</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          {isLoading && <LoadingOverlay message={loadingMessage} />}
          {!isLoading && renderContent()}
        </main>
      </div>
    </div>
  );
}

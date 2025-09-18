import React, { useState } from 'react';
import { StudyModeSelector } from '@/components/study/StudyModeSelector';
import { StudySession } from '@/components/study/StudySession';
import { StudyResults } from '@/components/study/StudyResults';
import { sampleQuestions } from '@/data/sampleQuestions';
import { StudyProgress } from '@/types/study';

type AppState = 'menu' | 'studying' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('menu');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | null>(null);
  const [studyResults, setStudyResults] = useState<StudyProgress | null>(null);

  const handleModeSelect = (mode: 'flashcard' | 'quiz') => {
    setStudyMode(mode);
    setAppState('studying');
  };

  const handleStudyComplete = (progress: StudyProgress) => {
    setStudyResults(progress);
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('studying');
  };

  const handleBackToMenu = () => {
    setAppState('menu');
    setStudyMode(null);
    setStudyResults(null);
  };

  const handleNewMode = () => {
    const newMode = studyMode === 'flashcard' ? 'quiz' : 'flashcard';
    setStudyMode(newMode);
    setAppState('studying');
  };

  if (appState === 'menu') {
    return (
      <StudyModeSelector
        onModeSelect={handleModeSelect}
        totalQuestions={sampleQuestions.length}
      />
    );
  }

  if (appState === 'studying' && studyMode) {
    return (
      <StudySession
        questions={sampleQuestions}
        mode={studyMode}
        onBack={handleBackToMenu}
        onComplete={handleStudyComplete}
      />
    );
  }

  if (appState === 'results' && studyResults && studyMode) {
    return (
      <StudyResults
        progress={studyResults}
        mode={studyMode}
        onRestart={handleRestart}
        onBack={handleBackToMenu}
        onNewMode={handleNewMode}
      />
    );
  }

  return null;
};

export default Index;

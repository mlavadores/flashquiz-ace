import React, { useState } from 'react';
import { StudyModeSelector } from '@/components/study/StudyModeSelector';
import { StudySession } from '@/components/study/StudySession';
import { StudyResults } from '@/components/study/StudyResults';
import { loadQuestions, sampleQuestions } from '@/data/sampleQuestions';
import { StudyProgress, Question } from '@/types/study';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AppState = 'menu' | 'studying' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('menu');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | null>(null);
  const [studyResults, setStudyResults] = useState<StudyProgress | null>(null);
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const loadAllQuestions = async () => {
      setIsLoading(true);
      try {
        const loadedQuestions = await loadQuestions();
        if (loadedQuestions && loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
        } else {
          console.warn('No questions loaded, using sample questions');
          setQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        setQuestions(sampleQuestions);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllQuestions();
  }, []);

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
        totalQuestions={questions.length}
        isLoading={isLoading}
      />
    );
  }

  if (appState === 'studying' && studyMode) {
    if (questions.length === 0) {
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBackToMenu} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
            </div>
            <div className="flex items-center justify-center h-64">
              <p className="text-lg text-muted-foreground">No questions available. Please try again.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <StudySession
        questions={questions}
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

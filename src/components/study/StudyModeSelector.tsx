import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Trophy, BookOpen, Target, Play } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { progressStorage } from '@/services/progressStorage';

interface StudyModeSelectorProps {
  onModeSelect: (mode: 'flashcard' | 'quiz') => void;
  totalQuestions: number;
  isLoading?: boolean;
}

export const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({
  onModeSelect,
  totalQuestions,
  isLoading = false
}) => {
  const [savedProgress, setSavedProgress] = useState<any>(null);

  useEffect(() => {
    const progress = progressStorage.load();
    if (progress && progress.totalQuestions === totalQuestions) {
      setSavedProgress(progress);
    }
  }, [totalQuestions]);

  const handleContinue = () => {
    if (savedProgress) {
      onModeSelect(savedProgress.mode);
    }
  };

  const handleNewSession = (mode: 'flashcard' | 'quiz') => {
    progressStorage.clear();
    onModeSelect(mode);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            SAP-C02 Study Tool
          </h1>
          <p className="text-xl text-muted-foreground">
            Master AWS Solutions Architect Professional certification with {totalQuestions} questions
          </p>
        </div>

        {savedProgress && (
          <Card className="bg-gradient-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Play className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Continue Previous Session</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {savedProgress.mode === 'flashcard' ? 'Flashcard' : 'Quiz'} mode • Question {savedProgress.currentIndex + 1} of {savedProgress.totalQuestions}
                {savedProgress.mode === 'quiz' && ` • ${savedProgress.progress.correctAnswers}/${savedProgress.progress.answeredQuestions} correct`}
              </p>
              <Button variant="hero" onClick={handleContinue}>
                Continue Session
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit group-hover:scale-110 transition-bounce">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Flashcard Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center leading-relaxed">
                Review questions and answers at your own pace. Perfect for memorization and initial learning.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Focus on understanding</span>
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-6"
                onClick={() => handleNewSession('flashcard')}
              >
                Start Studying
              </Button>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-secondary rounded-full w-fit group-hover:scale-110 transition-bounce">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Quiz Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center leading-relaxed">
                Test your knowledge with multiple choice questions. Track your progress and accuracy.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Multiple choice format</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Performance tracking</span>
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-6"
                onClick={() => handleNewSession('quiz')}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block bg-muted/50 border-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Start with flashcards to learn, then use quiz mode to test yourself!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
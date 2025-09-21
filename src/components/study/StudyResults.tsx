import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, RefreshCw, ArrowLeft, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { StudyProgress } from '@/types/study';

interface StudyResultsProps {
  progress: StudyProgress;
  mode: 'flashcard' | 'quiz';
  onRestart: () => void;
  onBack: () => void;
  onNewMode: () => void;
}

export const StudyResults: React.FC<StudyResultsProps> = ({
  progress,
  mode,
  onRestart,
  onBack,
  onNewMode
}) => {
  const timeInMinutes = Math.round(progress.timeSpent / 60000);
  const timeInSeconds = Math.round((progress.timeSpent % 60000) / 1000);
  
  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { grade: 'A+', color: 'text-study-success', message: 'Outstanding!' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-study-success', message: 'Excellent!' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-study-secondary', message: 'Good job!' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-study-warning', message: 'Keep practicing!' };
    return { grade: 'D', color: 'text-study-error', message: 'Need more study!' };
  };

  const gradeInfo = getGrade(progress.accuracy);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-gradient-primary rounded-full w-fit">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {mode === 'flashcard' ? 'Study Session Complete!' : 'Quiz Completed!'}
          </h1>
          <p className="text-muted-foreground">
            Great job! Here's how you performed:
          </p>
        </div>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-foreground">
              Your Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === 'quiz' && (
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {gradeInfo.message}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium text-foreground">{Math.round(progress.accuracy)}%</span>
                  </div>
                  <Progress value={progress.accuracy} className="h-3" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="p-3 bg-study-primary/10 rounded-full mx-auto w-fit">
                  <Target className="h-6 w-6 text-study-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {progress.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Questions
                </div>
              </div>

              {mode === 'quiz' && (
                <>
                  <div className="text-center space-y-2">
                    <div className="p-3 bg-study-success/10 rounded-full mx-auto w-fit">
                      <Star className="h-6 w-6 text-study-success" />
                    </div>
                    <div className="text-2xl font-bold text-study-success">
                      {progress.correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Correct
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="p-3 bg-study-error/10 rounded-full mx-auto w-fit">
                      <Target className="h-6 w-6 text-study-error" />
                    </div>
                    <div className="text-2xl font-bold text-study-error">
                      {progress.incorrectAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Incorrect
                    </div>
                  </div>
                </>
              )}

              <div className="text-center space-y-2">
                <div className="p-3 bg-study-secondary/10 rounded-full mx-auto w-fit">
                  <Clock className="h-6 w-6 text-study-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {timeInMinutes > 0 ? `${timeInMinutes}m` : `${timeInSeconds}s`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Time Spent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button variant="hero" className="w-full gap-2" onClick={onRestart}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onNewMode}>
              {mode === 'flashcard' ? 'Try Quiz Mode' : 'Try Flashcards'}
            </Button>
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Card className="inline-block bg-muted/50 border-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                🎉 <strong>Ready for your 528 questions?</strong> Upload your file to get started!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Brain, Trophy } from 'lucide-react';
import { StudyProgress } from '@/types/study';

interface ProgressBarProps {
  progress: StudyProgress;
  currentQuestion: number;
  totalQuestions: number;
  mode: 'flashcard' | 'quiz';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
  mode
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const accuracy = progress.answeredQuestions > 0 ? (progress.correctAnswers / progress.answeredQuestions) * 100 : 0;

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === 'flashcard' ? (
                <Brain className="h-5 w-5 text-study-primary" />
              ) : (
                <Trophy className="h-5 w-5 text-study-secondary" />
              )}
              <span className="font-semibold text-foreground">
                {mode === 'flashcard' ? 'Study Mode' : 'Quiz Mode'}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion} of {totalQuestions}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {mode === 'quiz' && progress.answeredQuestions > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-study-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{progress.correctAnswers}</span>
                </div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-study-error">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{progress.incorrectAnswers}</span>
                </div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">{Math.round(accuracy)}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Brain, Trophy, ArrowRight } from 'lucide-react';
import { StudyProgress } from '@/types/study';

interface ProgressBarProps {
  progress: StudyProgress;
  currentQuestion: number;
  totalQuestions: number;
  mode: 'flashcard' | 'quiz';
  onGoToQuestion?: (questionNumber: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
  mode,
  onGoToQuestion
}) => {
  const [jumpToQuestion, setJumpToQuestion] = useState('');
  
  const handleJumpToQuestion = () => {
    const questionNum = parseInt(jumpToQuestion);
    if (questionNum >= 1 && questionNum <= totalQuestions && onGoToQuestion) {
      onGoToQuestion(questionNum);
      setJumpToQuestion('');
    }
  };
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentQuestion} of {totalQuestions}
              </span>
              {onGoToQuestion && (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Go to #"
                    value={jumpToQuestion}
                    onChange={(e) => setJumpToQuestion(e.target.value)}
                    className="w-20 h-7 text-xs"
                    min={1}
                    max={totalQuestions}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleJumpToQuestion}
                    className="h-7 px-2"
                    disabled={!jumpToQuestion || parseInt(jumpToQuestion) < 1 || parseInt(jumpToQuestion) > totalQuestions}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
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
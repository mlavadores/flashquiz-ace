import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FlashCard } from './FlashCard';
import { QuizCard } from './QuizCard';
import { ProgressBar } from './ProgressBar';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Question, StudyProgress } from '@/types/study';

interface StudySessionProps {
  questions: Question[];
  mode: 'flashcard' | 'quiz';
  onBack: () => void;
  onComplete: (progress: StudyProgress) => void;
}

export const StudySession: React.FC<StudySessionProps> = ({
  questions,
  mode,
  onBack,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<StudyProgress>({
    totalQuestions: questions.length,
    answeredQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    accuracy: 0,
    timeSpent: 0
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      const finalProgress = {
        ...progress,
        timeSpent: Date.now() - startTime
      };
      onComplete(finalProgress);
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setShowAnswer(false);
    setSelectedAnswer(null);
  }, [currentIndex, isLastQuestion, progress, onComplete, startTime]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  }, [currentIndex]);

  const handleQuizAnswer = useCallback((answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    
    const newProgress = {
      ...progress,
      answeredQuestions: progress.answeredQuestions + 1,
      correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: progress.incorrectAnswers + (isCorrect ? 0 : 1),
    };
    
    newProgress.accuracy = (newProgress.correctAnswers / newProgress.answeredQuestions) * 100;
    setProgress(newProgress);

    setTimeout(() => {
      handleNext();
    }, 2000);
  }, [progress, handleNext]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setProgress({
      totalQuestions: questions.length,
      answeredQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 0,
      timeSpent: 0
    });
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
          <Button variant="ghost" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
        </div>

        <ProgressBar
          progress={progress}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          mode={mode}
        />

        <div className="animate-slide-in">
          {mode === 'flashcard' ? (
            <FlashCard
              question={currentQuestion}
              onNext={handleNext}
              onPrevious={handlePrevious}
              showNavigation={false}
            />
          ) : (
            <QuizCard
              question={currentQuestion}
              onAnswer={handleQuizAnswer}
              selectedAnswer={selectedAnswer}
            />
          )}
        </div>

        {mode === 'flashcard' && (
          <div className="flex justify-center">
            <Card className="bg-muted/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Use the card or buttons to navigate
                  </span>
                  <Button variant="study" onClick={handleNext}>
                    {isLastQuestion ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
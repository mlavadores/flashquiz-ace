import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Question } from '@/types/study';
import { cn } from '@/lib/utils';

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onPrevious: () => void;
  showNavigation?: boolean;
  className?: string;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  question,
  onNext,
  onPrevious,
  showNavigation = true,
  className
}) => {
  const [currentView, setCurrentView] = useState<'question' | 'answer' | 'explanation'>('question');
  const [isAnimating, setIsAnimating] = useState(false);

  if (!question) {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <Card className="relative h-80 bg-gradient-card border-0 shadow-card">
          <CardContent className="flex items-center justify-center h-full p-8 text-center">
            <p className="text-lg text-muted-foreground">Loading question...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (currentView === 'question') {
        setCurrentView('answer');
      } else if (currentView === 'answer') {
        setCurrentView('explanation');
      } else {
        setCurrentView('question');
        onNext();
      }
      setIsAnimating(false);
    }, 150);
  };

  const handlePrevious = () => {
    setCurrentView('question');
    onPrevious();
  };

  const getCorrectAnswers = () => {
    if (!question?.answer) return [];
    if (Array.isArray(question.answer)) {
      return question.answer;
    }
    return [question.answer];
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <Card 
        className={cn(
          "relative min-h-96 cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-smooth",
          isAnimating && "animate-flip"
        )}
        onClick={handleNext}
      >
        <CardContent className="flex items-center justify-center min-h-96 p-8 text-center relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {currentView === 'question' ? '1/3' : currentView === 'answer' ? '2/3' : '3/3'}
            </span>
            {currentView === 'question' ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : currentView === 'answer' ? (
              <Eye className="h-5 w-5 text-study-success" />
            ) : (
              <Eye className="h-5 w-5 text-study-primary" />
            )}
          </div>
          
          <div className="w-full">
            {currentView === 'question' && (
              <div className="space-y-4 w-full max-w-2xl">
                <div className="text-sm text-muted-foreground font-medium">
                  Question
                </div>
                <p className="text-base font-semibold leading-relaxed text-foreground text-justify">
                  {question.question}
                </p>
                <div className="text-sm text-muted-foreground mt-4">
                  Click Next to see answers
                </div>
              </div>
            )}}
            
            {currentView === 'answer' && (
              <div className="space-y-4 w-full max-w-2xl">
                <div className="text-sm text-study-secondary font-medium">
                  Answer Choices
                </div>
                <div className="space-y-2">
                  {question.choices?.map((choice, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const isCorrect = getCorrectAnswers().includes(letter);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border text-left text-sm",
                          isCorrect 
                            ? "bg-study-success/10 border-study-success text-study-success" 
                            : "bg-muted border-border"
                        )}
                      >
                        <span className="font-medium">{letter}. </span>
                        {choice}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Click Next for explanation
                </div>
              </div>
            )}}
            
            {currentView === 'explanation' && (
              <div className="space-y-4 w-full max-w-2xl">
                <div className="text-sm text-study-primary font-medium">
                  Explanation
                </div>
                <p className="text-sm leading-relaxed text-foreground text-left">
                  {question.explanation || 'No explanation available.'}
                </p>
                <div className="text-sm text-muted-foreground mt-4">
                  Click Next for next question
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showNavigation && (
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            {question.category && (
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                {question.category}
              </span>
            )}
          </div>
          <Button variant="study" onClick={handleNext}>
            {currentView === 'explanation' ? 'Next Question' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
};
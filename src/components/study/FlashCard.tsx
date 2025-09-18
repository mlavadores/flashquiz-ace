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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setIsAnimating(false);
    }, 150);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card 
        className={cn(
          "relative h-80 cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-smooth",
          isAnimating && "animate-flip"
        )}
        onClick={handleFlip}
      >
        <CardContent className="flex items-center justify-center h-full p-8 text-center relative">
          <div className="absolute top-4 right-4">
            {isFlipped ? (
              <Eye className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="w-full">
            {!isFlipped ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-medium">
                  Question
                </div>
                <p className="text-xl font-semibold leading-relaxed text-foreground">
                  {question.question}
                </p>
                <div className="text-sm text-muted-foreground mt-6">
                  Click to reveal answer
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-study-secondary font-medium">
                  Answer
                </div>
                <p className="text-xl font-semibold leading-relaxed text-study-primary">
                  {question.answer}
                </p>
                <div className="text-sm text-muted-foreground mt-6">
                  Click to see question
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
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
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
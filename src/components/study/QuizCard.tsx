import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Question } from '@/types/study';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  question: Question;
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  showResult?: boolean;
  selectedAnswer?: string;
  className?: string;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  showResult = false,
  selectedAnswer,
  className
}) => {
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState<string | null>(selectedAnswer || null);

  const handleAnswerSelect = (choice: string) => {
    if (showResult) return;
    
    setCurrentSelectedAnswer(choice);
    const isCorrect = choice === question.answer;
    
    setTimeout(() => {
      onAnswer(choice, isCorrect);
    }, 1000);
  };

  const getChoiceStatus = (choice: string) => {
    if (!currentSelectedAnswer) return 'default';
    
    if (choice === question.answer) return 'correct';
    if (choice === currentSelectedAnswer && choice !== question.answer) return 'incorrect';
    return 'disabled';
  };

  const getChoiceVariant = (status: string) => {
    switch (status) {
      case 'correct': return 'success';
      case 'incorrect': return 'error';
      case 'disabled': return 'outline';
      default: return 'quiz';
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 text-study-primary" />
            Quiz Mode
          </CardTitle>
          {question.category && (
            <div className="text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-secondary rounded-full">
                {question.category}
              </span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold leading-relaxed text-foreground">
              {question.question}
            </p>
          </div>

          <div className="space-y-3">
            {question.choices?.map((choice, index) => {
              const status = getChoiceStatus(choice);
              const variant = getChoiceVariant(status);
              
              return (
                <Button
                  key={index}
                  variant={variant}
                  className={cn(
                    "w-full justify-start p-4 h-auto text-left relative",
                    currentSelectedAnswer && "transition-smooth"
                  )}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={currentSelectedAnswer !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{choice}</span>
                    {currentSelectedAnswer && (
                      <div className="flex-shrink-0">
                        {status === 'correct' && <CheckCircle className="h-5 w-5 text-study-success" />}
                        {status === 'incorrect' && <XCircle className="h-5 w-5 text-study-error" />}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {currentSelectedAnswer && (
            <div className="text-center pt-4 border-t">
              <div className={cn(
                "text-sm font-medium animate-slide-in",
                currentSelectedAnswer === question.answer ? "text-study-success" : "text-study-error"
              )}>
                {currentSelectedAnswer === question.answer ? (
                  "Correct! Well done!"
                ) : (
                  `Incorrect. The correct answer is: ${question.answer}`
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
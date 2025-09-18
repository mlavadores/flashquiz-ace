import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Question } from '@/types/study';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
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
  const [currentView, setCurrentView] = useState<'question' | 'result' | 'explanation'>('question');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  // Reset state when question changes
  useEffect(() => {
    setCurrentView('question');
    setHasAnswered(false);
    setSelectedAnswers([]);
    setCurrentSelectedAnswer(null);
  }, [question?.id]);

  if (!question) {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-center h-32">
              <p className="text-lg text-muted-foreground">Loading question...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswerSelect = (choice: string) => {
    if (hasAnswered) return;
    
    const correctAnswers = getCorrectAnswers();
    
    // For single answer questions
    if (correctAnswers.length === 1) {
      setCurrentSelectedAnswer(choice);
      setSelectedAnswers([choice]);
      setHasAnswered(true);
      setCurrentView('result');
      
      const isCorrect = correctAnswers.includes(choice);
      
      setTimeout(() => {
        onAnswer(isCorrect, choice);
      }, 1500);
    } else {
      // For multiple answer questions, allow multiple selections
      const newSelectedAnswers = selectedAnswers.includes(choice)
        ? selectedAnswers.filter(a => a !== choice)
        : [...selectedAnswers, choice];
      
      setSelectedAnswers(newSelectedAnswers);
      setCurrentSelectedAnswer(choice); // Keep for compatibility
    }
  };

  const handleNext = () => {
    if (currentView === 'result') {
      setCurrentView('explanation');
    } else if (currentView === 'explanation') {
      // Reset for next question
      setCurrentView('question');
      setHasAnswered(false);
      setSelectedAnswers([]);
      setCurrentSelectedAnswer(null);
      onAnswer(true, ''); // Trigger next question
    }
  };
  
  const handleSubmitMultipleChoice = () => {
    if (selectedAnswers.length === 0) return;
    
    setHasAnswered(true);
    setCurrentView('result');
    
    const correctAnswers = getCorrectAnswers();
    // Check if all selected answers are correct and all correct answers are selected
    const isCorrect = selectedAnswers.length === correctAnswers.length &&
                     selectedAnswers.every(answer => correctAnswers.includes(answer)) &&
                     correctAnswers.every(answer => selectedAnswers.includes(answer));
    
    setTimeout(() => {
      onAnswer(isCorrect, selectedAnswers.join(', '));
    }, 1500);
  };

  const getCorrectAnswers = () => {
    if (!question?.answer) return [];
    if (Array.isArray(question.answer)) {
      return question.answer;
    }
    return [question.answer];
  };

  const getChoiceStatus = (choice: string) => {
    const correctAnswers = getCorrectAnswers();
    const isCorrect = correctAnswers.includes(choice);
    const isSelected = selectedAnswers.includes(choice) || currentSelectedAnswer === choice;
    
    if (!hasAnswered) {
      return isSelected ? 'selected' : 'default';
    }
    
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (hasAnswered) return 'disabled';
    return 'default';
  };

  const getChoiceVariant = (status: string) => {
    switch (status) {
      case 'correct': return 'success';
      case 'incorrect': return 'error';
      case 'disabled': return 'outline';
      case 'selected': return 'secondary';
      default: return 'quiz';
    }
  };

  return (
    <div className={cn("w-full mx-auto", className)}>
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground font-medium">
                {currentView === 'question' ? 'Quiz Question' : currentView === 'result' ? 'Results' : 'Explanation'}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {currentView === 'question' ? '1/3' : currentView === 'result' ? '2/3' : '3/3'}
                </span>
                <Eye className={cn(
                  "h-5 w-5",
                  currentView === 'question' ? "text-muted-foreground" :
                  currentView === 'result' ? "text-study-warning" : "text-study-primary"
                )} />
              </div>
            </div>
            
            {currentView === 'question' && (
              <>
                <div className="space-y-4">
                  <p className="text-xl font-semibold leading-relaxed text-foreground text-justify">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {question.choices?.map((choice, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const status = getChoiceStatus(letter);
                    const variant = getChoiceVariant(status);
                    
                    return (
                      <Button
                        key={index}
                        variant={variant as any}
                        className={cn(
                          "w-full justify-start text-left h-auto p-4 whitespace-normal",
                          status === 'disabled' && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => handleAnswerSelect(letter)}
                        disabled={hasAnswered && getCorrectAnswers().length === 1}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <span className="font-bold text-sm mt-0.5 flex-shrink-0">
                            {letter}.
                          </span>
                          <span className="flex-1 text-base leading-relaxed">
                            {choice}
                          </span>
                          {status === 'correct' && (
                            <CheckCircle className="h-5 w-5 text-study-success flex-shrink-0" />
                          )}
                          {status === 'incorrect' && (
                            <XCircle className="h-5 w-5 text-study-error flex-shrink-0" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Submit button for multiple choice questions */}
                {getCorrectAnswers().length > 1 && !hasAnswered && selectedAnswers.length > 0 && (
                  <div className="text-center">
                    <Button variant="study" onClick={handleSubmitMultipleChoice}>
                      Submit Answer{selectedAnswers.length > 1 ? 's' : ''} ({selectedAnswers.length})
                    </Button>
                  </div>
                )}
              </>
            )}

            {currentView === 'result' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  {(() => {
                    const correctAnswers = getCorrectAnswers();
                    const isCorrect = correctAnswers.length === 1 
                      ? correctAnswers.includes(currentSelectedAnswer || '')
                      : selectedAnswers.length === correctAnswers.length &&
                        selectedAnswers.every(answer => correctAnswers.includes(answer)) &&
                        correctAnswers.every(answer => selectedAnswers.includes(answer));
                    return isCorrect;
                  })() ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-study-success mx-auto" />
                      <p className="text-lg font-semibold text-study-success">Correct!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <XCircle className="h-12 w-12 text-study-error mx-auto" />
                      <p className="text-lg font-semibold text-study-error">Incorrect</p>
                      <p className="text-sm text-muted-foreground">
                        Correct answer{getCorrectAnswers().length > 1 ? 's' : ''}: {getCorrectAnswers().join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {question.choices?.map((choice, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const status = getChoiceStatus(letter);
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border flex items-start space-x-3",
                          status === 'correct' 
                            ? "bg-study-success/10 border-study-success" 
                            : status === 'incorrect'
                            ? "bg-study-error/10 border-study-error"
                            : "bg-muted border-border opacity-50"
                        )}
                      >
                        <span className="font-bold text-sm mt-0.5 flex-shrink-0">
                          {letter}.
                        </span>
                        <span className="flex-1 text-base leading-relaxed">
                          {choice}
                        </span>
                        {status === 'correct' && (
                          <CheckCircle className="h-5 w-5 text-study-success flex-shrink-0" />
                        )}
                        {status === 'incorrect' && (
                          <XCircle className="h-5 w-5 text-study-error flex-shrink-0" />
                        )}
                        {status === 'selected' && !hasAnswered && (
                          <div className="h-5 w-5 rounded-full bg-study-secondary flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <Button variant="study" onClick={handleNext}>
                    View Explanation
                  </Button>
                </div>
              </div>
            )}

            {currentView === 'explanation' && (
              <div className="space-y-4">
                <div className="text-sm text-study-primary font-medium">
                  Explanation
                </div>
                <p className="text-base leading-relaxed text-foreground text-left">
                  {question.explanation || 'No explanation available.'}
                </p>
                <div className="text-center">
                  <Button variant="study" onClick={handleNext}>
                    Next Question
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
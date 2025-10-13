import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, EyeOff, Copy } from 'lucide-react';
import { Question } from '@/types/study';
import { cn } from '@/lib/utils';
import { HighlightedText } from './HighlightedText';
import { textHighlighter, HighlightedText as HighlightedTextType } from '@/services/textHighlighter';

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
  const [currentView, setCurrentView] = useState<'question' | 'revealed'>('question');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedQuestion, setHighlightedQuestion] = useState<HighlightedTextType | null>(null);
  
  // Reset view when question changes
  useEffect(() => {
    setCurrentView('question');
    if (question?.question) {
      textHighlighter.highlightText(question.question)
        .then(setHighlightedQuestion)
        .catch(() => setHighlightedQuestion(null));
    }
  }, [question?.id]);

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
    if (currentView === 'question') {
      setCurrentView('revealed');
    } else {
      // Reset to question view and move to next question
      setCurrentView('question');
      onNext();
    }
  };

  const handlePrevious = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setCurrentView('question');
    onPrevious();
  };

  const handleNextButton = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleNext();
  };

  const getCorrectAnswers = () => {
    if (!question?.answer) return [];
    if (Array.isArray(question.answer)) {
      return question.answer;
    }
    return [question.answer];
  };

  const handleCopyToChatGPT = async () => {
    const correctAnswers = getCorrectAnswers();
    const correctAnswerText = correctAnswers.join(', ');
    
    let fullText = `Reescribe la siguiente pregunta de examen de AWS en una explicación clara y fácil de entender. El resultado debe incluir: Una versión simplificada de la pregunta. La respuesta correcta, con una explicación de por qué es la opción correcta. Una explicación de por qué cada una de las demás opciones no es correcta. La explicación debe ser concisa pero lo suficientemente detallada para ayudar a alguien que estudia para la certificación AWS a comprender la lógica detrás de la respuesta: `;
    fullText += `\n\n${question.question}`;
    
    if (question.choices) {
      fullText += `\n\nOptions:`;
      question.choices.forEach((choice, index) => {
        const letter = String.fromCharCode(65 + index);
        fullText += `\n${letter}. ${choice}`;
      });
    }
    
    fullText += `\n\nCorrect Answer: ${correctAnswerText}`;
    
    if (question.explanation) {
      fullText += `\n\nExplanation: ${question.explanation}`;
    }
    
    try {
      await navigator.clipboard.writeText(fullText);
      const chatGPTUrl = `https://chat.openai.com/?q=${encodeURIComponent(fullText)}`;
      window.open(chatGPTUrl, '_blank');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={cn("w-full mx-auto", className)}>
      <Card className="bg-gradient-card border-0 shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={handleNext}>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground font-medium">
                {currentView === 'question' ? 'Flashcard Study' : 'Study - Full Answer & Explanation'}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyToChatGPT();
                  }}
                  className="text-xs px-2 py-1 h-7"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  ChatGPT
                </Button>
                <span className="text-xs text-muted-foreground">
                  {currentView === 'question' ? '1/2' : '2/2'}
                </span>
                {currentView === 'question' ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-study-success" />
                )}
              </div>
            </div>
            
            {/* Question - Always visible */}
            <div className="space-y-4">
              <p className="text-xl font-semibold leading-relaxed text-foreground text-justify">
                {highlightedQuestion ? (
                  <HighlightedText 
                    text={highlightedQuestion.original}
                    keyPhrases={highlightedQuestion.keyPhrases}
                  />
                ) : (
                  question.question
                )}
              </p>
            </div>

            {/* Answer Choices - Show when revealed */}
            {currentView === 'revealed' && (
              <div className="space-y-3">
                {question.choices?.map((choice, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isCorrect = getCorrectAnswers().includes(letter);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border flex items-start space-x-3",
                        isCorrect 
                          ? "bg-study-success/10 border-study-success" 
                          : "bg-muted border-border"
                      )}
                    >
                      <span className="font-bold text-base mt-0.5 flex-shrink-0">
                        {letter}.
                      </span>
                      <span className="flex-1 text-base leading-relaxed">
                        {choice}
                      </span>
                      {isCorrect && (
                        <div className="h-6 w-6 rounded-full bg-study-success flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explanation - Show when revealed */}
            {currentView === 'revealed' && (
              <div className="space-y-4 border-t pt-6">
                <div className="text-base text-study-primary font-semibold">
                  Explanation
                </div>
                <p className="text-base leading-relaxed text-foreground text-justify">
                  {question.explanation || 'No explanation available.'}
                </p>
              </div>
            )}

            {/* Click hint */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                {currentView === 'question' ? 'Click anywhere to reveal answers & explanation' : 
                 'Click anywhere for next question'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showNavigation && (
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={handlePrevious} className="text-base px-6 py-3">
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            {question.category && (
              <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                {question.category}
              </span>
            )}
          </div>
          <Button variant="study" onClick={handleNextButton} className="text-base px-6 py-3">
            {currentView === 'question' ? 'Show Answers' : 'Next Question'}
          </Button>
        </div>
      )}
    </div>
  );
};
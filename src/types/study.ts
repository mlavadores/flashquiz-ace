export interface Question {
  id: string;
  question: string;
  answer: string;
  choices?: string[];
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  mode: 'flashcard' | 'quiz';
  startTime: Date;
  completed: boolean;
}

export interface StudyProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
}
import { Question } from '@/types/study';
import { parseQuestionsFromFile } from './questionsParser';

// Validate that a question has all required properties
const validateQuestion = (question: any): question is Question => {
  return (
    question &&
    typeof question.id === 'string' &&
    typeof question.question === 'string' &&
    question.question.trim().length > 0 &&
    (typeof question.answer === 'string' || Array.isArray(question.answer)) &&
    Array.isArray(question.choices) &&
    question.choices.length > 0
  );
};

// Filter and validate questions
const validateQuestions = (questions: any[]): Question[] => {
  return questions.filter(validateQuestion);
};

// Cache for parsed questions
let cachedQuestions: Question[] | null = null;

export const loadQuestions = async (): Promise<Question[]> => {
  if (cachedQuestions && cachedQuestions.length > 0) {
    return cachedQuestions;
  }
  
  try {
    const parsedQuestions = await parseQuestionsFromFile();
    const validQuestions = validateQuestions(parsedQuestions);
    
    if (validQuestions && validQuestions.length > 0) {
      cachedQuestions = validQuestions;
      return cachedQuestions;
    } else {
      console.warn('No valid questions parsed from file, using sample questions');
      cachedQuestions = validateQuestions(sampleQuestions);
      return cachedQuestions;
    }
  } catch (error) {
    console.error('Failed to load questions, using sample questions:', error);
    cachedQuestions = validateQuestions(sampleQuestions);
    return cachedQuestions;
  }
};

export const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    category: 'Geography',
    difficulty: 'easy',
    explanation: 'Paris is the capital and most populous city of France.'
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
    choices: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What is the chemical symbol for gold?',
    answer: 'Au',
    choices: ['Go', 'Gd', 'Au', 'Ag'],
    category: 'Chemistry',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'Who painted the Mona Lisa?',
    answer: 'Leonardo da Vinci',
    choices: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo'],
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'What is the largest mammal in the world?',
    answer: 'Blue whale',
    choices: ['African elephant', 'Blue whale', 'Giraffe', 'Polar bear'],
    category: 'Biology',
    difficulty: 'easy'
  },
  {
    id: '6',
    question: 'In which year did World War II end?',
    answer: '1945',
    choices: ['1943', '1944', '1945', '1946'],
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: '7',
    question: 'What is the smallest prime number?',
    answer: '2',
    choices: ['0', '1', '2', '3'],
    category: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: '8',
    question: 'Which gas makes up approximately 78% of Earth\'s atmosphere?',
    answer: 'Nitrogen',
    choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'],
    category: 'Science',
    difficulty: 'medium'
  }
];
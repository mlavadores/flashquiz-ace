import { Question } from '@/types/study';

export const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    category: 'Geography',
    difficulty: 'easy'
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
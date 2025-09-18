import { Question } from '@/types/study';

export async function parseQuestionsFromFile(): Promise<Question[]> {
  try {
    const response = await fetch('/src/data/questions.txt');
    const text = await response.text();
    
    const questions: Question[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentQuestion: Partial<Question> = {};
    let questionText = '';
    let choices: string[] = [];
    let currentChoice = '';
    let isInExplanation = false;
    let explanation = '';
    let questionNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Start of new question
      if (line.startsWith('Question') && line.includes('of') && line.includes('529')) {
        // Save previous question if exists
        if (currentQuestion.question && choices.length > 0) {
          questions.push({
            id: currentQuestion.id || '',
            question: currentQuestion.question,
            answer: currentQuestion.answer || '',
            choices,
            explanation,
            category: 'AWS Solutions Architect',
            difficulty: 'medium'
          } as Question);
        }
        
        // Reset for new question
        questionNumber++;
        currentQuestion = { id: questionNumber.toString() };
        questionText = '';
        choices = [];
        currentChoice = '';
        isInExplanation = false;
        explanation = '';
        continue;
      }
      
      // Skip empty lines
      if (!line) continue;
      
      // Check for answer section
      if (line === 'AnswerDiscussion' || line.startsWith('Correct Answer:')) {
        isInExplanation = true;
        if (line.startsWith('Correct Answer:')) {
          const answer = line.replace('Correct Answer:', '').trim();
          // Handle multiple correct answers (A, B or A,B format)
          if (answer.includes(',') || answer.includes(' and ') || answer.includes(' & ')) {
            currentQuestion.answer = answer.split(/[,&]|\sand\s/).map(a => a.trim());
          } else {
            currentQuestion.answer = answer;
          }
        }
        continue;
      }
      
      // Collect explanation text
      if (isInExplanation) {
        explanation += line + ' ';
        continue;
      }
      
      // Check for answer choices (A., B., C., D.)
      if (/^[A-Z]\.$/.test(line)) {
        // Save previous choice if exists
        if (currentChoice) {
          choices.push(currentChoice.trim());
        }
        currentChoice = '';
        continue;
      }
      
      // Check if we're building a choice
      if (choices.length < 4 && questionText) {
        currentChoice += line + ' ';
        continue;
      }
      
      // This is part of the question text
      questionText += line + ' ';
      currentQuestion.question = questionText.trim();
    }
    
    // Don't forget the last question
    if (currentQuestion.question && choices.length > 0) {
      questions.push({
        id: currentQuestion.id || '',
        question: currentQuestion.question,
        answer: currentQuestion.answer || '',
        choices,
        explanation: explanation.trim(),
        category: 'AWS Solutions Architect',
        difficulty: 'medium'
      } as Question);
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing questions file:', error);
    return [];
  }
}
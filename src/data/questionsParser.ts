import { Question } from '@/types/study';

export async function parseQuestionsFromFile(): Promise<Question[]> {
  try {
    const response = await fetch('/questions.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }
    const text = await response.text();
    
    const questions: Question[] = [];
    const sections = text.split(/Question \d+ of 529/).filter(section => section.trim().length > 0);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      let questionText = '';
      let choices: string[] = [];
      let answer = '';
      let explanation = '';
      let isInAnswerSection = false;
      let currentChoice = '';
      
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        
        // Check for answer section
        if (line === 'AnswerDiscussion' || line.startsWith('Correct Answer:')) {
          isInAnswerSection = true;
          if (line.startsWith('Correct Answer:')) {
            answer = line.replace('Correct Answer:', '').trim();
          }
          continue;
        }
        
        // Collect explanation text
        if (isInAnswerSection) {
          if (line.startsWith('Correct Answer:')) {
            answer = line.replace('Correct Answer:', '').trim();
          } else {
            explanation += line + ' ';
          }
          continue;
        }
        
        // Check for answer choices (A., B., C., D.)
        if (/^[A-D]\.$/.test(line)) {
          // Save previous choice if exists
          if (currentChoice.trim()) {
            choices.push(currentChoice.trim());
          }
          currentChoice = '';
          continue;
        }
        
        // Check if we're building a choice (after seeing A., B., etc.)
        if (choices.length < 4 && questionText.trim() && /^[A-D]\.$/.test(lines[j-1] || '')) {
          currentChoice = line;
          continue;
        }
        
        // Continue building current choice
        if (currentChoice && choices.length < 4) {
          currentChoice += ' ' + line;
          continue;
        }
        
        // This is part of the question text
        if (!isInAnswerSection && !currentChoice) {
          questionText += line + ' ';
        }
      }
      
      // Add the last choice if exists
      if (currentChoice.trim()) {
        choices.push(currentChoice.trim());
      }
      
      // Create question if we have all required parts
      if (questionText.trim() && choices.length >= 2 && answer) {
        questions.push({
          id: (i + 1).toString(),
          question: questionText.trim(),
          answer: answer,
          choices: choices,
          explanation: explanation.trim() || 'No explanation available.',
          category: 'AWS Solutions Architect',
          difficulty: 'medium'
        });
      }
    }
    
    console.log(`Parsed ${questions.length} questions from file`);
    return questions;
  } catch (error) {
    console.error('Error parsing questions file:', error);
    return [];
  }
}
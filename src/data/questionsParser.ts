import { Question } from '@/types/study';

export async function parseQuestionsFromFile(): Promise<Question[]> {
  try {
    const response = await fetch('/questions.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }
    const text = await response.text();
    
    const questions: Question[] = [];
    // Split by "Question X of 529" pattern
    const sections = text.split(/Question \d+ of 529/);
    
    for (let i = 1; i < sections.length; i++) { // Start from 1 to skip the first empty section
      const section = sections[i].trim();
      if (!section) continue;
      
      const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      let questionText = '';
      let choices: string[] = [];
      let answer = '';
      let explanation = '';
      let isInAnswerSection = false;
      let isCollectingChoices = false;
      let currentChoice = '';
      
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        
        // Check for answer section markers
        if (line === 'AnswerDiscussion' || line.startsWith('Correct Answer:')) {
          // Save any pending choice before entering answer section
          if (currentChoice.trim() && choices.length < 4) {
            choices.push(currentChoice.trim());
            currentChoice = '';
          }
          isInAnswerSection = true;
          isCollectingChoices = false;
          if (line.startsWith('Correct Answer:')) {
            answer = line.replace('Correct Answer:', '').trim();
          }
          continue;
        }
        
        // Collect explanation text in answer section
        if (isInAnswerSection) {
          if (line.startsWith('Correct Answer:')) {
            answer = line.replace('Correct Answer:', '').trim();
          } else {
            explanation += line + ' ';
          }
          continue;
        }
        
        // Check for choice markers (A., B., C., D.)
        if (/^[A-D]\.$/.test(line)) {
          // Save previous choice if exists
          if (currentChoice.trim() && choices.length < 4) {
            choices.push(currentChoice.trim());
          }
          isCollectingChoices = true;
          currentChoice = '';
          continue;
        }
        
        // Collect choice text or question text
        if (isCollectingChoices) {
          currentChoice += (currentChoice ? ' ' : '') + line;
        } else {
          questionText += (questionText ? ' ' : '') + line;
        }
      }
      
      // Save any remaining choice
      if (currentChoice.trim() && choices.length < 4) {
        choices.push(currentChoice.trim());
      }
      
      // Create question if we have all required parts
      if (questionText.trim() && choices.length >= 2) {
        // If no explicit answer found, use the first choice as default
        if (!answer && choices.length > 0) {
          answer = choices[0];
        }
        
        questions.push({
          id: i.toString(),
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
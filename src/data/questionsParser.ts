import { Question } from '@/types/study';

export async function parseQuestionsFromFile(): Promise<Question[]> {
  try {
    const response = await fetch('/questions.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }
    const text = await response.text();
    
    const questions: Question[] = [];
    
    // First, let's find all "Question X of 529" markers and their positions
    const questionMarkers = [];
    const questionRegex = /Question (\d+) of 529/g;
    let match;
    
    while ((match = questionRegex.exec(text)) !== null) {
      questionMarkers.push({
        index: match.index,
        questionNumber: parseInt(match[1]),
        fullMatch: match[0]
      });
    }
    
    // If we found markers, split the text accordingly
    if (questionMarkers.length > 0) {
      // Add the first section (before the first marker)
      const firstSection = text.substring(0, questionMarkers[0].index).trim();
      if (firstSection) {
        const parsedQuestion = parseQuestionSection(firstSection, 1);
        if (parsedQuestion) questions.push(parsedQuestion);
      }
      
      // Process each section between markers
      for (let i = 0; i < questionMarkers.length; i++) {
        const startIndex = questionMarkers[i].index + questionMarkers[i].fullMatch.length;
        const endIndex = i < questionMarkers.length - 1 ? questionMarkers[i + 1].index : text.length;
        const section = text.substring(startIndex, endIndex).trim();
        
        if (section) {
          const parsedQuestion = parseQuestionSection(section, questionMarkers[i].questionNumber);
          if (parsedQuestion) questions.push(parsedQuestion);
        }
      }
    } else {
      // Fallback: try to parse the entire text as one question
      const parsedQuestion = parseQuestionSection(text, 1);
      if (parsedQuestion) questions.push(parsedQuestion);
    }
    
    console.log(`Parsed ${questions.length} questions from file`);
    return questions;
  } catch (error) {
    console.error('Error parsing questions file:', error);
    return [];
  }
}

function parseQuestionSection(section: string, questionNumber: number): Question | null {
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
        const answerText = line.replace('Correct Answer:', '').trim();
        // Handle multiple correct answers (e.g., "A, B" or "A, B, C")
        if (answerText.includes(',')) {
          answer = answerText.split(',').map(a => a.trim()).filter(a => a.length > 0);
        } else {
          answer = answerText;
        }
      }
      continue;
    }
    
    // Collect explanation text in answer section
    if (isInAnswerSection) {
      if (line.startsWith('Correct Answer:')) {
        const answerText = line.replace('Correct Answer:', '').trim();
        // Handle multiple correct answers (e.g., "A, B" or "A, B, C")
        if (answerText.includes(',')) {
          answer = answerText.split(',').map(a => a.trim()).filter(a => a.length > 0);
        } else {
          answer = answerText;
        }
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
      answer = 'A';
    }
    
    return {
      id: questionNumber.toString(),
      question: questionText.trim(),
      answer: answer,
      choices: choices,
      explanation: explanation.trim() || 'No explanation available.',
      category: 'AWS Solutions Architect',
      difficulty: 'medium'
    };
  }
  
  return null;
}
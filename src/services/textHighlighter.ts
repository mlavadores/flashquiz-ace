export interface KeyPhrase {
  text: string;
  score: number;
  beginOffset: number;
  endOffset: number;
}

export interface HighlightedText {
  original: string;
  keyPhrases: KeyPhrase[];
}

class TextHighlighterService {
  async highlightText(text: string): Promise<HighlightedText> {
    const keyPhrases: KeyPhrase[] = [];
    const importantWords = ['which', 'what', 'how', 'when', 'where', 'why', 'who', 'best', 'most', 'correct', 'primary', 'main'];
    
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        keyPhrases.push({
          text: match[0],
          score: 0.9,
          beginOffset: match.index,
          endOffset: match.index + match[0].length
        });
      }
    });

    return {
      original: text,
      keyPhrases: keyPhrases.sort((a, b) => a.beginOffset - b.beginOffset)
    };
  }
}

export const textHighlighter = new TextHighlighterService();
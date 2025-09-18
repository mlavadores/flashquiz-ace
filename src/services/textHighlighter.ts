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
    try {
      // Use your Amplify API endpoint here
      const apiUrl = 'https://YOUR_AMPLIFY_API_ID.execute-api.YOUR_REGION.amazonaws.com/dev/highlightText';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to highlight text');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error highlighting text:', error);
      // Fallback to simple highlighting
      return {
        original: text,
        keyPhrases: []
      };
    }
  }


}

export const textHighlighter = new TextHighlighterService();
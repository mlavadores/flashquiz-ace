import express from 'express';
import cors from 'cors';
import { ComprehendClient, DetectKeyPhrasesCommand } from "@aws-sdk/client-comprehend";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// AWS Comprehend client
const comprehendClient = new ComprehendClient({ 
  region: process.env.AWS_REGION || 'us-east-1'
});

app.post('/highlight-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const command = new DetectKeyPhrasesCommand({
      Text: text,
      LanguageCode: "en"
    });

    const response = await comprehendClient.send(command);
    
    const keyPhrases = response.KeyPhrases?.map(kp => ({
      text: kp.Text || '',
      score: kp.Score || 0,
      beginOffset: kp.BeginOffset || 0,
      endOffset: kp.EndOffset || 0
    })).filter(kp => kp.score > 0.85) // Higher threshold for better quality
      .slice(0, 4) || []; // Limit to top 4 most important phrases

    res.json({
      original: text,
      keyPhrases: keyPhrases.sort((a, b) => a.beginOffset - b.beginOffset)
    });
  } catch (error) {
    console.error('AWS Comprehend error:', error);
    
    // Fallback: highlight important question words and key terms
    const keyPhrases = [];
    const importantWords = ['which', 'what', 'how', 'best', 'most', 'correct', 'primary', 'main'];
    
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

    res.json({
      original: text,
      keyPhrases: keyPhrases.sort((a, b) => a.beginOffset - b.beginOffset).slice(0, 4)
    });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
import { ComprehendClient, DetectKeyPhrasesCommand } from "@aws-sdk/client-comprehend";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const client = new ComprehendClient({ 
      region: process.env.AWS_REGION || 'us-east-1'
    });

    const command = new DetectKeyPhrasesCommand({
      Text: text,
      LanguageCode: "en"
    });

    const response = await client.send(command);
    
    const keyPhrases = response.KeyPhrases?.map(kp => ({
      text: kp.Text || '',
      score: kp.Score || 0,
      beginOffset: kp.BeginOffset || 0,
      endOffset: kp.EndOffset || 0
    })).filter(kp => kp.score > 0.7) || [];

    res.status(200).json({
      original: text,
      keyPhrases: keyPhrases.sort((a, b) => a.beginOffset - b.beginOffset)
    });
  } catch (error) {
    console.error('AWS Comprehend error:', error);
    res.status(500).json({ error: 'Failed to process text' });
  }
}
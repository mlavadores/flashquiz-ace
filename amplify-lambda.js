import { ComprehendClient, DetectKeyPhrasesCommand } from "@aws-sdk/client-comprehend";

export const handler = async (event) => {
  const { text } = JSON.parse(event.body);
  
  if (!text) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: 'Text is required' })
    };
  }

  try {
    const client = new ComprehendClient({ region: process.env.AWS_REGION });
    
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
    })).filter(kp => kp.score > 0.85).slice(0, 4) || [];

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        original: text,
        keyPhrases: keyPhrases.sort((a, b) => a.beginOffset - b.beginOffset)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: 'Failed to process text' })
    };
  }
};
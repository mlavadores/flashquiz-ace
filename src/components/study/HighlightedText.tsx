import React from 'react';
import { KeyPhrase } from '@/services/textHighlighter';

interface HighlightedTextProps {
  text: string;
  keyPhrases: KeyPhrase[];
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  keyPhrases,
  className = ''
}) => {
  if (!keyPhrases.length) {
    return <span className={className}>{text}</span>;
  }

  const parts: Array<{ text: string; isHighlighted: boolean }> = [];
  let lastOffset = 0;

  keyPhrases.forEach(phrase => {
    // Add text before the highlighted phrase
    if (phrase.beginOffset > lastOffset) {
      parts.push({
        text: text.slice(lastOffset, phrase.beginOffset),
        isHighlighted: false
      });
    }

    // Add the highlighted phrase
    parts.push({
      text: text.slice(phrase.beginOffset, phrase.endOffset),
      isHighlighted: true
    });

    lastOffset = phrase.endOffset;
  });

  // Add remaining text after the last highlighted phrase
  if (lastOffset < text.length) {
    parts.push({
      text: text.slice(lastOffset),
      isHighlighted: false
    });
  }

  return (
    <span className={className}>
      {parts.map((part, index) => (
        part.isHighlighted ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded font-medium"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      ))}
    </span>
  );
};
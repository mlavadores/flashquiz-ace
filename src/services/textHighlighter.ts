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
    const importantWords = [
      'which',
      'how',
      'primary',
      'most cost-effective',
      'select TWO',
      'select THREE',
      'meet the requirements',
      'minimal change',
      'high availability',
      'reduce costs',
      'improve performance',
      'ensure',
      'fault tolerance',
      'scalability',
      'security',
      'operational overhead',
      'latency',
      'cross-region',
      'data replication',
      'automate',
      'resilience',
      'compliance',
      'monitoring',
      'encryption',
      'migration',
      'cross-account access',
      'resource-based policy',
      'External ID',
      'AWS Organizations',
      'Service Control Policy (SCP)',
      'AWS Control Tower',
      'AWS Resource Access Manager (RAM)',
      'VPC peering',
      'AWS Transit Gateway',
      'VPC endpoint',
      'NAT instance',
      'AWS Direct Connect',
      'VPN Site-to-Site',
      'Pilot Light strategy',
      'Warm Standby strategy',
      'CloudFormation drift detection',
      'IAM role and trust policy',
      'AWS Single Sign-On (IAM Identity Center)',
      'SAML 2.0 federation',
      'Amazon Cognito',
      'AWS Key Management Service (KMS)',
      'server-side encryption (SSE)',
      'Cross-Origin Resource Sharing (CORS)',
      'AWS App Runner',
      'API Gateway quotas and concurrency',
      'Systems Manager Run Command',
      'Trusted Advisor and Cost Explorer',
      'Direct Connect Gateway and virtual interface',
      'AWS DataSync',
      'Cloud Adoption Readiness Tool (CART)',
      'Application Migration Service (MGN)',
      'Systems Manager Parameter Store',
      'Auto Scaling Rolling Update',
      'DeletionPolicy Retain/Snapshot',
      'Control Tower guardrails'
    ];
    
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
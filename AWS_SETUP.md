# AWS Comprehend Integration Setup

This guide explains how to set up AWS Comprehend for text highlighting in your FlashQuiz application.

## Prerequisites

1. AWS Account with Comprehend access
2. AWS CLI installed and configured
3. Proper IAM permissions for Comprehend

## Setup Steps

### 1. AWS Credentials Configuration

Create a `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Add your AWS credentials to `.env`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 2. IAM Permissions

Your AWS user/role needs these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "comprehend:DetectKeyPhrases",
                "comprehend:DetectEntities"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. Running the Application

Start both the API server and frontend:

```bash
npm run dev
```

This will start:
- API server on `http://localhost:3001`
- Frontend on `http://localhost:8080`

### 4. Testing the Integration

1. Navigate to flashcard or quiz mode
2. Questions should now show highlighted key phrases
3. Check browser console for any API errors

## Fallback Mode

If AWS Comprehend is not available, the application will fall back to simple keyword highlighting using predefined patterns.

## Production Deployment

For production with Amplify:

1. The API server should be replaced with AWS Lambda functions
2. Use Amplify's built-in authentication for AWS services
3. Remove hardcoded credentials and use IAM roles

## Troubleshooting

- **API Errors**: Check AWS credentials and permissions
- **No Highlighting**: Verify the API server is running on port 3001
- **CORS Issues**: Ensure the proxy configuration in `vite.config.ts` is correct
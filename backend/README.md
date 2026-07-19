# SnapFreeTools Contact API Backend

## Purpose
This backend serves as the secure contact form endpoint for SnapFreeTools. It provides request validation, spam protection, rate limiting, and email delivery via Nodemailer. No database is utilized; all requests are safely handled in memory and dispatched via SMTP. Email providers retain delivered messages.

## Architecture
- **Express.js** API using **CommonJS** modules.
- **Zod** for robust input validation.
- **Nodemailer** for email delivery.
- **express-rate-limit**, **helmet**, and **cors** for security.

## Local Setup
1. \`cd backend\`
2. \`npm install\`
3. Copy \`.env.example\` to \`.env\`
4. Configure your \`.env\` file. **DO NOT COMMIT \`.env\` to version control.**

### Environment Variables
Ensure all required environment variables are set. 
- \`FRONTEND_ORIGIN\` (e.g. \`http://localhost:3000\`)
- \`SMTP_PASS\` (Google App Password)

### Gmail Setup (Important)
Normal Gmail passwords **MUST NOT** be used. You must enable Google 2-Step Verification on the sender account and generate a 16-character **App Password**. 

## Running Locally
- \`npm run dev\` - Starts the server with Nodemon on \`http://localhost:5000\`.
- \`npm start\` - Starts the production server.

## Running Tests
- \`npm test\` - Runs the native Node.js test runner (\`node --test\`).
- \`npm run test:watch\` - Runs tests in watch mode.

## API Contract
### \`POST /api/v1/contact\`
Accepts a JSON payload:
\`\`\`json
{
  "name": "Muhammad Sameer",
  "email": "user@example.com",
  "subject": "Tool Suggestion",
  "category": "tool-suggestion",
  "message": "Detailed message...",
  "privacyAccepted": true,
  "website": ""
}
\`\`\`
Returns a 200/201 success response with a Reference ID, or 400 Validation Error, 429 Rate Limit, 502 Delivery Failed.

## Security Warnings
- Secrets belong **only** in \`.env\`.
- CORS must be exactly matched to the frontend origin. Wildcards (\`*\`) must not be used in production.
- Rate Limit is strictly 5 requests per 15 minutes per IP by default.
- Spam protection checks honeypots, minimum submission time, and link counts.

## Production Deployment Notes
Prepare for hosting on Render, Railway, Fly.io, or VPS. 
- Ensure all environment variables are populated in the hosting provider's dashboard.
- Frontend API URL will be configured as \`NEXT_PUBLIC_CONTACT_API_URL=https://api.snapfreetools.com/api/v1\` in Next.js.

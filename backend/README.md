# SnapFreeTools Backend

## Purpose
This architecture provides the structure for the future Contact form API endpoint and email delivery functionality.

## Folder Structure
- `src/config/`: Configuration for environment variables, mail, and CORS.
- `src/controllers/`: Logic for handling incoming requests (e.g., contact controller).
- `src/routes/`: Express route definitions.
- `src/services/`: Business logic, such as the email service (Nodemailer).
- `src/validators/`: Zod schemas for input validation.
- `src/middleware/`: Rate limiting, spam protection, and error handling.
- `src/templates/`: Email HTML/text templates for notifications and auto-replies.
- `src/utils/`: Helper utilities (logger, sanitizer, etc.).

## Planned API Endpoint
- `POST /api/v1/contact`: Accepts a JSON payload from the frontend and sends an email to the admin.

## Environment Variables
Copy `.env.example` to `.env` and fill in the required placeholders. Never commit `.env` to version control.

## Local Development Commands
- `npm run dev`: Starts the development server using nodemon.
- `npm start`: Starts the production server.
- `npm test`: Runs the test suite.

## Gmail SMTP Configuration (Future)
When configuring Nodemailer, use an **App Password** for Gmail. Do not use your normal Gmail account password. Ensure the `SMTP_USER` and `SMTP_PASS` reflect this.

## Security & Deployment
- Email delivery is **not active yet**.
- CORS is configured to only allow requests from `FRONTEND_ORIGIN`.
- Rate limiting prevents abuse.
- Input validation ensures data integrity.


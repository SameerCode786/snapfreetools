# SnapFreeTools Backend

Standalone Express API handling contact form submissions.

## Setup Instructions

### Frontend

1. Create root `.env.local` based on `.env.example`.
2. Add the following variable:
   ```env
   NEXT_PUBLIC_CONTACT_API_URL=http://localhost:5000/api/v1/contact
   ```
3. Stop the existing frontend server manually.
4. Restart it manually because `NEXT_PUBLIC_` variables are only read when Next.js starts. Changes to `.env.local` do not reliably apply until the frontend dev server is restarted.

### Backend

1. Create `backend/.env` from `backend/.env.example`.
2. Configure `SMTP_USER`.
3. Enable Google 2-Step Verification and generate a Google App Password.
4. Set `SMTP_APP_PASSWORD` to the App Password (never commit this to Git).
5. Set `CONTACT_RECEIVER_EMAIL` to `sameerwebdeveloper41@gmail.com`.
6. Set `FRONTEND_ORIGIN` to the exact frontend origin being used (e.g. `http://localhost:3000` or `http://localhost:3000,http://192.168.100.8:3000`).
7. Start the backend manually on port 5000 in a separate terminal:
   ```bash
   cd backend
   npm start
   ```
8. Open [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health) to check health.
9. Run `npm run verify:mail` manually to verify SMTP configuration.
10. Run `npm run test:mail` manually if transport verification passes.
11. Submit the Contact form from the frontend.
12. Check Gmail Inbox and Spam folders.
13. Inspect the backend terminal for safe error messages.

## Verification

Do not run these automatically. 

To verify your SMTP credentials without running the server:
```bash
npm run verify:mail
```

To send a test email to the configured receiver:
```bash
npm run test:mail
```

## Word to PDF Converter

Word to PDF relies on LibreOffice Headless running securely on the server.

### Configuration
Set `WORD_TO_PDF_ENABLED=true` in your `.env` file. Leave `LIBREOFFICE_PATH` empty to use OS defaults.
File limits (10MB default) and temp directory behavior can also be configured.

### Installation
**Windows**: Install LibreOffice. The backend will automatically check standard paths like `C:\Program Files\LibreOffice\program\soffice.exe`.
**Linux**: `sudo apt-get update && sudo apt-get install libreoffice-core --no-install-recommends` (or similar depending on distro).
**Docker**: For production, consider Dockerizing the API and LibreOffice together for better scaling.

### Verification
Verify LibreOffice detection and run a test conversion locally:
```bash
npm run verify:word-to-pdf <path-to-test.docx>
```

### Security & Privacy
The API isolates conversions in unique OS temp directories. Files are automatically swept via `finally` blocks and a cleanup utility to guarantee user privacy.

*Do not forget to update the Privacy Policy when the frontend goes live.*

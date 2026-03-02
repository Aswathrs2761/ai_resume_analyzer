# AI Resume Analyzer (Backend)

This repository contains the backend component of the AI Resume Analyzer project. The service exposes RESTful endpoints for user authentication and resume processing using AI and OCR technologies. It leverages MongoDB for storage, OpenAI for analysis, and Tesseract for OCR extraction of text.

## 📁 Project Structure
```
Server/
  Config/           - Database configuration
  Controllers/      - Route handlers for auth and resumes
  middleware/       - Authentication and file upload handling
  Models/           - Mongoose schemas for users and analysis results
  routes/           - Express routes definitions
  services/         - AI/OCR logic and helper functions
  utils/            - Utility helpers (mailer, ocr helpers)
uploads/            - Temporary storage for uploaded files
server.js           - Entry point for the application
package.json        - Node.js dependencies and scripts
.env                - Environment variables (not committed)
```

## 🚀 Features
- User authentication with JWT and bcrypt
- Resume upload via multipart/form-data
- Text extraction from PDFs using `pdf-poppler`, `pdfjs-dist`
- Optical Character Recognition (OCR) with `tesseract.js`
- AI-powered analysis using OpenAI API
- Email notifications via SendGrid

## 🔧 Prerequisites
- Node.js v18+ (with `npm` or `yarn`)
- MongoDB instance (local or hosted)
- OpenAI API key
- SendGrid API key (optional, for email functionality)

## ⚙️ Installation
1. **Clone the repository**
   ```bash
   git clone <repo-url> backend_ai_resume_analyzer
   cd backend_ai_resume_analyzer
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment variables**
   Create a `.env` file in the project root with the following values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/yourdbname
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_key
   OPENAI_API_KEY=your_openai_key
   ```

## 🛠 Running the Server
- Development with auto-reload:
  ```bash
  npm run dev
  ```
- Production / simple start:
  ```bash
  npm start
  ```

The server listens on the port defined by `PORT` (default 5000).

## 📡 API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT
- `POST /api/resume/upload` - Upload a resume file (PDF or image)
- `GET /api/resume/:id` - Retrieve analysis results (authorized)

> **NOTE:** Many routes require authorization header: `Authorization: Bearer <token>`

## 📦 Dependencies
Key dependencies include:
- `express`, `mongoose`, `jsonwebtoken`, `bcryptjs` for backend services
- `multer` for handling file uploads
- `openai` for AI analysis
- `tesseract.js` and `pdf-poppler` for text extraction
- `@sendgrid/mail` for sending emails

## 🛡 Security & Environment
- Do **not** commit `.env` or any sensitive credentials to version control.
- Ensure uploads are cleared regularly or managed via cloud storage for production.

## 📝 License
This project is licensed under the [Aswath](LICENSE).

## 🙋‍♂️ Contributing
Feel free to open issues or submit pull requests. Follow standard GitHub workflow.

---


# 🇺🇸 US Visa Interview Simulator

A high-fidelity, AI-powered mock interview platform designed to help applicants prepare for US visa interviews. Built with Next.js 14, Firebase, and OpenAI GPT-4.

![Visa Interview Simulator](https://img.shields.io/badge/Status-Production%20Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## 🌟 Features

### Core Interview Functionality
- **AI-Powered Interviews**: Real-time conversation with GPT-4 acting as a consular officer
- **Multiple Visa Types**: Support for B1/B2 (Tourist), F1 (Student), H1B (Work), and J1 (Exchange)
- **Adaptive Questioning**: Questions adapt based on your answers and document context
- **Detailed Feedback**: Instant scoring and suggestions for improvement
- **Progress Tracking**: Visual progress bar showing interview completion

### Document Management
- **Document Upload**: Upload supporting documents (PDFs, images)
- **AI Document Analysis**: Automatic extraction and validation of document data
- **Smart Suggestions**: AI suggests questions based on uploaded documents
- **Document Preview**: View and manage uploaded documents

### User Experience
- **Voice Input**: Speech-to-text support for hands-free answering
- **Text-to-Speech**: Officer questions are read aloud
- **Real-time Typing Indicators**: See when AI is generating responses
- **Session History**: Review past interview sessions
- **Performance Analytics**: Track improvement over time

### Security & Authentication
- **Firebase Authentication**: Secure user login with Google, email/password
- **Protected Routes**: Middleware ensures only authenticated users access interviews
- **Token-based API**: JWT tokens for API authentication

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **AI/ML** | OpenAI GPT-4, Whisper API |
| **File Storage** | Firebase Storage |
| **Document Processing** | Tesseract.js (OCR), pdf-parse |

### Project Structure

```
visa/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── interview/         # Interview session management
│   │   └── documents/         # Document upload & processing
│   ├── interview/             # Interview page
│   ├── dashboard/             # User dashboard
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                # React components
│   ├── auth/                  # Authentication components
│   ├── interview/             # Interview UI components
│   ├── documents/             # Document management components
│   └── ui/                    # Reusable UI components
├── lib/                       # Utilities and libraries
│   ├── ai/                    # AI interview engine
│   ├── documents/             # Document processing
│   ├── storage/               # File storage utilities
│   └── firebase-admin.ts      # Firebase Admin SDK setup
├── prisma/                    # Database schema
├── public/                    # Static assets
└── .env.local                 # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mashimi/Visa.git
   cd Visa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (Server-side)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
   FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app

   # OpenAI
   OPENAI_API_KEY=sk-your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Starting an Interview

1. **Sign up / Log in** with your email or Google account
2. **Navigate to the Interview page**
3. **Select your visa type** (B1/B2, F1, H1B, J1)
4. **Choose officer persona** (Neutral, Strict, or Helpful)
5. **Select consulate/mission** (affects wait time display)
6. **Click "Execute Alpha Protocol"** to begin

### During the Interview

- **Type your answers** in the text box or use the microphone for voice input
- **Read the officer's feedback** after each answer
- **Review suggestions** for improvement
- **Watch your progress** on the progress bar

### Uploading Documents

1. Go to the **Document Repository** tab
2. **Drag and drop** or click to upload files
3. **Wait for AI analysis** to complete
4. **Review extracted data** and validation results

### Reviewing Past Sessions

1. Click on **Mission Records** in the sidebar
2. **View your interview history**
3. **Click any session** to review the conversation
4. **Analyze your performance** over time

## 🧠 AI Interview Engine

The AI engine powers the intelligent interview experience:

### Question Generation
```typescript
// Generates contextually relevant questions based on:
// - Visa type
// - User documents
// - Previous answers
// - Officer persona
```

### Answer Evaluation
```typescript
// Evaluates answers on:
// - Relevance to question
// - Consistency with documents
// - Demonstration of home ties (214(b))
// - Financial clarity
// - Travel purpose legitimacy
```

### Document Analysis
```typescript
// Analyzes documents to extract:
// - Document category
// - Key data points
// - Potential issues
// - Suggested follow-up questions
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password, Google)
3. Create a **Firestore database**
4. Set up **Storage** for document uploads
5. Generate **Admin SDK credentials** (Service Account)

### OpenAI Setup

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add it to your `.env.local`

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run type-check

# Format code with Prettier
npm run format

# Lint code
npm run lint
```

### Database Schema (Prisma)

The application uses Firebase Firestore, but the data models follow this structure:

- **Users**: Authentication and profile data
- **InterviewSessions**: Interview session metadata
- **InterviewMessages**: Q&A conversation history
- **Documents**: Uploaded document metadata

## 🐛 Troubleshooting

### Common Issues

#### 503 Errors on API Routes
**Cause**: Firebase Admin SDK not properly initialized
**Solution**: Verify your Firebase Admin credentials in `.env.local`

#### Session ID is "null"
**Cause**: Client-side state not properly initialized
**Solution**: Refresh the page and start a new session

#### Document Upload Fails
**Cause**: Firebase Storage not configured or file too large
**Solution**: Check Firebase Storage rules and increase size limits

#### OpenAI API Errors
**Cause**: Invalid API key or rate limits
**Solution**: Verify API key and check OpenAI dashboard for usage

## 📊 Performance Metrics

- **Interview Session Duration**: ~10-15 minutes
- **AI Response Time**: 3-8 seconds per question
- **Document Processing**: 5-15 seconds per document
- **Supported File Types**: PDF, PNG, JPG, DOCX
- **Maximum File Size**: 10MB

## 🔒 Security Considerations

- All API routes require authentication
- Firebase Security Rules protect data access
- API rate limiting prevents abuse
- Sensitive data encrypted at rest
- CORS configured for production domain

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Add all `.env.local` variables to your Vercel project settings.

### Firebase Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /interviewSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    match /documents/{documentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the powerful GPT-4 API
- **Firebase** for the robust backend infrastructure
- **Next.js** team for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/mashimi/Visa/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/mashimi/Visa/discussions)

## 🗺️ Roadmap

- [ ] Video mock interviews with AI avatar
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Group interview practice sessions
- [ ] Integration with real DS-160 form data
- [ ] AI-powered document generation assistance

---

**Built with ❤️ for visa applicants worldwide**
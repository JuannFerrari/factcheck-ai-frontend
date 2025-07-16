# FactCheck AI Frontend

[![CI Pipeline](https://github.com/JuannFerrari/factcheck-ai-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/JuannFerrari/factcheck-ai-frontend/actions/workflows/ci.yml)

**Backend Repository**: [factcheck-ai-backend](https://github.com/JuannFerrari/factcheck-ai-backend)

A modern, responsive web application for AI-powered fact-checking. Built with Next.js 15, TypeScript, and Tailwind CSS, this frontend provides an intuitive interface for users to submit claims and receive AI-analyzed fact-checking results with confidence scores and source citations.

## 🚀 Features

- **AI-Powered Fact Checking**: Submit claims and receive intelligent analysis using Meta Llama 3
- **Real-time Results**: Instant feedback with loading states and progress indicators
- **Source Citations**: View verified sources with links and snippets for each fact-check
- **Confidence Scoring**: See confidence levels (0-100) for each verdict
- **Result History**: Automatic local storage of previous fact-checks with pagination
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Modern UI**: Clean, accessible interface built with Radix UI and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- FactCheck AI Backend running

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd factcheck-ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Backend API URL (optional, defaults to http://localhost:8000)
   BACKEND_API_URL=http://localhost:8000
   
   # API Key for authentication (server-side only)
   FACTCHECK_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Submitting a Claim

1. **Enter your claim** in the text area
   - Example: "The Eiffel Tower is taller than the Statue of Liberty"
   - Be specific and factual for best results

2. **Click "Check Claim"** to submit
   - The AI will search for relevant sources
   - Analysis typically takes 10-30 seconds

3. **Review the results**
   - **Verdict**: True, False, or Unclear
   - **Confidence**: Score from 0-100
   - **Explanation**: Detailed reasoning
   - **Sources**: Clickable links to evidence

### Viewing History

- Previous fact-checks are automatically saved
- Use "Load more" to view older results
- Results persist between browser sessions

## 🧪 Testing

### Run all tests
```bash
npm test
# or
yarn test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKEND_API_URL` | Backend API URL | `http://localhost:8000` | No |
| `FACTCHECK_API_KEY` | API key for authentication (server-side only) | - | Yes |

### API Integration

The frontend communicates with the FactCheck AI Backend via a secure proxy:

- **Frontend Endpoint**: `POST /api/factcheck` (Next.js API route)
- **Backend Endpoint**: `POST /api/v1/factcheck`
- **Authentication**: API key handled server-side only
- **Rate Limiting**: 10 requests/minute, 2 requests/second

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

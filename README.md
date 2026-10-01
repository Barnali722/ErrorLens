# DevFix

**Turn coding errors into understandable solutions.**

A web application for the GeeksforGeeks DevFix challenge that helps developers understand and fix coding errors across multiple programming languages.

## 🌟 Features

- **Error Analysis**: Paste any error message and get plain-English explanations
- **Multi-Language Support**: JavaScript, Python, Java, C++, and more
- **Comprehensive Solutions**: 
  - What happened (clear explanation)
  - Why it happened (common causes)
  - How to fix it (step-by-step instructions)
  - Code examples with copy functionality
- **Example Library**: Quick-access error examples to test the app
- **Modern UI**: Clean design with dark mode support
- **Responsive**: Works on desktop, tablet, and mobile (down to 360px)

## 🏗️ Architecture

This project uses a **separated frontend and backend architecture**:

```
ErrorLens/
├── backend/           # Node.js + Express API
│   ├── server.js      # Main server file with error patterns
│   └── package.json   # Backend dependencies
├── frontend/          # Static HTML/CSS/JS
│   ├── index.html     # Main HTML structure
│   ├── styles.css     # All styling and theming
│   └── app.js         # Frontend logic and API calls
└── README.md
```

### Backend
- **Technology**: Node.js with Express
- **Port**: 3000
- **Features**:
  - RESTful API endpoints
  - 15+ error pattern matching rules
  - CORS enabled for frontend access
  - Extensible for future AI integration

### Frontend
- **Technology**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Features**:
  - Modern, accessible UI
  - API integration with error handling
  - Loading states and animations
  - XSS protection (using textContent)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download this repository**

2. **Install backend dependencies**
```powershell
cd backend
npm install
```

### Running the Application

1. **Start the backend server** (in the `backend` folder):
```powershell
npm start
```

You should see:
```
✨ DevFix API server running on http://localhost:3000
📊 Health check: http://localhost:3000/api/health
🔧 Analyze endpoint: POST http://localhost:3000/api/analyze
```

2. **Open the frontend** (in the `frontend` folder):
- Simply open `index.html` in your web browser
- Or use a local server (recommended):
```powershell
# Using Python 3
python -m http.server 8000

# Using Node.js http-server (install globally: npm install -g http-server)
http-server -p 8000
```

3. **Access the app**:
- Open http://localhost:8000 in your browser (if using a local server)
- Or just double-click `frontend/index.html`

## 📡 API Endpoints

### `GET /api/health`
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "DevFix API is running",
  "version": "1.0.0"
}
```

### `POST /api/analyze`
Analyze an error message.

**Request:**
```json
{
  "errorText": "TypeError: Cannot read properties of undefined",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "TypeError: Cannot read properties of undefined/null",
    "explanation": "You tried to access a property...",
    "causes": ["The variable was never assigned...", "..."],
    "fixes": ["Check if the variable exists...", "..."],
    "codeExample": "// Problem: Accessing property on undefined..."
  }
}
```

### `GET /api/languages`
Get list of supported languages.

### `GET /api/examples`
Get example error messages.

## 🎨 Design System

### Colors
- **Background**: `#F5F7FB` (light) / `#0F172A` (dark)
- **Primary**: `#4F46E5` (indigo)
- **Success**: `#0F9D7A` (green)
- **Text**: `#16203A` (light) / `#F1F5F9` (dark)

### Typography
- **UI Font**: Plus Jakarta Sans
- **Code Font**: JetBrains Mono

### Layout
- Max width: 860px
- Border radius: 12-16px
- Responsive breakpoints: 640px, 360px

## 🧪 Supported Error Patterns

The app recognizes 15+ common error patterns:

**JavaScript**
- TypeError (undefined/null properties)
- ReferenceError (undefined variables)
- "is not a function" errors
- SyntaxError

**Python**
- NameError
- KeyError
- IndexError
- IndentationError
- ModuleNotFoundError
- ZeroDivisionError
- AttributeError

**Java**
- NullPointerException
- ArrayIndexOutOfBoundsException
- Cannot find symbol

**C++**
- Segmentation fault
- Undefined reference
- Undeclared identifier

**Generic**
- Fallback debugging guide for unmatched errors

## 🔧 Development

### For Development (with auto-restart)
```powershell
cd backend
npm install -D nodemon
npm run dev
```

### Adding New Error Patterns

Edit `backend/server.js` and add to the `errorPatterns` array:

```javascript
{
    regex: /YourErrorPattern/i,
    languages: ['javascript'],
    title: 'Error Title',
    explanation: 'What happened...',
    causes: ['Cause 1', 'Cause 2'],
    fixes: ['Fix 1', 'Fix 2'],
    codeExample: `// Your code example`
}
```

## 🚀 Future Enhancements

### Ready for AI Integration
The backend is structured to easily add AI-powered fallback when no pattern matches:

```javascript
// In server.js, modify the analyze function:
if (!match) {
    // Call OpenAI, Claude, or other AI API
    match = await getAIExplanation(errorText, language);
}
```

### Possible Features
- User authentication and error history
- Upvote/downvote solutions
- Community-contributed error patterns
- IDE plugins (VS Code, IntelliJ)
- Real-time error detection
- Multi-language UI (i18n)

## 📝 Code Comments

Both frontend and backend code are heavily commented for the judges to understand:
- Clear section headers
- Function documentation
- Inline explanations of key logic
- Architecture notes

## 🏆 GeeksforGeeks Challenge Requirements

✅ **Tech Stack**: Single-page app (HTML + CSS + JS) with optional backend  
✅ **Core Features**: Error input, language selection, explanation, examples  
✅ **Logic**: Rule-based pattern matching (15+ patterns)  
✅ **Design**: Clean, modern, 860px max-width, rounded cards, color palette  
✅ **UX**: Empty states, smooth scrolling, copy functionality, accessible  
✅ **Comments**: Extensive documentation throughout the code  

## 📄 License

MIT License - Free to use and modify.

## 👥 Author

Created for the GeeksforGeeks DevFix Challenge 2024.

---

**Happy debugging! 🐛✨**

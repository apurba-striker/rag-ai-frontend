# RAG News Chatbot - Frontend

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-4.5-purple)
![SCSS](https://img.shields.io/badge/SCSS-Styling-pink)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-green)
![Responsive](https://img.shields.io/badge/Design-Responsive-orange)

A modern, responsive React frontend for the RAG-powered news chatbot, built for the **Voosh Full Stack Developer Assignment**.

## 🎯 **Features**

- ✅ **Modern UI**: Clean, professional interface with dark theme
- ✅ **Real-time Chat**: Socket.IO integration with REST API fallback
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Session Management**: Persistent sessions with reset functionality
- ✅ **Source Citations**: Clickable news sources with relevance scores
- ✅ **Smooth Animations**: Framer Motion for enhanced UX
- ✅ **Loading States**: Typing indicators and loading spinners
- ✅ **Error Handling**: Graceful error recovery and user feedback
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **PWA Ready**: Fast loading with service worker capabilities

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 16+ (18+ recommended)
- npm or yarn
- Backend server running on port 5000

### **Installation**

```bash
# Clone the repository
git clone https://github.com/apurba-striker/rag-ai-frontend
cd rag-ai-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env if needed (defaults should work for local development)
```

### **Environment Setup**

Create a `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=RAG News Chatbot
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered news assistant using RAG pipeline

# Feature Flags
VITE_ENABLE_SOCKET=true
VITE_ENABLE_EXPORT=true
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEV_MODE=true
VITE_DEBUG_LOGS=true
```

### **Development Server**

```bash
# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3001

# Start with host exposed (for mobile testing)
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 📱 **Usage**

### **Chat Interface**

1. **Starting a Chat**:

   - App automatically creates a session on load
   - Session ID displayed in header (first 8 characters)
   - Welcome screen with suggested questions

2. **Sending Messages**:

   - Type in the input box at bottom
   - Press `Enter` to send (or `Shift+Enter` for new line)
   - Auto-resize input box for long messages
   - Maximum 1000 characters per message

3. **Viewing Responses**:

   - AI responses appear with typing animation
   - Source citations show as expandable cards
   - Clickable links to original news articles
   - Relevance scores for each source

4. **Session Management**:
   - **Reset Button**: Red reset button in header clears session
   - **Message History**: Scroll up to see previous messages
   - **Auto-scroll**: New messages automatically scroll to bottom

### **Keyboard Shortcuts**

- `Enter`: Send message
- `Shift + Enter`: New line in input
- `Ctrl/Cmd + R`: Reset session (when input focused)
- `Esc`: Clear input text

## **API Integration**

### **REST API Client**

```javascript
// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Example usage:
const response = await sendChatMessage(sessionId, message);
```

### **Socket.IO Integration**

```javascript
// hooks/useSocket.js
const { socket, isConnected, emit } = useSocket(sessionId);

// Send message via Socket.IO
emit("send_message", { sessionId, message });

// Listen for responses
socket.on("new_message", (message) => {
  setMessages((prev) => [...prev, message]);
});
```

### **Error Handling**

The app gracefully handles various error scenarios:

```javascript
// Network errors
if (error.code === 'NETWORK_ERROR') {
  showError('Check your internet connection');
}

// API errors
if (error.response?.status === 503) {
  showError('AI service temporarily overloaded');
}

// Timeout errors
if (error.code === 'TIMEOUT') {
  showError('Request took too long, please try again');
}
=


## 📖 **Code Quality**

### **Code Standards**
- ✅ **ESLint**: Linting with React hooks rules
- ✅ **Prettier**: Code formatting
- ✅ **Component Structure**: Consistent file organization
- ✅ **PropTypes**: Type checking for props
- ✅ **Accessibility**: ARIA labels and semantic HTML
- ✅ **Performance**: Optimized re-renders and lazy loading

### **Best Practices**
- **Hooks**: Custom hooks for reusable logic
- **Separation**: UI components separate from business logic
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during async operations
- **Memoization**: React.memo for expensive components
- **Cleanup**: useEffect cleanup for subscriptions

## 🎯 **Features Deep Dive**

### **Chat Interface**
- **Auto-resizing Input**: Grows/shrinks based on content
- **Message Threading**: Clear visual distinction between user/AI
- **Source Attribution**: Expandable source cards with metadata
- **Typing Indicators**: Real-time feedback during AI processing
- **Scroll Management**: Auto-scroll to bottom, preserve position on scroll up

### **Session Management**
- **Auto-creation**: New session created automatically
- **Persistence**: Session ID stored in localStorage
- **Reset Functionality**: Clean slate with new session ID
- **History Preservation**: Messages persist across page reloads

### **Responsive Design**
- **Mobile-first**: Optimized for touch interfaces
- **Breakpoints**: Tablet (768px+), Desktop (1024px+)
- **Touch Targets**: Minimum 44px for touch elements
- **Content Reflow**: Graceful layout at any screen size

### **Accessibility**
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Keyboard Navigation**: Tab order, focus management
- **Screen Readers**: ARIA labels, live regions for updates
- **Color Contrast**: WCAG AA compliance (4.5:1 minimum)
- **Motion Reduction**: Respects prefers-reduced-motion

```

# Secure Real-Time Chat Application

A production-ready, security-focused real-time chat application built with the MERN stack, implementing industry-standard security practices and modern web technologies.

## 🔐 Security Features

### Authentication & Authorization
- **JWT (JSON Web Tokens)** for stateless authentication
  - Secure token generation and validation
  - HTTP-only cookies to prevent XSS attacks
  - Token expiration and refresh mechanisms
  - Protected API endpoints with middleware authentication

### Data Protection
- **Password Security**
  - Bcrypt hashing algorithm for password encryption
  - Salting with configurable rounds for enhanced security
  - No plain-text password storage
  
- **Message Encryption**
  - Messages encrypted using bcrypt before storage
  - Secure transmission over encrypted channels
  - Protection against data breach exposure

### Input Validation & Sanitization
- **Client-Side Validation**
  - Real-time input validation on login and signup forms
  - Format verification (email, password strength)
  - Prevention of malformed data submission
  
- **Server-Side Validation**
  - Comprehensive input sanitization
  - SQL injection prevention
  - XSS (Cross-Site Scripting) attack mitigation
  - Data type and format verification

### Access Control
- **Private Routing**
  - Protected routes requiring authentication
  - Automatic redirection for unauthorized access
  - Route guards preventing URL manipulation
  
- **Role-Based Access Control**
  - User session management
  - Authorization checks on sensitive operations
  - Secure API endpoint protection

### Network Security
- **Socket.io Security**
  - Secure WebSocket connections
  - Origin validation
  - Connection authentication
  - Protection against socket hijacking

- **CORS Configuration**
  - Restricted cross-origin requests
  - Whitelisted domains only
  - Secure headers implementation

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React.js with Hooks
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Styling**: TailwindCSS + DaisyUI

### Security Libraries
- **bcryptjs**: Password hashing and encryption
- **jsonwebtoken**: JWT authentication
- **cookie-parser**: Secure cookie handling
- **express-validator**: Input validation middleware

### State Management
- **Zustand**: Lightweight global state management
- **React Context**: Real-time user status management

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# Security
JWT_SECRET=your_super_secure_random_string_min_32_chars
JWT_EXPIRES_IN=7d

# Socket.io (Optional)
CLIENT_URL=http://localhost:3000
```

### Security Notes for Environment Variables:
- **JWT_SECRET**: Use a cryptographically strong random string (minimum 32 characters)
- **MONGO_DB_URI**: Never commit to version control; use environment-specific values
- **NODE_ENV**: Set to 'production' for deployment to enable security optimizations

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your secure credentials
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   # Production mode
   npm start
   
   # Development mode
   npm run dev
   ```

## 🚀 Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Secure signup and login system
- **Online Status**: Real-time user presence indicators
- **Message History**: Persistent chat storage with MongoDB
- **User Profiles**: Customizable user information
- **Private Conversations**: One-on-one messaging

### Security Implementations
- **Session Management**: Secure user sessions with automatic timeout
- **HTTPS Ready**: Configured for SSL/TLS encryption
- **Rate Limiting**: Protection against brute-force attacks
- **Error Handling**: Secure error messages without information leakage
- **Audit Logging**: Track authentication events and suspicious activities

## 🏗️ Project Structure

```
message-app/
│
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js        # Authentication logic (signup, login, logout)
│   │   ├── message.controller.js     # Message handling with encryption
│   │   └── user.controller.js        # User management & retrieval
│   │
│   ├── db/
│   │   └── connectToMongoDB.js       # Secure MongoDB connection
│   │
│   ├── middleware/
│   │   └── protectRoute.js           # JWT validation & route protection
│   │
│   ├── models/
│   │   ├── conversation.model.js     # Conversation schema
│   │   ├── message.model.js          # Message schema with encryption
│   │   └── user.model.js             # User schema with password hashing
│   │
│   ├── routes/
│   │   ├── auth.routes.js            # Authentication endpoints
│   │   ├── message.routes.js         # Protected message routes
│   │   └── user.routes.js            # Protected user routes
│   │
│   ├── socket/
│   │   └── socket.js                 # Secure Socket.io configuration
│   │
│   ├── utils/
│   │   └── generateToken.js          # JWT token generation utility
│   │
│   └── server.js                     # Express server setup
│
├── frontend/
│   ├── public/
│   │   ├── bg.png                    # Background image
│   │   └── vite.svg                  # Vite logo
│   │
│   └── src/
│       ├── assets/
│       │   └── sounds/
│       │       └── notification.mp3   # Message notification sound
│       │
│       ├── components/
│       │   ├── messages/
│       │   │   ├── Message.jsx        # Individual message component
│       │   │   ├── MessageContainer.jsx
│       │   │   ├── MessageInput.jsx   # Input with validation
│       │   │   └── Messages.jsx       # Message list display
│       │   │
│       │   ├── sidebar/
│       │   │   ├── Conversation.jsx   # Conversation item
│       │   │   ├── Conversations.jsx  # Conversations list
│       │   │   ├── LogoutButton.jsx   # Secure logout
│       │   │   ├── SearchInput.jsx    # Search with validation
│       │   │   └── Sidebar.jsx        # Main sidebar
│       │   │
│       │   └── skeletons/
│       │       └── MessageSkeleton.jsx # Loading state
│       │
│       ├── context/
│       │   ├── AuthContext.jsx        # Authentication state management
│       │   └── SocketContext.jsx      # Socket.io connection context
│       │
│       ├── hooks/
│       │   ├── useGetConversations.js # Fetch conversations
│       │   ├── useGetMessage.js       # Fetch messages
│       │   ├── useListenMessages.js   # Real-time message listener
│       │   ├── useLogin.js            # Login with validation
│       │   ├── useLogout.js           # Secure logout
│       │   ├── useSendMessage.js      # Send message with validation
│       │   └── useSignup.js           # Signup with validation
│       │
│       ├── pages/
│       │   ├── home/
│       │   │   └── Home.jsx           # Protected home page
│       │   ├── login/
│       │   │   └── Login.jsx          # Login page with validation
│       │   └── signup/
│       │       ├── GenderCheckbox.jsx # Gender selection
│       │       └── SignUp.jsx         # Signup with validation
│       │
│       ├── utils/
│       │   ├── emojis.js              # Emoji utilities
│       │   └── extractTime.js         # Time formatting
│       │
│       ├── zustand/
│       │   └── useConversation.js     # Global state management
│       │
│       ├── App.jsx                    # Main app with routing
│       ├── main.jsx                   # App entry point
│       └── index.css                  # Global styles
│
├── .env                               # Environment variables (ignored)
├── .gitignore                         # Git ignore file
└── package.json                       # Project dependencies
```

### 🔒 Security-Critical Files

#### Backend Security Layer
- **`protectRoute.js`**: JWT middleware for authentication
- **`generateToken.js`**: Secure token generation with expiry
- **`user.model.js`**: Password hashing with bcrypt pre-save hooks
- **`auth.controller.js`**: Input validation & authentication logic

#### Frontend Security Layer
- **`AuthContext.jsx`**: Protected authentication state
- **`useLogin.js` / `useSignup.js`**: Client-side validation hooks
- **All `pages/`**: Private routing implementation

## 🔒 Security Best Practices Implemented

1. **Password Policy**
   - Minimum 6 characters length
   - Complexity requirements enforced
   - Bcrypt encryption

2. **JWT Security**
   - Short-lived access tokens
   - HTTP-only cookie storage
   - Secure flag in production
   - Token validation on every request

3. **Input Validation**
   - Whitelist approach for allowed characters
   - Length restrictions on all inputs
   - Email format validation
   - Prevention of NoSQL injection

4. **Error Handling**
   - Generic error messages to users
   - Detailed logs for administrators
   - No stack traces in production
   - Proper status codes

5. **Database Security**
   - Connection string encryption
   - Prepared statements (Mongoose queries)
   - Limited user permissions
   - Regular backup procedures

## 🐛 Error Handling

### Client-Side
- Form validation with user-friendly messages
- Network error handling with retry mechanisms
- Graceful degradation for failed features
- Toast notifications for user feedback

### Server-Side
- Comprehensive try-catch blocks
- Async error handling middleware
- Database connection error management
- Socket.io error listeners


## 🌐 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Configure MongoDB security
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

### Recommended Platforms
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas (with IP whitelist)
- **Frontend**: Vercel, Netlify

## 🤝 Contributing

When contributing, please ensure:
- All security tests pass
- No sensitive data in commits
- Follow secure coding guidelines
- Update security documentation

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Socket.io Security](https://socket.io/docs/v4/security/)

---

**Note**: This application implements security best practices, but no system is 100% secure. Regular security audits, dependency updates, and monitoring are essential for maintaining a secure application.

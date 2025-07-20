Live Chat Translator

**Live Chat Translator** is a real-time multilingual chat application that enables seamless communication between users who speak different languages. Upon registration, each user selects their preferred language. During live chat, messages are automatically translated to the receiver's preferred language, eliminating language barriers.

---

## 🛠️ Technologies Used

### 🔧 Backend (Spring Boot):
- Java 17+
- Spring Boot
- Spring Security (JWT Authentication)
- RESTful APIs
- PostgreSQL
- Translation API (Google Cloud Translate)

### 🎨 Frontend (React):
- React.js
- Socket.IO (for real-time messaging)
- Axios (API communication)
- Tailwind CSS (UI styling)

---

## 🔑 Key Features

- 🔐 **User Registration with Preferred Language**
- 💬 **Real-Time Chat** between two users via web interface
- 🌍 **Automatic Translation** of messages to receiver's preferred language
- 👥 Secure Login using JWT Token
- 📄 Clean and responsive UI
- 🔒 Secure API endpoints

---

## 🧪 How It Works

1. **User Registration**  
   - User provides email, password, and preferred language (e.g., English, Hindi, Telugu).
2. **Login**  
   - JWT Token issued and used for secure access.
3. **Chat Interface**  
   - Messages sent in sender’s language.
   - Server detects recipient’s preferred language and auto-translates the message.
   - Translated message is delivered in real-time.

////import logo from './logo.svg';
////import './App.css';
////
////function App() {
////  return (
////    <div className="App">
////      <header className="App-header">
////        <img src={logo} className="App-logo" alt="logo" />
////        <p>
////          Edit <code>src/App.js</code> and save to reload.
////        </p>
////        <a
////          className="App-link"
////          href="https://reactjs.org"
////          target="_blank"
////          rel="noopener noreferrer"
////        >
////          Learn React
////        </a>
////      </header>
////    </div>
////  );
////}
////
////export default App;
//
//
//
//
//import React, { useState } from 'react';
//import Register from './components/Register';
//import Login from './components/Login';
//import ChatPage from './components/ChatPage'; // This will be used next
//import './App.css'; // Optional: for any global styles
//
//function App() {
//  const [user, setUser] = useState(null);
//  const [showRegister, setShowRegister] = useState(true);
//
//  return (
//    <div
//      style={{
//        minHeight: '100vh',
//        backgroundImage: "url('/background.jpg')",
//        backgroundSize: 'cover',
//        backgroundRepeat: 'no-repeat',
//        backgroundPosition: 'center',
//      }}
//    >
//      {!user ? (
//        showRegister ? (
//          <Register onRegisterSuccess={() => setShowRegister(false)} />
//        ) : (
//          <Login setUser={setUser} />
//        )
//      ) : (
//        <ChatPage user={user} />
//      )}
//
//      {!user && (
//        <div style={{ textAlign: 'center', marginTop: 10 }}>
//          {showRegister ? (
//            <button className="toggle-button" onClick={() => setShowRegister(false)}>
//              Already registered? Login
//            </button>
//          ) : (
//            <button className="toggle-button" onClick={() => setShowRegister(true)}>
//              Don’t have an account? Register
//            </button>
//          )}
//        </div>
//      )}
//    </div>
//  );
//}
//
//export default App;






//
//import React, { useState } from 'react';
//import Register from './components/Register';
//import Login from './components/Login';
//import ChatPage from './components/ChatPage';
//import './App.css';
//
//function App() {
//  const [user, setUser] = useState(null);
//  const [showRegister, setShowRegister] = useState(true);
//
//  const isLoggedIn = user !== null;
//
//  return (
//    <div
//      style={
//        isLoggedIn
//          ? {
//              minHeight: '100vh',
//              backgroundImage: "url('/background.jpg')",
//              backgroundSize: 'cover',
//              backgroundRepeat: 'no-repeat',
//              backgroundPosition: 'center',
//            }
//          : {
//              minHeight: '100vh',
//              background: '#f5f5f5',
//            }
//      }
//    >
//      {!isLoggedIn ? (
//        showRegister ? (
//          <Register onRegisterSuccess={() => setShowRegister(false)} />
//        ) : (
//          <Login setUser={setUser} />
//        )
//      ) : (
//        <ChatPage user={user} />
//      )}
//
//      {!user && (
//        <div style={{ textAlign: 'center', marginTop: 10 }}>
//          {showRegister ? (
//            <button className="toggle-button" onClick={() => setShowRegister(false)}>
//              Already registered? Login
//            </button>
//          ) : (
//            <button className="toggle-button" onClick={() => setShowRegister(true)}>
//              Don’t have an account? Register
//            </button>
//          )}
//        </div>
//      )}
//    </div>
//  );
//}
//
//export default App;





// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatPage from './components/ChatPage';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import { getUserProfile } from './services/api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserProfile().then(res => setUser(res.data)).catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <ChatPage user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} setUser={setUser} /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

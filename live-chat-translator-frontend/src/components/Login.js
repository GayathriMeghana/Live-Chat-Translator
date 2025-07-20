//import React, { useState } from 'react';
//import { login } from '../services/api';
//import './Form.css';
//
//function Login({ setUser }) {
//  const [form, setForm] = useState({ username: '', password: '' });
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const res = await login(form);
//      setUser(res.data);
//    } catch (err) {
//      alert("Login failed. Please check credentials.");
//    }
//  };
//
//  return (
//    <div className="form-container">
//      <h2>Login</h2>
//      <form onSubmit={handleSubmit}>
//        <input
//          type="text"
//          placeholder="Username"
//          required
//          value={form.username}
//          onChange={(e) => setForm({ ...form, username: e.target.value })}
//        />
//        <input
//          type="password"
//          placeholder="Password"
//          required
//          value={form.password}
//          onChange={(e) => setForm({ ...form, password: e.target.value })}
//        />
//        <button type="submit">Login</button>
//      </form>
//    </div>
//  );
//}
//
//export default Login;





//
//
//import React, { useState } from 'react';
//import { login } from '../services/api';
//import './Form.css';
//
//function Login({ setUser }) {
//  const [form, setForm] = useState({
//    username: '',
//    password: ''
//  });
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const res = await login(form);
//
//      // Save token to localStorage
//      localStorage.setItem("token", res.data.token);
//
//      // Save user info to App state
//      setUser(res.data.user);
//
//      setForm({ username: '', password: '' });
//    } catch (err) {
//      alert("Login failed. Please check credentials.");
//    }
//  };
//
//
//  return (
//    <div className="form-container">
//      <h2>Login</h2>
//      <form onSubmit={handleSubmit} autoComplete="off">
//        <input
//          type="text"
//          placeholder="Username"
//          required
//          value={form.username}
//          onChange={(e) => setForm({ ...form, username: e.target.value })}
//        />
//        <input
//          type="password"
//          placeholder="Password"
//          required
//          autoComplete="new-password"
//          value={form.password}
//          onChange={(e) => setForm({ ...form, password: e.target.value })}
//        />
//        <button type="submit">Login</button>
//      </form>
//    </div>
//  );
//}
//
//export default Login;




// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';
function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      nav('/');
    } catch {
      alert('Login failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input placeholder="Username" required value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Password" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;


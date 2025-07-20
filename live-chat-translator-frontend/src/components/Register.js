//import React, { useState } from 'react';
//import { register } from '../services/api';
//import './Form.css';
//
//function Register({ onRegisterSuccess }) {
//  const [form, setForm] = useState({
//    username: '',
//    password: '',
//    preferredLanguage: 'en'
//  });
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      await register(form);
//      alert("Registered successfully! Please login.");
//      onRegisterSuccess(); // show login
//    } catch (err) {
//      alert('Registration failed.');
//    }
//  };
//
//  return (
//    <div className="form-container">
//      <h2>Register</h2>
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
//        <select
//          value={form.preferredLanguage}
//          onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
//        >
//          <option value="en">English</option>
//          <option value="te">Telugu</option>
//          <option value="hi">Hindi</option>
//          <option value="fr">French</option>
//        </select>
//        <button type="submit">Register</button>
//      </form>
//    </div>
//  );
//}
//
//export default Register;


//
//import React, { useState } from 'react';
//import { register } from '../services/api';
//import './Form.css';
//
//function Register({ onRegisterSuccess }) {
//  const [form, setForm] = useState({
//    username: '',
//    password: '',
//    preferredLanguage: ''
//  });
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      await register(form);
//      alert("Registered successfully! Please login.");
//      setForm({ username: '', password: '', preferredLanguage: '' });
//      onRegisterSuccess(); // Switch to login screen
//    } catch (err) {
//      alert('Registration failed.');
//    }
//  };
//
//  return (
//    <div className="form-container">
//      <h2>Register</h2>
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
//          autoComplete="new-password"
//          required
//          value={form.password}
//          onChange={(e) => setForm({ ...form, password: e.target.value })}
//        />
//        <select
//          value={form.preferredLanguage}
//          onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
//          required
//        >
//          <option value="">Select Language</option>
//          <option value="en">English</option>
//          <option value="te">Telugu</option>
//          <option value="hi">Hindi</option>
//          <option value="fr">French</option>
//        </select>
//        <button type="submit">Register</button>
//      </form>
//    </div>
//  );
//}
//
//export default Register;





// src/components/Register.js
import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Form.css';
function Register() {
  const [form, setForm] = useState({ username: '', password: '', preferredLanguage: '' });
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form);
      alert('Done! Please login.');
      nav('/login');
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input placeholder="Username" required
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Password" required autoComplete="new-password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <select required onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}>
          <option value="">Preferred Language</option>
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;


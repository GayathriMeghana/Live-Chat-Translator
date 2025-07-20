// src/components/Profile.js
import React, { useState } from 'react';
import { updateUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile({ user, setUser }) {
  const [form, setForm] = useState({ ...user });
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await updateUser(form);
      setUser(res.data.user);
      alert('Profile updated!');
    } catch {
      alert('Update failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="New password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <select value={form.preferredLanguage}
            onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}>
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
        </select>
        <button type="submit">Save</button>
      </form>
      <button onClick={()=>{ localStorage.removeItem('token'); setUser(null); nav('/login'); }}>Logout</button>
    </div>
  );
}

export default Profile;

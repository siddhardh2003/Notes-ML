import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css'; // Import the CSS file containing the styling

function Form({ setUsername, endpoint }) {
  const [username, setLocalUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        // Reset form fields to empty string
        setLocalUsername('');
        setEmail('');
        setPassword('');
        // No navigation here
        navigate("/");
      } else {
        console.error('Error:', response.statusText);
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container-c1">
      <div className="form-wrapper">
        <form className="signup-form-form1" style={{marginTop :'150px'}} onSubmit={handleSubmit}>
          <h2>{endpoint}</h2>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form;

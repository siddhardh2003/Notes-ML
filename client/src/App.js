import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav';
import Register from './Components/Register';
import Form from './Components/Form';
import AboutUs from './Components/AboutUs';
import Navigating from './Components/Navigating';
import Notes from './Components/Notes';
import NoteDetail from './Components/NoteDetail';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  useEffect(() => {
    console.log('Username:', username);
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  return (
    <div className="App">
      <Router>
        <div>
          <Nav username={username} setUsername={setUsername} />
          <Routes>
            <Route path="/signin" element={<Form Un={username} setUsername={setUsername} endpoint="signin" />} />
            <Route path="/signup" element={<Form Un={username} setUsername={setUsername} endpoint="signup" />} />
            <Route path="/" element={username === null ? <Register /> : <Navigating username={username}/>} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/notes" element={<Notes username={username}/>}/>
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

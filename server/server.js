require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')



const app = express();
const port = 4000;

const corsOptions = {
  origin: 'http://localhost:7000', 
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser())

const users = [];
const notes = [];
let noteIdCounter = 1;

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
  const jwtToken = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '1d' });
  
  res.cookie('jwtToken', jwtToken, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  res.cookie('username', username, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  
  users.push({ username, email, password: hashedPassword, jwtToken });
  console.log({ username, email, password: hashedPassword, jwtToken });
  
  res.status(201).json({ message: 'Sign up successful', username: username });
});

// Sign-in endpoint
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (user) {
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      const newJwtToken = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });
      user.jwtToken = newJwtToken;

      res.cookie('jwtToken', newJwtToken, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
      res.cookie('username', user.username, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

      res.status(200).json({ message: 'Sign in successful', username: user.username });
      console.log(user.username);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

//logout endpoint
app.post('/logout', (req, res) => {
  const { username } = req.query; 
  const user = users.find(user => user.username === username);
  console.log()
  console.log(`hi ${username}`)
  
  if (user) {
    user.jwtToken = null;
    res.clearCookie('jwtToken');
    res.clearCookie('username');
    res.status(200).send('User Logged Out');
  } else {
    res.status(400).send('User not found');
  }
});


// Get notes endpoint
app.get('/notes', (req, res) => {
  const { username } = req.query;
  console.log(`notes ${username}`);
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const userNotes = notes.filter(note => note.username === username);
  res.status(200).json(userNotes);
});

app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = notes.find(note => note.id == id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Add a new note endpoint
app.post('/notes', (req, res) => {
  const { username, title, content } = req.body;

  if (!username || !title || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const newNote = {
    id: noteIdCounter++,
    username,
    title,
    content,
    formattedDate,
  };

  notes.push(newNote);
  console.log(newNote);

  res.status(201).json(newNote);
});

// Delete a note endpoint
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.status(200).json({ message: 'Note deleted successfully' });
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

// Endpoint for prediction
app.post('/api/predict', async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post('http://127.0.0.1:5000/predict', req.body);

    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).send('Error in fetching prediction');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint for summarization
app.post('/api/summarize', async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post('http://127.0.0.1:5000/summarize', req.body);

    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).send('Error in fetching summary');
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

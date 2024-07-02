const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const users = [];
const notes = [];
let noteIdCounter = 1;

// Sign-up endpoint
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ username, email, password });
  console.log({ username, email, password });
  res.status(201).json({ message: 'Sign up successful', username: username });
});

// Sign-in endpoint
app.post('/signin', (req, res) => {
  const { username, email, password } = req.body;
  
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    res.status(200).json({ message: 'Sign in successful', username: user.username });
    console.log(user.username);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get notes endpoint
app.get('/notes', (req, res) => {
  const { username } = req.query;
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

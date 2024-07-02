import React, { useState, useEffect } from 'react';
import './Notes.css';
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';

const Notes = ({ username }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try 
      {
        console.log("i an sending GET request");
        const response = await fetch(`http://localhost:4000/notes?username=${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) 
        {
          const data = await response.json();
          setNotes(data);
        } 
        else {
          console.error('Error:', response.statusText);
        }
      } 
      catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [username]);

  useEffect(() => {
    const filteredNotes_dup = notes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredNotes(filteredNotes_dup);
  }, [notes, searchQuery]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, title, content }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        setTitle('');
        setContent('');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleView = (id) => {
    navigate(`/notes/${id}`);
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return <div className="notes-container">Loading...</div>;
  }

  return (
    <div className="notes-container">
      <div className="form-container">
        <form className="notes-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="Title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Description" className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className='Notebuttons'>
            <button type="submit" className='AddButton' style={{margin:'auto', backgroundColor:'green'}}>Add Note</button>
          </div>
        </form>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Noteitem
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              formattedDate={note.formattedDate}
              handleDelete={handleDelete}
              handleView={handleView}
            />
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Notes;

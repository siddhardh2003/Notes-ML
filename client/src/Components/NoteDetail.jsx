import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NoteDetail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [summary, setSummary] = useState("Please wait  loading....");
  const [viewSummary, setViewSummary] = useState(false);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:4000/notes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNote(data);
        } else {
          console.error('Error fetching note:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);
 
  useEffect(() => {
    const fetchSummary = async () => {
      if (note && !viewSummary) {
        try {
          const response = await fetch('http://localhost:4000/api/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: note.content }),
          });
  
          if (response.ok) {
            const data = await response.json();
            setSummary(data.summary);
          } else {
            console.error('Error making summary:', response.statusText);
          }
        } catch (error) {
          console.error('Error making summary:', error);
        }
      }
    };
    fetchSummary();
  }, [note, viewSummary]);

  const handleViewSummary = () => {
    // while(summary=="loading");
    setViewSummary(!viewSummary);
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context: note.content, question }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.answer);
      } else {
        console.error('Error making prediction:', response.statusText);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <>
      <div className='MainDiv'>
        <div className='Title'>
          <h2>{note.title}</h2>
        </div>
        <div className='Title'>
          <p>{note.content}</p>
        </div>
        <div className='Title'>
          <p>{note.formattedDate}</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button className='AddButton' onClick={handleViewSummary}>
            {viewSummary ? "Hide Summary" : "View Summary"}
          </button>
        </div>
        {viewSummary && (
          <div className='Title'>
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
      <div className='ML'>
        <div className='QnsAns'>
          <div className="form-wrapper">
            <form className="signup-form-form1" style={{ marginTop: '30px' }} onSubmit={handlePredictSubmit}>
              <div className="mb-3">
                <label htmlFor="question" className="form-label">Question</label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter question"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
              {prediction && (
                <div className="mt-3">
                  <h3>Prediction</h3>
                  <p>{prediction}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteDetail;

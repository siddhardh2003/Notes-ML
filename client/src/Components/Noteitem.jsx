import React from 'react';
import './Noteitem.css';  // Ensure you import the CSS file

export default function Noteitem({ id, title, content, formattedDate, handleDelete,handleView }) {
  // Split the content into words and take the first 8 words
  let words = content.split(" ");
  let displayContent = words.slice(0, 8).join(" ") + (words.length > 8 ? '...' : '');

  return (
    <div className="Notecard" >
      <div className='CardBody'onClick={()=>{handleView(id)}}>
        <div className="Title">
          <h3>{title}</h3>
        </div>
        <div className="Description">
          <p>
            {displayContent}
          </p>
        </div>
      </div>
      <div className="NoteFooter">
        <button type="delete" className="DeleteButton" onClick={() => { handleDelete(id) }}>Delete</button>
        <p className="NoteDate">{formattedDate}</p>
      </div>
    </div>
  );
}

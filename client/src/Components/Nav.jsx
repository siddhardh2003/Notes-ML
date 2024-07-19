import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';
import { useNavigate } from 'react-router-dom';

const Nav = ({ username, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    try {
      const response = await fetch(`http://localhost:4000/logout?username=${username}`, {
        method: 'POST',
        credentials: 'include',
      });
    
      const data = await response.text(); 
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setUsername(null);
    navigate('/');
  };

  const handleNavigation = (event, path) => {
    event.preventDefault();
    if (username) {
      navigate(path);
    } else {
      navigate('/signin'); // Redirect to sign-in if username is null
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-nav  ">
          <a className="nav-link ab" href="/" onClick={(e) => handleNavigation(e, '/')}>Home</a>
          <a className="nav-link ab" href="/aboutus" onClick={(e) => handleNavigation(e, '/aboutus')}>About Us</a>
        </div>
        <div>
          <span className='Heading'>Notes</span>
        </div>
        <div className='navbar-nav'>
          {username ? (
            <>
              <a className="nav-link " onClick={handleLogout}>Logout</a>
              {/* <span className="Heading">{username}</span> */}
            </>
          ) : (
            <>
              <a className="nav-link" href="/signin">Sign In</a>
              <a className="nav-link" href="/signup">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;

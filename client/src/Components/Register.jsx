import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css'
export default function Register({username}) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
    
    <div className="container">
        
      <h3>Sign in to your Account!</h3>
      <button className="log"onClick={handleSignIn}>
        Sign In
      </button>
      <button className="reg" onClick={handleSignUp}>
        Sign Up
      </button>
    
    </div>
    </>
    
  );
}

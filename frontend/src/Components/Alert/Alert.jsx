// Alert.js
import React from 'react';
import './Alert.css'; // Import a CSS file for styling

const Alert = ({ message }) => {
  return (
    <div className="alert-container">
      <div className="alert-message">
        {message}
      </div>
    </div>
  );
};

export default Alert;

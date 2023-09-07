import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  
    const modalStyles = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: '10px' // Rounded corners
  };

  const contentStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '10px' // Rounded corners
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <h3>How to use</h3>
        <ol>
            <li>Upload a video of your golf swing</li>
            <li>Wait 3-5 seconds for the model to load</li>
            <li>Play the video and the model will automatically start</li>
            <li>Use the in video control bar to navigate through your video</li>
            <li>Optional: toggle various menu options</li>
        </ol>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;

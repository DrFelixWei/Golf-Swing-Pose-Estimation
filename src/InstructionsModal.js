import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  
    // blocks screen
    const modalStyles = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 20 
  };

    // modal content
    const contentStyles = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        transform: 'translate(-10vw, -10vh)',
        width: '80vw',
        maxWidth: '600px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px', // Rounded corners
        zIndex: 20
    };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <h3>How to use</h3>
        <ol>
            <li>Upload a video of your golf swing</li>
            <li>Wait 3-5 seconds for the model to load</li>
            <li>Play the video and the model will automatically start</li>
            <li>Use the in video control bar to navigate through your video and adjust playback speed</li>
            <li>Optional: toggle menu options as needed</li>
        </ol>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;

import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';


function App() {

  // Handle user uploading video source
  const [videoSourceURL, setVideoSourceURL] = useState(null);
  function handleVideoUpload(event) {
    const file = event.target.files[0];
    const videoObjectUrl = URL.createObjectURL(file);
    setVideoSourceURL(videoObjectUrl);
  }

  // Get any metadata you need
  function getVideoMetadata(event) {
    const { videoWidth, videoHeight } = event.target;
  }

  // Variable to hold current frame image
  const currentFrame = useRef(null);

  // Using timeupdate event listeners on video to capture and update currentFrame variable
  // current rate ~3 fps 
  const videoRef = useRef(null);
  async function captureFrame() {
    const video = videoRef.current;
    try {
      const frameBitmap = await createImageBitmap(video);
      const canvas = document.createElement('canvas');
      canvas.width = frameBitmap.width;
      canvas.height = frameBitmap.height;
      const context = canvas.getContext('2d');
      context.drawImage(frameBitmap, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      currentFrame.current = imageData;
      console.log("currentFrame.current", currentFrame.current)
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  }

  // Variable to hold current frame with pose estimation drawn on



  // Variable to hold if currently pose estimation in progress already


  // POSE ESTIMATION
    // Set pose estimation in progress variable to true



    // Draw and update variable to hold current frame with pose estimation drawn on



    // Set pose estimation in progress variable to false



  // Add event listener / trigger for whenever currentFrameWithPose is updated and is not null to display it on canvas



  
  return (
    <div>

      {/* Button for user to upload video */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />


      {videoSourceURL && (
        <video
          src={videoSourceURL}
          style={{ width: "300px" }}
          controls
          muted
          onLoadedMetadata={getVideoMetadata}
          onTimeUpdate={captureFrame}
          ref={videoRef}
        ></video>
      )}





    </div>
  );
}

export default App;

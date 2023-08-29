import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';

import { readyTf } from './PoseEstimation';


function App() {

  // Handle user uploading video source
  const [videoSourceURL, setVideoSourceURL] = useState(null);
  function handleVideoUpload(event) {
    const file = event.target.files[0];
    const videoObjectUrl = URL.createObjectURL(file);
    setVideoSourceURL(videoObjectUrl);
  }

  // Get video metadata needed to ready and warmup tensorflow model
  const videoWidth = useRef(0);
  const videoHeight = useRef(0);
  const [tfReady, setTfReady] = useState(false);
  async function getVideoMetadata(event) {
    videoWidth.current = event.target.videoWidth;
    videoHeight.current = event.target.videoHeight;

    // Ready and warmup model
    setTfReady(false);
    let tfIsReady = await readyTf(videoWidth.current, videoHeight.current);
    setTfReady(tfIsReady);
  }

  // Variable to hold current frame image
  const currentFrame = useRef(null);

  // Using timeupdate event listeners on video to capture and update currentFrame variable
  // current rate ~4 fps 
  const videoRef = useRef(null);
  async function captureFrame() {
    console.log("captureFrame started!")
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
      // console.log("currentFrame.current", currentFrame.current)
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  }

  // Variable to hold current frame with pose estimation drawn on
  const poseFrame = useRef(null);

  // Variable to hold if currently pose estimation in progress already
  const poseInProgress = useRef(false);



  // POSE ESTIMATION
  async function getPose() {
  
    // Set pose estimation in progress variable to true
    poseInProgress.current = true;


    // Draw and update variable to hold current frame with pose estimation drawn on



    // Set pose estimation in progress variable to false
    poseInProgress.current = false;
  }


  // Add event listener / trigger for whenever currentFrameWithPose is updated and is not null to display it on canvas



  
  return (
    <div>

      {/* Button for user to upload video */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {/* Button to start pose estimation */}
      {tfReady && (
        <button onClick={getPose}>Get Pose</button>
      )}


      {/* Video display */}
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

import './App.css';
import React, { useState, useRef } from 'react';

import { readyTf, drawPose } from './PoseEstimation';

function App() {

  // Handle user uploading video source
  const [videoSourceURL, setVideoSourceURL] = useState(null);
  function handleVideoUpload(event) {
    const file = event.target.files[0];
    const videoObjectUrl = URL.createObjectURL(file);
    setVideoSourceURL(videoObjectUrl);
    setPoseFrame(null); // empty pose frame from previous
  }

  // Variable to hold tensorflow model
  const detector = useRef(null);

  // Get video metadata needed to ready and warmup tensorflow model
  const videoWidth = useRef(0);
  const videoHeight = useRef(0);
  async function getVideoMetadata(event) {
    videoWidth.current = event.target.videoWidth;
    videoHeight.current = event.target.videoHeight;

    // Ready and warmup model
    detector.current = await readyTf(videoWidth.current, videoHeight.current);
  }

  // Variable to hold current frame image
  const currentFrame = useRef(null);

  // Using timeupdate event listeners on video to capture and update currentFrame variable
  // current rate ~4 fps 
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
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      currentFrame.current = imageData;
      // console.log("currentFrame.current", currentFrame.current)
      // For some reason can't add width and length properties to currentFrame.current w/o causing video issues

      try {

        // Start pose estimation on current frame
        getPose();

      } catch (error) { console.log("Error getting pose:", error) }
    } catch (error) { console.error('Error capturing frame:', error); }
  }
  
  // Variable to hold if currently pose estimation in progress already
  const poseInProgress = useRef(false);

  // Variable to hold current frame with pose estimation drawn on
  // const poseFrame = useRef(null);
  const [poseFrame, setPoseFrame] = useState(null);


  // POSE ESTIMATION
  async function getPose() {

    // Exit early and do not getPose if still processing previous one
    if (poseInProgress.current) { return }
  
    // Set pose estimation in progress variable to true
    poseInProgress.current = true;

    // Draw and update variable to hold current frame with pose estimation drawn on
    let poseframe = await drawPose(detector.current, currentFrame.current, videoWidth.current, videoHeight.current)
    setPoseFrame(poseframe)

    // Set pose estimation in progress variable to false
    poseInProgress.current = false;

  }

  // Toggle curtain element layer to hide video and show only pose element
  const [videoHidden, setVideoHidden] = useState(false);
  function hideVideo() {
    setVideoHidden(!videoHidden);
  }


  return (
    <div className='content'>

      {/* Button for user to upload video */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />


      {/* Button for toggling only pose no video */}
      {videoSourceURL && (
        <button onClick={hideVideo}>{!videoHidden ? 'Hide Video' : 'Show Video'}</button>
      )}
      


      <div id="videoContainer" className="video-container">
        {/* Video display */}
        {videoSourceURL && (
          <video
            id="custom-video"
            className="custom-video"
            src={videoSourceURL}
            controls
            muted
            onLoadedMetadata={getVideoMetadata}
            onTimeUpdate={captureFrame}
            ref={videoRef}
          ></video>
        )}

        {/* Pose estimation drawing */}
        {poseFrame && (
          <img 
            src={poseFrame} alt="Pose Frame" 
            className="pose"
            // style={{ display: "none" }}
          />
        )}

        {videoHidden && (
          <div className = "curtain" 
            // style={}
          ></div>
        )}


      </div>

      <div id="curtain">
      </div>


      {/* {poseFrame && (<img src={poseFrame} alt="Pose Frame" />)} */}



    </div>
  );
}

export default App;

import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { readyTf, drawPose, calculateStats } from './PoseEstimation';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InstructionsModal from './components/InstructionsModal';

function Main() {
  const [videoSourceURL, setVideoSourceURL] = useState(null);
  function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const videoObjectUrl = URL.createObjectURL(file);
      setVideoSourceURL(videoObjectUrl);
      setPoseFrame(null); // empty pose frame from previous
    }
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
  const [poseData, setPoseData] = useState(null);
  const [poseStats, setPoseStats] = useState(null);

  // POSE ESTIMATION
  async function getPose() {

    // Exit early and do not getPose if still processing previous one
    if (poseInProgress.current) { return }
  
    // Set pose estimation in progress variable to true
    poseInProgress.current = true;

    // Draw and update variable to hold current frame with pose estimation drawn on
    const result = await drawPose(detector.current, currentFrame.current, 
      videoWidth.current, videoHeight.current, 
      colourEnabled);

    if (result) { 
      const { pose, poseImage } = result
      setPoseFrame(poseImage)

      if (pose) {
        setPoseData(pose)
        const stats = calculateStats(pose)
        setPoseStats(stats)
      }
    } 

    // Set pose estimation in progress variable to false
    poseInProgress.current = false;

  }

  // Toggle curtain element layer to hide video and show only pose element
  const [videoHidden, setVideoHidden] = useState(false);
  function hideVideo() {
    setVideoHidden(!videoHidden);
  }

  // Toggle curtain element layer to hide video and show only pose element
  const [colourEnabled, setColourEnabled] = useState(false);
  function enableColour() {
    setColourEnabled(!colourEnabled);
    getPose();
  }

  // Instructions modal
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const openModal = () => {
    setIsInstructionsModalOpen(true);
  };
  const closeModal = () => {
    setIsInstructionsModalOpen(false);
  };



  return (
    <>
      <Header 
        openModal={openModal} 
      />

      <InstructionsModal isOpen={isInstructionsModalOpen} onClose={closeModal} />


      <Dashboard 
        handleVideoUpload={handleVideoUpload}
        setVideoSourceURL={setVideoSourceURL}
        videoSourceURL={videoSourceURL}
        poseData={poseData}
        poseStats={poseStats}
        videoHidden={videoHidden}
        hideVideo={hideVideo}
        colourEnabled={colourEnabled}
        enableColour={enableColour}
      />

      {/* <Pose/> */}
      <Box sx={{ 
          position: 'relative',
          maxWidth: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        {/* Video display */}
        {videoSourceURL && (
          <video
            src={videoSourceURL}
            ref={videoRef}
            controls
            muted
            onLoadedMetadata={getVideoMetadata}
            onTimeUpdate={captureFrame}
            style={{
              zIndex: 1,
              position: 'absolute',
              height: '60vh',
              maxWidth: '100vh',
              overflowX: 'hidden',
            }}
          ></video>
        )}

        {/* Pose estimation drawing */}
        {poseFrame && (
          <img className="pose"
            src={poseFrame} alt="Pose Frame" 
            // style={{width:videoWidth , height:videoHeight}}
          />
        )}

        {videoHidden && (
          <Box 
            sx={{
              zIndex: 2, 
              backgroundColor: 'black',
              position: 'absolute',
              width: '101%',
              height: '85%',
              overflowX: 'hidden',
              pointerEvents: 'none', 
            }}
          ></Box>
        )}

      </Box>

    </>
  );
}

export default Main;

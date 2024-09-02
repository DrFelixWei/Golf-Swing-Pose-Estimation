import React, { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
// import Pose from './Pose';
import InstructionsModal from './InstructionsModal';
import { readyTf, drawPose } from './PoseEstimation';
import IconGolfer2 from './Icon_Golfer2.png';

function Main() {


  // Handle user uploading video source
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


  // POSE ESTIMATION
  async function getPose() {

    // Exit early and do not getPose if still processing previous one
    if (poseInProgress.current) { return }
  
    // Set pose estimation in progress variable to true
    poseInProgress.current = true;

    // Draw and update variable to hold current frame with pose estimation drawn on
    let poseframe = await drawPose(detector.current, currentFrame.current, 
                                    videoWidth.current, videoHeight.current, 
                                    colourEnabled)
    setPoseFrame(poseframe)

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='content-container'>
      <div className='content'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h2">SwingSync</Typography>

          <img 
            src={IconGolfer2} 
            alt="golfer_icon"
            style={{ height: '70px', filter: 'invert(1)' }} 
          />
        </Box>

        {/* DASHBOARD */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)', // Frosted glass effect
            backdropFilter: 'blur(1px)', // Blur effect
            borderRadius: '10px', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >

          <Box>
            <button onClick={openModal}>See Instructions</button>
            <InstructionsModal isOpen={isModalOpen} onClose={closeModal} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>

          <Typography variant="body">Upload Video: </Typography>
          <input className="button_uploadVideo"
            type="file" accept="video/*" onChange={handleVideoUpload} 
          />
          </Box>


          {videoSourceURL &&  
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body">Options: </Typography>
              <button 
                onClick={hideVideo}>{!videoHidden ? 'Hide Video' : 'Show Video'}
              </button>
              <button 
                onClick={enableColour}>{!colourEnabled ? 'Enable Coloured Limbs' : 'Disable Coloured Limbs'}
              </button>
            </Box>
          }
        </Box>

        {/* <Pose/> */}
        <Box sx={{ 
            position: 'relative',
            maxWidth: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '40px'
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
                width: '100%',
                maxWidth: '100vh',
                height: '85%',
                overflowX: 'hidden',
                pointerEvents: 'none', 
              }}
            ></Box>
          )}

        </Box>

      </div>
    </div>
  );
}

export default Main;

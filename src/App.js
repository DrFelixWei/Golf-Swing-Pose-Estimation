import React, { useState, useEffect, useRef } from 'react';

import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';


function App() {

  // Handle user uploading video source


  // Variable to hold current frame image


  // Add timeupdate event listeners to video to update currentFrame variable


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

      {/* Display video controls with no visible video */}





    </div>
  );
}

export default App;

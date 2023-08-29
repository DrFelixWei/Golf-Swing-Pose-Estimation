import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';

import {drawKeypoint, drawLine} from './PoseDrawing';


// Load BlazePoze
const model = poseDetection.SupportedModels.BlazePose;
const detectorConfig = {
  runtime: 'tfjs',
  modelType: 'full'
};
console.log("BlazePose loaded!")

// Ready and warmup tensorflow
export async function readyTf(videoHeight, videoWidth) {
  console.log("TF WARMING UP...")

  await tf.ready();
  console.log("TF READY...")

  // Warmup
  const detector = await poseDetection.createDetector(model, detectorConfig);
  // Create a warm-up tensor filled with zeros
  const warmUpTensor = tf.fill([videoHeight, videoWidth, 3],0,'float32');
  // Perform a dummy inference for warm-up
  await detector.estimatePoses(warmUpTensor, {
    maxPoses: detectorConfig.maxPoses,
    flipHorizontal: false
  });
  // Dispose of the warm-up tensor
  warmUpTensor.dispose();
  console.log("TF READY and WARMED UP!");

  // Return warmed up detector to app.js
  return detector;
}


// Draw pose image
export async function drawPose(detector, currentFrame, width, height) {

  // Create pose with model from current frame
  const pose = await detector.estimatePoses(currentFrame);

  // Create and setup canvas to draw pose on
  const canvas = document.createElement('canvas')
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  // Iterate through each keypoint and draw it onto canvas
  pose.forEach((item) => {
    item.keypoints.forEach((keypoint) => {
      drawKeypoint(context, keypoint.name, keypoint.x, keypoint.y, keypoint.z)
    });
  }); 
  // Have to do a seperate calculation for head 
    // add later if can get ears. currently could do eye to eye for forehead but not really aligned


  // Connect keypoints to draw skeleton pose
  if (pose.length !== 0) {
    // hips
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_hip")
      )
    // shoulders
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder")
      )


    // neck spine
      // add later if do head
      
    // back spine
      // create keypoint center shoulders
      let center_shoulders_x = (pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").x + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").x) / 2
      let center_shoulders_y = (pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").y + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").y) / 2
      let center_shoulders_z = (pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").z + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").z) / 2
      let keypoint_center_shoulders = { name: "center_shoulders", x: center_shoulders_x, y: center_shoulders_y , z: center_shoulders_z}
      // create keypoint center hips
      let center_hips_x = (pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").x + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").x) / 2
      let center_hips_y = (pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").y + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").y) / 2
      let center_hips_z = (pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").z + 
            pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").z) / 2
      let keypoint_center_hips = { name: "center_hips", x: center_hips_x, y: center_hips_y , z: center_hips_z}
    drawLine(context, keypoint_center_shoulders, keypoint_center_hips)   

    // upper arm left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow")
      )
    // upper arm right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow")
      )
    // lower arm left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist")
      )
    // lower arm right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist")
      )
    // hand left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_index")
      )
    // hand right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_index")
      )    
    // upper leg left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_knee")
      )
    // upper leg right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_knee")
      )
    // lower leg left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_knee"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_heel")
      )
    // lower leg right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_knee"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_heel")
      )
    // foot left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_heel"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_foot_index")
      )
    // foot right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_heel"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_foot_index")
      )         
  }




  // Create an iamge from the canvas to return to app.js as poseFrame variable
  var poseImage = new Image();
  return poseImage;
}
  






// Angles to measure
  // ears to eyes to measure angle of head
  // hip angle
  // head drop
  // shoulder rotation
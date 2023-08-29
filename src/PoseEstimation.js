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
  console.log("pose", pose)

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
      // upper arms
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow")
        )
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow")
        )
      // lower arms
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist")
        )
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist")
        )
      // hands
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "left_index")
        )
      drawLine(context, 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"), 
        pose[0].keypoints.find(keypoint => keypoint.name === "right_index")
        )        
      // neck spine
      // back spine
      // upper legs
      // lower legs

        
      // console.log("context", context)
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
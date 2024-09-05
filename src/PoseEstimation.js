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
  console.log("TF WARMED UP")

  await detector?.estimatePoses(warmUpTensor, {
    maxPoses: detectorConfig.maxPoses,
    flipHorizontal: false
  });
  // Dispose of the warm-up tensor
  warmUpTensor.dispose();
  console.log("TF READY and WARMED UP!");

  // Return warmed up detector to app.js
  return detector;
}

const poseFrameData = {}

// Draw pose image
export async function drawPose(detector, currentFrame, width, height, colourEnabled) {

  // Create pose with model from current frame
  const pose = await detector?.estimatePoses(currentFrame);
  if (!pose) { return} 

  // Create and setup canvas to draw pose on
  const canvas = document.createElement('canvas')
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  // Iterate through each keypoint and draw it onto canvas
  pose.forEach((item) => {
    item.keypoints.forEach((keypoint) => {
      poseFrameData[keypoint.name] = { "x":keypoint.x, "y":keypoint.y, "z":keypoint.z}
      // console.log(poseFrameData)
      drawKeypoint(context, keypoint.name, keypoint.x, keypoint.y, keypoint.z, colourEnabled)
    });
  }); 

  // Have to do a seperate calculation for head 
    // add later if can get ears. currently could do eye to eye for forehead but not really aligned
    // Using nose for now


  // Connect keypoints to draw skeleton pose
  if (pose.length !== 0) {
    // hips
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_hip"),
      colourEnabled
      )
    // shoulders
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder"),
      colourEnabled
      )
    // upper arm left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"),
      colourEnabled
      )
    // upper arm right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"),
      colourEnabled
      )
    // lower arm left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"),
      colourEnabled
      )
    // lower arm right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"),
      colourEnabled
      )
    // hand left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_index"),
      colourEnabled
      )
    // hand right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_index"),
      colourEnabled
      )    
    // upper leg left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_knee"),
      colourEnabled
      )
    // upper leg right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_hip"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_knee"),
      colourEnabled
      )
    // lower leg left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_knee"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_heel"),
      colourEnabled
      )
    // lower leg right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_knee"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_heel"),
      colourEnabled
      )
    // foot left
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_heel"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "left_foot_index"),
      colourEnabled
      )
    // foot right
    drawLine(context, 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_heel"), 
      pose[0].keypoints.find(keypoint => keypoint.name === "right_foot_index"),
      colourEnabled
      )  
      
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
    drawLine(context, keypoint_center_shoulders, keypoint_center_hips,colourEnabled)    
    
    // neck spine // add later if do head
    drawLine(context, pose[0].keypoints.find(keypoint => keypoint.name === "nose"), keypoint_center_shoulders,colourEnabled)


    // drawStats(context, "TEST")
  }


  // Create an iamge from the canvas to return to app.js as poseFrame variable
  const poseImage = canvas.toDataURL('image/png');
  return { pose, poseImage};
}

export function calculateViewType(data) { 
  const footLength = (Math.abs(data.left_heel.x - data.left_toe.x) + Math.abs(data.right_heel.x - data.right_toe.x)/2)
  const footDistance = (Math.abs(data.left_heel.x - data.right_heel.x) + Math.abs(data.left_toe.x - data.right_toe.x)/2)
  if (footLength > footDistance) {
    return "side"
  } else {
    return "front"
  }
}

export function calculateStats(pose) {
  // get view type
  if (pose.length === 0) { return }

  const viewType = calculateViewType({
    "left_heel" : pose[0].keypoints.find(keypoint => keypoint.name === "left_heel"),
    "left_toe" : pose[0].keypoints.find(keypoint => keypoint.name === "left_foot_index"),
    "right_heel" : pose[0].keypoints.find(keypoint => keypoint.name === "right_heel"),
    "right_toe" : pose[0].keypoints.find(keypoint => keypoint.name === "right_foot_index"),
  })
  console.log("viewType", viewType)

  if (viewType === "side") {
    let hipLean = (pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").y 
        - pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").y) / 
        (pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").x 
        - pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").x)

    let shoulderLean = (pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").y 
          - pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").y) / 
          (pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").x 
          - pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").x)

    let headDrop = pose[0].keypoints.find(keypoint => keypoint.name === "nose").y 
        - (pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").y 
        + pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").y) / 2

    let leftWristAngle = calculateAngle(
    pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"),
    pose[0].keypoints.find(keypoint => keypoint.name === "left_index"),
    pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"))

    let rightWristAngle = calculateAngle(
    pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"),
    pose[0].keypoints.find(keypoint => keypoint.name === "right_index"),
    pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"))

    let poseStats = {
      "Hip Lean": (hipLean * 100).toFixed(1),
      "Shoulder Lean": shoulderLean.toFixed(1),
      "Head Drop": headDrop.toFixed(1),
      "Left Wrist Angle": leftWristAngle.toFixed(1),
      "Right Wrist Angle": rightWristAngle.toFixed(1),
    }
    return poseStats

  } else if (viewType === "front") {
    let hipLean = (pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").y 
                    - pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").y) / 
                    (pose[0].keypoints.find(keypoint => keypoint.name === "right_hip").x 
                    - pose[0].keypoints.find(keypoint => keypoint.name === "left_hip").x)

    let shoulderLean = (pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").y 
                      - pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").y) / 
                      (pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").x 
                      - pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").x)

    let headDrop = pose[0].keypoints.find(keypoint => keypoint.name === "nose").y 
                    - (pose[0].keypoints.find(keypoint => keypoint.name === "left_shoulder").y 
                    + pose[0].keypoints.find(keypoint => keypoint.name === "right_shoulder").y) / 2

    let leftWristAngle = calculateAngle(
      pose[0].keypoints.find(keypoint => keypoint.name === "left_wrist"),
      pose[0].keypoints.find(keypoint => keypoint.name === "left_index"),
      pose[0].keypoints.find(keypoint => keypoint.name === "left_elbow"))

    let rightWristAngle = calculateAngle(
      pose[0].keypoints.find(keypoint => keypoint.name === "right_wrist"),
      pose[0].keypoints.find(keypoint => keypoint.name === "right_index"),
      pose[0].keypoints.find(keypoint => keypoint.name === "right_elbow"))

    let poseStats = {
      "Hip Lean": (hipLean * 100).toFixed(1),
      "Shoulder Lean": shoulderLean.toFixed(1),
      "Head Drop": headDrop.toFixed(1),
      "Left Wrist Angle": leftWristAngle.toFixed(1),
      "Right Wrist Angle": rightWristAngle.toFixed(1),
    }
    return poseStats

  } else {
    console.log("ERROR")
  }


}

function calculateAngle(a, b, c) {
  const vector1 = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const vector2 = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  // Calculate the dot product of the vectors
  const dotProduct = (vector1.x * vector2.x) + (vector1.y * vector2.y);

  // Calculate the magnitude of the vectors
  const magnitude1 = Math.sqrt((vector1.x ** 2) + (vector1.y ** 2));
  const magnitude2 = Math.sqrt((vector2.x ** 2) + (vector2.y ** 2));

  // Calculate the angle in radians
  const angleInRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));

  // Convert the angle to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  return angleInDegrees;
}


// Angles to measure -> use to colour skeleton to indicate good or bad form
  // ears to eyes to measure angle of head
  // hip angle
  // head drop
  // shoulder rotation
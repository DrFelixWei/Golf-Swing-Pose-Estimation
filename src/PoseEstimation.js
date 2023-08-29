import React, { useState, useEffect, useRef } from 'react';

import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';

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
export async function drawPose(detector, poseFrame, width, height) {
  // console.log(poseFrame, width, height)


  // Create and setup canvas to draw pose on
  const canvas = document.createElement('canvas')




  // Image to return to app.js as 
  var pose = new Image();
  return pose;
}

  


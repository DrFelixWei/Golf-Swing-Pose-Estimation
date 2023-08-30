export function drawKeypoint(context, name, x, y, z) {

   // not using z for now because not rendering in 3d space, will use in angle measurement later

   // Filter out undesired keypoints
   const targetKeypoints = ["left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
                             "left_wrist", "right_wrist", "left_index", "right_index", "left_hip", "right_hip",
                             "left_knee", "right_knee", "left_heel", "right_heel",
                             "left_foot_index", "right_foot_index", "nose"];
   if (targetKeypoints.includes(name)) {
     // Draw keypoint white
     context.fillStyle = 'white';
     // Draw keypoint location and size
      // context.fillRect(x, y, 10, 10); // square keypoint
     // circle kepoint
     context.beginPath();
     context.arc(x, y, 4, 0, 2 * Math.PI); // Parameters: (x, y, radius, startAngle, endAngle)
     context.fill();
     context.closePath();
   }
}

export function drawLine(context, keypoint1, keypoint2) {

  var startX = keypoint1.x;
  var startY = keypoint1.y;
  var endX = keypoint2.x;
  var endY = keypoint2.y;

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = 'white'; // change this later to depend on angles measured correct or not
  context.lineWidth = 2;
  context.stroke();
}

// Angles to measure
  // ears to eyes to measure angle of head
  // measure eye direction using ears and eyes?
  // hip angle
  // head drop
  // shoulder rotation
export function drawKeypoint(context, name, x, y, z, colourEnabled) {

  // not using z for now because not rendering in 3d space, will use in angle measurement later

  // Filter out undesired keypoints
  const targetKeypoints = ["left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
                             "left_wrist", "right_wrist", "left_index", "right_index", "left_hip", "right_hip",
                             "left_knee", "right_knee", "left_heel", "right_heel",
                             "left_foot_index", "right_foot_index", "nose"];
  if (targetKeypoints.includes(name)) {
    // Draw keypoint colour
    let colour = 'white';
    if (colourEnabled) { colour = getColour(name) }
    context.fillStyle = colour; 
    
    // Draw keypoint location and size
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI); // Parameters: (x, y, radius, startAngle, endAngle)
    context.fill();
    context.closePath();
  }
}

export function drawLine(context, keypoint1, keypoint2, colourEnabled) {

  var startX = keypoint1.x;
  var startY = keypoint1.y;
  var endX = keypoint2.x;
  var endY = keypoint2.y;

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  // Draw line colour
  let colour = 'white';
  if (colourEnabled) { colour = getColour(keypoint1.name) }
  context.strokeStyle = colour; 
  // Draw line 
  context.lineWidth = 2;
  context.stroke();
}

// Returns unique colour for each limb 
function getColour(name) {
  switch (name) {
    case 'left_shoulder':
    case 'left_elbow':
    case 'left_wrist':
    case 'left_index':
      return 'red'

    case 'right_shoulder':
    case 'right_elbow':
    case 'right_wrist':
    case 'right_index':
      return 'green'

    case 'left_hip':
    case 'left_knee':
    case 'left_heel':
    case 'left_foot_index':
      return 'blue'

    case 'right_hip':
    case 'right_knee':
    case 'right_heel':
    case 'right_foot_index':
      return 'yellow'
    
    default:
      return 'white'
  }
}

// Angles to measure
  // ears to eyes to measure angle of head
  // measure eye direction using ears and eyes?
  // hip angle
  // head drop
  // shoulder rotation
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Dashboard = ({
  handleVideoUpload,
  setVideoSourceURL,
  videoSourceURL,
  poseData,
  poseStats,
  videoHidden,
  hideVideo,
  colourEnabled,
  enableColour,
}) => {

  const buttonStyle = {
    color: 'white',
    backgroundColor: 'darkgreen',
    '&:hover': { backgroundColor: 'green' }
  };

  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.3)', // Frosted glass effect
        backdropFilter: 'blur(1px)', // Blur effect
        borderRadius: '10px', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
          id="video-upload"
        />
        <label htmlFor="video-upload">
          <Button variant="contained" component="span" sx={buttonStyle}>
            Upload Video
          </Button>
        </label>

        <Button 
          onClick={() => {
            setVideoSourceURL('/sample_tiger.mp4')
            document.getElementById('video-upload').value = ""; 
          }} 
          sx={buttonStyle}
        >
          Use Sample Video
        </Button>
      </Box>

      <Box sx={{ height: '10px' }}></Box>


      {videoSourceURL &&  
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body">Options:&nbsp; </Typography>
          <Button 
            onClick={hideVideo}
            sx={buttonStyle}
          >
            {!videoHidden ? 'Hide Video' : 'Show Video'}
          </Button>
          <Box sx={{ width: '10px' }}></Box>
          <Button 
            onClick={enableColour}
            sx={buttonStyle}
          >
            {!colourEnabled ? 'Enable Coloured Limbs' : 'Disable Coloured Limbs'}
          </Button>
        </Box>
      }

      {videoSourceURL && poseData && poseStats &&  
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap', 
            maxWidth: '400px',
          }}
        >
          {Object.entries(poseStats).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', margin: '4px 10px 0 10px' }}>
              <Typography variant="caption">
                {key}:&nbsp;
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>
                {value}
              </Typography>
            </Box>
          ))}

        </Box>
      }
    </Box>
  );
};

export default Dashboard;

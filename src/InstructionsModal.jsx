import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InstructionsModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: { xs: '90vw', sm: '80vw', md: '60vw' },
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          p: 3,
          boxShadow: 24,
          position: 'relative'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.primary',
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        
        <Typography id="modal-title" variant="h6" component="h2">
          How To Use
        </Typography>
        <Box id="modal-description" sx={{ mt: 2 }}>
          <ol>
            <li>Upload a video of your golf swing</li>
            <li>Wait 3-5 seconds for the model to load</li>
            <li>Play the video and the model will automatically start</li>
            <li>Use the in-video control bar to navigate through your video and adjust playback speed</li>
            <li>Optional: toggle menu options as needed</li>
          </ol>
        </Box>
      </Box>
    </Modal>
  );
};

export default InstructionsModal;

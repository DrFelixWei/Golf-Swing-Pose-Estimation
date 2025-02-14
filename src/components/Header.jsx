import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const Header = ({
    openModal
}) => {


  return (
    <Box width="550px" display="flex" alignItems="center" justifyContent="center" padding={2}>

        <img 
            src="/Icon_Golfer2.png" 
            alt="golfer_icon"
            style={{ height: '50px', filter: 'invert(1)' }} 
        />

        <Typography variant="h3">SwingSync</Typography>

        <Tooltip title="Help">
            <IconButton onClick={openModal} style={{ marginLeft: '10px' }}>
                <HelpOutline style={{ backgroundColor: '#e2dfdb', fontSize: 30, borderRadius: '50%' }} />
            </IconButton>
        </Tooltip>

    </Box>
  );
};

export default Header;

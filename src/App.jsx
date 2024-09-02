import React from 'react';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { styled,  ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Main from './Main';

const theme = createTheme({
  palette: {
    background: {
      default: '#0c2830',
    },
    text: {
      primary: '#F5F5F5',
    },
  },
});

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  position: 'relative',
  height: '100vh',
  width: '100vw',
  maxWidth: '100vh',
  // maxWidth: '720px',
  overflow: 'hidden',
  // overflowX: 'hidden',
  // overflowY: 'auto',
  // scrollbarWidth: 'none', /* Firefox */
  // msOverflowStyle: 'none', /* IE and Edge */
  // '&::-webkit-scrollbar': {
  //   display: 'none', /* Chrome, Safari, Opera */
  // },
}));


function App() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(isSmallScreen)
  
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            <Main/>
        </Box>
      </Root>
  </ThemeProvider>
  );
}

export default App;

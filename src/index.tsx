import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './components/App';
import JoinRoom from './components/JoinRoom';
import CreateRoom from './components/CreateRoom';
import WaitingRoom from './components/WaitingRoom';
import GamePage from './components/GamePage';

import io from 'socket.io-client';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const socket = io(`http://${BACKEND_HOST}:${BACKEND_PORT}`);

socket.on('connect', () => {
  // nothing to do
});

socket.on('connect_error', (error) => {
  console.log(error);
});

socket.on('disconnect', (reason) => {
  console.log(reason);
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/join' element={<JoinRoom socket={socket} />} />
          <Route path='/create' element={<CreateRoom socket={socket} />} />
          <Route path='/waiting' element={<WaitingRoom socket={socket} />} />
          <Route path='/game' element={<GamePage socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

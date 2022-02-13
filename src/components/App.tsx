import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Stack,
  Typography,
} from '@mui/material';

const App: React.FC = () => {
  useEffect(() => {
    document.title = 'Open Jinro';
  }, [])
  const navigate = useNavigate();

  /**
   * 「ルームに参加」ボタン押下イベント
   */
  const handleJoinRoom = () => {
    navigate('/join');
  };

  /**
   * 「ルームを作成」ボタン押下イベント
   */
  const handleCreateRoom = () => {
    navigate('/create');
  };

  return (
    <Stack spacing={2} direction='column' margin={4}>
      <Typography variant='h1' component='div' gutterBottom>
        OPEN JINRO
      </Typography>
      <Typography variant='subtitle1' component='div' gutterBottom>
        オンライン人狼ゲームアプリケーション
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button fullWidth variant='contained' onClick={handleJoinRoom}>ルームに参加</Button>
        <Button fullWidth variant='outlined' onClick={handleCreateRoom}>ルームを作成</Button>
      </Stack>
    </Stack>
  );
}

export default App;

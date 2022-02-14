import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from 'socket.io-client';
import { Room } from '../types/room';
import { User, initUser } from '../types/user';
import {
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';

type Props = {
  socket: Socket,
};

const JoinRoom: React.FC<Props> = ({ socket }) => {
  const [user, setUser] = useState<User>(initUser);
  const [roomId, setRoomId] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    // client <--- server
    socket.on('connect', () => {
      console.log(`[${socket.id}] connect`);
    });

    socket.on('disconnect', () => {
      console.log(`[${socket.id}] disconnect`);
    });

    socket.on('join', (room: Room, user: User) => {
      sessionStorage.setItem('roomId', room.id);
      sessionStorage.setItem('userId', user.id);
      navigate('/waiting');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('join');
    };
  }, [navigate, socket]);

  useEffect(() => {
    setHasError(user.name === '' || roomId === '');
  }, [user.name, roomId]);

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
  }

  const handleChangeRoomId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const handleJoin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    socket.emit('join', roomId, user);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate("/");
  };

  return (
    <Stack spacing={2} direction='column' margin={4}>
      <Typography variant='h2' component='div' gutterBottom>
        ルームに参加
      </Typography>
      <TextField required id='formUserName' label='ユーザー名'
        error={user.name === ''}
        value={user.name} onChange={handleChangeUserName}
      />
      <TextField required id='formUserName' label='ルームID'
        error={roomId === ''}
        value={roomId} onChange={handleChangeRoomId}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button fullWidth variant='outlined' onClick={handleBack}>戻る</Button>
        <Button fullWidth variant='contained' onClick={handleJoin} disabled={hasError}>参加</Button>
      </Stack>
    </Stack>
  );
};

export default JoinRoom;

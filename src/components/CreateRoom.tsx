import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Room, initRoom } from '../types/room';
import { Rule } from '../types/rule';
import { User, initUser } from '../types/user';
import {
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

type Props = {
  socket: Socket,
};

const CreateRoom: React.FC<Props> = ({ socket }) => {
  const [user, setUser] = useState<User>(initUser);
  const [room, setRoom] = useState<Room>(initRoom);
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

    socket.on('create', (room: Room, user: User) => {
      sessionStorage.setItem('roomId', room.id);
      sessionStorage.setItem('userId', user.id);
      navigate('/waiting');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('create');
    };
  }, []);

  useEffect(() => {
    setHasError(user.name === '');
  });

  /**
   * ユーザー名が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
  };

  /**
   * 人狼の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeWereWolves = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, wereWolves: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 占い師の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeFortuneTellers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, fortuneTellers: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 霊媒師の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeMediumns = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, mediumns: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 狩人（騎士）の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeHunters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, hunters: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 狂人の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeManiacs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, maniacs: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 村人の数が変更されたときのイベントハンドラ
   * @param e イベント引数
   */
  const handleChangeVillagers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp: Rule = { ...room.rule, villagers: Number(e.target.value) };
    setRoom({ ...room, rule: { ...tmp } });
  };

  /**
   * 「作成」ボタン押下イベント
   * @param e イベント引数
   */
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    socket.emit('create', room, user);
  };

  /**
   * 「戻る」ボタン押下イベント
   */
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Stack spacing={2} direction='column' margin={4}>
      <Typography variant='h2' component='div' gutterBottom>
        ルームを作成
      </Typography>
      <TextField required id='formUserName' label='ユーザー名'
        error={user.name === ''}
        value={user.name} onChange={handleChangeUserName}
      />
      <TextField type='number' id='formWerewolves' label='人狼'
        InputProps={{ inputProps: { min: 1 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.wereWolves} onChange={handleChangeWereWolves}
      />
      <TextField type='number' id='formFortuneTellers' label='占い師'
        InputProps={{ inputProps: { min: 0 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.fortuneTellers} onChange={handleChangeFortuneTellers}
      />
      <TextField type='number' id='formMediums' label='霊媒師'
        InputProps={{ inputProps: { min: 0 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.mediumns} onChange={handleChangeMediumns}
      />
      <TextField type='number' id='formHunters' label='狩人（騎士）'
        InputProps={{ inputProps: { min: 0 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.hunters} onChange={handleChangeHunters}
      />
      <TextField type='number' id='formManiacs' label='狂信者'
        InputProps={{ inputProps: { min: 0 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.maniacs} onChange={handleChangeManiacs}
      />
      <TextField type='number' id='formVillagers' label='村人'
        InputProps={{ inputProps: { min: 1 } }} InputLabelProps={{ shrink: true }}
        value={room.rule.villagers} onChange={handleChangeVillagers}
      />
      <TextField id='formPlayers' label='プレイ人数 (自動計算)'
        InputProps={{ readOnly: true }}
         value={room.rule.wereWolves + room.rule.fortuneTellers + room.rule.mediumns + room.rule.hunters + room.rule.maniacs + room.rule.villagers}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button fullWidth variant='outlined' onClick={handleBack}>戻る</Button>
        <Button fullWidth variant='contained' onClick={handleCreate} disabled={hasError}>作成</Button>
      </Stack>
      
    </Stack>
  );
}

export default CreateRoom;
